import Question from "../models/questions";
import Tag from "../models/tags";
import { IQuestionDocument, IAnswer, ITag, SortOrder, IQuestion } from "../types/types";
import { ITagDB, IAnswerDB } from "../scripts/script_types";
import mongoose from "mongoose";
import { openai } from "../config/openai";
import sanitizeHtml from "sanitize-html";

/**
 * Formats a tag object to ensure consistent structure
 * @param tag - The tag to format, can be ITagDB, ITag or ObjectId
 * @returns Formatted tag object with _id and name
 */
export const formatTag = (
  tag: ITagDB | ITag | mongoose.Types.ObjectId
) => ({
  _id: tag instanceof mongoose.Types.ObjectId ? tag.toString() : tag._id?.toString() || "",
  name: tag instanceof mongoose.Types.ObjectId ? "" : tag.name,
});

/**
 * Formats an answer object to ensure consistent structure
 * @param answer - The answer to format, can be IAnswerDB or ObjectId
 * @returns Formatted answer object or null if input is ObjectId
 */
export const formatAnswer = (answer: IAnswerDB | mongoose.Types.ObjectId) =>
  answer instanceof mongoose.Types.ObjectId
    ? null
    : { ...answer, _id: answer._id?.toString() };

/**
 * Formats a question document to ensure consistent structure
 * @param question - The question document to format
 * @returns Formatted question object with string IDs and formatted tags/answers
 */
export const formatQuestion = (question: IQuestionDocument) => {
  // Check if question is null or undefined
  if (!question) {
    console.error("Question is null or undefined");
    return null;
  }

  const questionObj = question.toObject ? question.toObject() : question;


  try {
    return {
      ...questionObj,
      _id: question._id.toString(),
      tags: question.tags.map(formatTag),
      answers: question.answers?.map(formatAnswer).filter(Boolean) || [],
    };
  } catch (error) {
    console.error("Error in formatQuestion:", error);
    try {
      const questionData = JSON.parse(JSON.stringify(question));
      return {
        ...questionData,
        _id: questionData._id.toString(),
        tags: questionData.tags.map(formatTag),
        answers: questionData.answers?.map(formatAnswer).filter(Boolean) || [],
      };
    } catch (jsonError) {
      console.error("JSON serialization also failed:", jsonError);
      return null;
    }
  }
};

/**
 * Gets the timestamp of the most recent answer
 * @param answers - Array of answers to check
 * @returns Timestamp of the most recent answer, or 0 if no answers
 */
export const getLatestAnswerTimestamp = (answers: IAnswer[]) =>
  Math.max(
    ...answers.map(ans =>
      ans.ans_date_time ? new Date(ans.ans_date_time).getTime() : 0
    )
  );

/**
 * Creates a new question with the provided data
 * @param data - Question document data including title, text, tags etc
 * @returns Newly created and formatted question
 */
export const createQuestion = async (data: IQuestionDocument) => {
  try {
    const tagIds = await Promise.all(
      data.tags.map(async ({ name }: { name: string }) => {
        let tag = await Tag.findByName(name);
        if (!tag) {
          tag = await Tag.createTag(name);
        }
        return tag._id;
      })
    );

    const question = await Question.create({
      title: data.title,
      text: data.text,
      asked_by: data.asked_by,
      ask_date_time: new Date(),
      tags: tagIds,
      answers: [],
      views: 0,
    });

    const populatedQuestion = await question.populate("tags");
    return formatQuestion(populatedQuestion);
  } catch (err) {
    console.error("Error creating question:", err);
    return null;
  }
};


/**
 * Fetches a question by its ID and increments its view count
 * @param qid - Question ID to find
 * @returns Formatted question object or null if not found
 */
export const findQuestionById = async (qid: string) => {
  if (!qid) return null;
  try {
    const question = await Question.findById(qid)
      .populate({
        path: "answers",
        options: { sort: { ans_date_time: -1 }, lean: true },
      })
      .populate("tags");

    if (!question) return null;
    await question.incrementViews();
    return formatQuestion(question);
  } catch (error) {
    console.error("Error in findQuestionById:", error);
    return null;
  }
};

/**
 * Fetches and filters questions based on provided parameters
 * @param params - Object containing order and search parameters
 * @param params.order - Sort order ('newest', 'active', or 'unanswered')
 * @param params.search - Search string to filter questions
 * @returns Array of formatted and filtered questions
 */
export const findQuestions = async ({ order = "newest" as SortOrder, search = "" }) => {
  try {
    const rawQuestions = await Question.findRecentQuestions();
    let questions = rawQuestions.map(q => formatQuestion(q as unknown as IQuestionDocument));
    const strategies = {
      newest: (qs: IQuestion[]) => qs,
      unanswered: (qs: IQuestion[]) => qs.filter(q => q.answers.length === 0),
      active: (qs: IQuestion[]) => qs.sort((a, b) => {
        if (!a.answers.length) return 1;
        if (!b.answers.length) return -1;
        return getLatestAnswerTimestamp(b.answers as IAnswer[]) - getLatestAnswerTimestamp(a.answers as IAnswer[]);
      }),
    };

    questions = strategies[order](questions);

    if (search) {
      const terms = search.toLowerCase().split(" ").filter(Boolean);
      questions = questions.filter(question =>
        terms.some(term => {
          if (term.startsWith("[") && term.endsWith("]")) {
            const tagTerm = term.slice(1, -1);
            return question.tags.some((tag: ITag) => tag.name.toLowerCase().includes(tagTerm));
          }
          return (
            question.title.toLowerCase().includes(term) ||
            question.text.toLowerCase().includes(term)
          );
        })
      );
    }

    return questions;
  } catch (error) {
    console.error("Error in findQuestions:", error);
    return [];
  }
};

/**
 * Fetches an AI answer for a question
 * @param qid - Question ID to find
 * @returns AI answer or null if not found
 */
export const getAIAnswer = async (qid: string): Promise<string | null> => {
  try {
    const question = await Question.findById(qid);
    if (!question) return null;

    const { title, text } = question;
    const prompt = `
      You are a helpful assistant that can answer questions.
      Here is the question: ${title} ${text}
      Please provide a detailed and accurate answer to the question.
      Your response should be in a clear and concise format, with proper formatting and structure.
      Ensure your answer is well-researched and based on the available information.
      If you don't have enough information to answer the question, respond with "I don't know."
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    return response?.choices[0]?.message?.content || "Sorry, I could not generate an answer at this time.";
  } catch (err) {
    console.error("Error getting AI answer:", err);
    return "Sorry, I could not generate an answer at this time.";
  }
};


/**
 * Adds a comment to a question
 * @param qid - ID of the question to which the comment should be added
 * @param comment - Comment object containing `text` (required) and optional `comment_by`
 * @returns An object containing a success message and the newly added comment
 * @throws Error if the question is not found
 * @description Finds the question by ID and appends a new comment with a timestamp.
 *              If the commenter is not provided, defaults to "anonymous".
 *              Saves the updated question and returns the new comment metadata.
 */
export const addComment = async (
  qid: string,
  comment: { text: string; comment_by?: string }
) => {
  const question = await Question.findById(qid);

  if (!question) {
    throw new Error("Question not found");
  }

  const sanitizedText = sanitizeHtml(comment.text, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a'],
    allowedAttributes: {
      a: ['href', 'target'],
    },
    allowedSchemes: ['http', 'https'],
    transformTags: {
      a: (tagName: string, attribs: Record<string, string>) => ({
        tagName,
        attribs: {
          ...attribs,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    },
  });

  const commentObj = {
    text: sanitizedText,
    comment_by: comment.comment_by || "anonymous",
    comment_time: new Date(),
  };

  question.comments.push(commentObj);

  try {
    await question.save();
  } catch (err) {
    console.error("Error adding comment:", err);
    throw new Error("Error adding comment");
  }

  return {
    message: "Comment added successfully",
    comment: commentObj,
  };
};
