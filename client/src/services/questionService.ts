/**
 * This module defines the functions to interact with the REST APIs for the questions service.
 */

import { REACT_APP_API_URL, api } from "./config";
import { QuestionType, QuestionResponseType } from "../types/entityTypes";

// The base URL for the questions API
const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

/**
 * The function calls the API to get questions based on the filter parameters.
 * returns the response data if the status is 200, otherwise throws an error.
 * @param order display order of the questions selected by the user. @default "newest"
 * @param search the search query entered by the user. @default ""
 * @returns the response data from the API, which contains the matched list of questions.
 */
const getQuestionsByFilter = async (
  order = "newest",
  search = ""
): Promise<QuestionResponseType[]> => {
  try {
    const res = await api.get(
      `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`
    );
    if (res.status !== 200) {
      throw new Error("Error when fetching or filtering questions");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

/**
 * The function calls the API to get a question by its id,
 * returns the response data if the status is 200, otherwise throws an error.
 * @param qid the id of the question to be fetched.
 * @returns the response data from the API, which contains the fetched question object.
 */
const getQuestionById = async (qid: string): Promise<QuestionResponseType> => {
  try {
    const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`);
    if (res.status !== 200) {
      throw new Error("Error when fetching question by id");
    }
    return res.data;
  } catch (error) {
    console.error(`Error fetching question ${qid}:`, error);
    throw error;
  }
};

/**
 * The function calls the API to add a new question,
 * returns the response data if the status is 200, otherwise throws an error.
 * @param q the question object to be added.
 * @returns the response data from the API, which contains the question object added.
 */
const addQuestion = async (q: QuestionType): Promise<QuestionResponseType> => {
  try {
    const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);
    if (res.status !== 200) {
      throw new Error("Error while creating a new question");
    }

    return res.data;
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
};

/**
 * The function calls the API to get an AI answer for a question,
 * returns the response data if the status is 200, otherwise throws an error.
 * @param qid the id of the question to be fetched.
 * @returns the response data from the API, which contains the AI answer.
 */
const getAIAnswer = async (qid: string): Promise<string> => {
  try {
    const res = await api.get(`${QUESTION_API_URL}/getAIAnswer/${qid}`);
    console.log("AI answer response:", res.data);
    if (res.status !== 200) {
      throw new Error("Error when fetching AI answer");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching AI answer:", JSON.stringify(error, null, 2));
    throw error;
  }
};

/**
 * The function calls the API to upvote a question by its ID.
 * @param id - The ID of the question to be upvoted.
 * @returns the response data from the API, which contains the updated vote count.
 */
const upvoteQuestion = async (qid: string): Promise<{ votes: number }> => {
  try {
    console.log("QuestionService.ts qid:", qid);
    const res = await api.post(`${QUESTION_API_URL}/upvoteQuestion/${qid}`);
    if (res.status !== 200) {
      throw new Error("Error upvoting the question");
    }
    return res.data;
  } catch (error) {
    console.error(`Error upvoting question ${qid}:`, error);
    throw error;
  }
};

/**
 * The function calls the API to add a comment to a question.
 * @param qid - The ID of the question.
 * @param comment - The comment object { text: string }
 */
const addCommentToQuestion = async (qid: string, comment: { text: string, comment_by: string }) => {
  try {
    const res = await api.post(`${QUESTION_API_URL}/addCommentToQuestion/${qid}`, comment);
    return res.data;
  } catch (error) {
    console.error(`Error adding comment to question ${qid}:`, error);
    throw error;
  }
};

export { getQuestionsByFilter, getQuestionById, addQuestion, getAIAnswer, upvoteQuestion, addCommentToQuestion };
