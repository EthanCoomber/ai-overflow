import mongoose from "mongoose";
import { IAnswerModel, IAnswerDocument } from "../types/types";
import AnswerSchema from "./schema/answer";

/**
 * Answer model for the Answer collection
 * @description Creates a mongoose model for the Answer collection using the Answer schema.
 * The model is defined with two generic parameters: IAnswerDocument and IAnswerModel.
 * IAnswerDocument defines the document instance methods and properties.
 * IAnswerModel defines the static model methods.
 * 
 * @property {string} text - The text content of the answer (required)
 * @property {string} ans_by - The username of the answer author (required)
 * @property {Date} ans_date_time - The timestamp when the answer was created (required)
 * 
 * @method findAllAnswers - Static method to find all answers in the collection
 */
const Answer = mongoose.model<IAnswerDocument, IAnswerModel>(
  "Answer",
  AnswerSchema
);

export default Answer;
