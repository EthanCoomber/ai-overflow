// src/controllers/questionController.ts
import { Request, Response } from "express";
import * as questionService from "../services/questionService";
import Question from "../models/questions";
import { IAnswer, ITag, SortOrder } from "../types/types";

/**
 * Controller to handle adding a new question
 * @param {Request} req - Express request object containing question data in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when the question is created
 * @description Creates a new question using the question service and returns the result.
 *              If an error occurs, returns a 500 status code with error details.
 */
const addQuestion = async (req: Request, res: Response) => {
  try {
    const result = await questionService.createQuestion(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

/**
 * Controller to handle fetching a question by its ID
 * @param {Request} req - Express request object containing the question ID in the params
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when the question is found
 * @description Fetches a question by its ID using the question service and returns the result.
 *              If the question is not found, returns a 404 status code with a message.
 *              If an error occurs, returns a 500 status code with error details.
 */
const getQuestionById = async (req: Request, res: Response) => {
  try {
    const { qid } = req.params;
    const result = await questionService.findQuestionById(qid);
    if (!result) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

/**
 * Controller to handle fetching all questions
 * @param {Request} req - Express request object containing optional order and search parameters
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when the questions are fetched
 * @description Fetches all questions using the question service and returns the result.
 *              Supports ordering and searching via query parameters.
 *              Formats the response by converting ObjectIds to strings.
 *              If an error occurs, returns a 500 status code with error details.
 */
const getQuestions = async (req: Request, res: Response) => {
  try {
    const { order, search } = req.query;
    const result = await questionService.findQuestions({
      order: order as SortOrder,
      search: search as string,
    });
    const questions = result.map((question) => {
      return {
        ...question,
        tags: question.tags.map((tag: ITag) => {
          return {
            ...tag,
            _id: tag._id.toString(),
          };
        }),
        answers: question.answers.map((answer: IAnswer) => {
          return {
            ...answer,
            _id: answer._id?.toString(),
          };
        }),
        comments: question.comments || [],
      };
    });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

/**
 * Controller to handle fetching an AI answer for a question
 * @param {Request} req - Express request object containing the question ID in the params
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when the AI answer is fetched
 * @description Fetches an AI answer for a question by its ID using the question service and returns the result.
 *              If an error occurs, returns a 500 status code with error details.
 */
const getAIAnswer = async (req: Request, res: Response) => {
  try {
    const { qid } = req.params;
    const result = await questionService.getAIAnswer(qid);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

/**
 * Controller to handle upvoting a question by its ID
 * @param {Request} req - Express request object containing the question ID in the params
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when the question is upvoted
 * @description Increments the vote count of the question with the given ID using the model method.
 *              If the question does not exist, returns a 404 response.
 *              Otherwise, returns the updated vote count. On failure, returns a 500 status code.
 */
const upvoteQuestion = async (req: Request, res: Response) => {
  try {
    const { qid } = req.params;
    const question = await Question.findById(qid);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    await question.incrementVotes();

    res.status(200).json({ message: "Upvoted", votes: question.votes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Controller to handle adding a comment to a specific question
 * @param {Request} req - Express request object containing the question ID in the params and comment data in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when the comment is added
 * @description Adds a new comment to the question with the given ID using the question service.
 *              The request body should contain `text` and optionally `comment_by`.
 *              Returns the updated comment response or an error if the process fails.
 */
const addCommentToQuestion = async (req: Request, res: Response) => {
  try {
    const qid = req.params.qid;
    const { text, comment_by } = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ message: 'Comment text is required and must be a string' });
    }
    if (text.length > 1000) { // Arbitrary limit to prevent abuse
      return res.status(400).json({ message: 'Comment text is too long' });
    }
    if (comment_by && typeof comment_by !== 'string') {
      return res.status(400).json({ message: 'Commenter name must be a string' });
    }


    const result = await questionService.addComment(qid, {
      text,
      comment_by,
    });

    res.status(200).json(result);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'User not found') {
      return res.status(400).json({ message: 'User not found' });
    }
    if (err instanceof Error && err.message === 'Question not found') {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(500).json({ message: (err as Error).message || 'Internal Server Error' });
  }
};

/**
 * @module questionController
 * @exports {Object} Controller methods for handling question-related requests
 * @property {Function} addQuestion - Method to add a new question
 * @property {Function} getQuestionById - Method to fetch a question by ID
 * @property {Function} getQuestions - Method to fetch all questions with optional filtering
 * @property {Function} getAIAnswer - Method to fetch an AI answer for a question
 */
export default {
  addQuestion,
  getQuestionById,
  getQuestions,
  getAIAnswer,
  upvoteQuestion,
  addCommentToQuestion,
};
