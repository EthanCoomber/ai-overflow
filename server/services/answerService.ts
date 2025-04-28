/**
 * Service module for handling answer-related operations
 * @module services/answerService
 */

import Question from "../models/questions";
import Answer from "../models/answers";
import { IAddAnswerRequest } from "../types/types";
import mongoose from "mongoose";

/**
 * Creates a new answer for a question and associates it with the question
 * @async
 * @param {IAddAnswerRequest} data - The answer data containing question ID and answer details
 * @returns {Promise<Object>} The created answer object with stringified _id
 * @throws {Error} If the question is not found
 * @description 
 * 1. Creates the answer document
 * 2. Finds the associated question
 * 3. Links the answer to the question
 * 4. If question not found, deletes the created answer
 */
export const createAnswer = async (data: IAddAnswerRequest) => {
  const qid = data.qid;
  if (!mongoose.Types.ObjectId.isValid(qid)) {
    throw new Error("Invalid question ID");
  }

  // data.qid is validated and safely cast to ObjectId
  const objectId = new mongoose.Types.ObjectId(qid);

  const [question, answer] = await Promise.all([
    Question.findOne({ _id: objectId }),
    Answer.create({
      text: data.ans.text,
      ans_by: data.ans.ans_by,
      ans_date_time: new Date(),
    }),
  ]);

  if (!question) {
    await Answer.findByIdAndDelete(answer._id);
    throw new Error("Question not found");
  }

  await question.addAnswer(answer._id);

  return {
    ...answer.toObject(),
    _id: answer._id?.toString(),
  };
};

