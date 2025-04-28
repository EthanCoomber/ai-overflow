import mongoose from "mongoose";
import QuestionSchema from "./schema/question";
import { IQuestionDocument, IQuestionModel } from "../types/types";

/**
 * Question model for the Question collection
 * @description Creates a mongoose model for the Question collection using the Question schema.
 * The model is defined with two generic parameters: IQuestionDocument and IQuestionModel.
 * IQuestionDocument defines the document instance methods and properties.
 * IQuestionModel defines the static model methods.
 * 
 * @property {string} title - The title of the question (required)
 * @property {string} text - The text content of the question (required)
 * @property {string} asked_by - The username of the question author (required)
 * @property {Date} ask_date_time - The timestamp when the question was created (required)
 * @property {number} views - The number of times the question has been viewed (defaults to 0)
 * @property {number} votes - The number of votes for a question (defaults to 0)
 * @property {ObjectId[]} comments - Array of Comments
 * @property {ObjectId[]} answers - Array of references to Answer documents
 * @property {ObjectId[]} tags - Array of references to Tag documents
 * 
 * @method incrementViews - Instance method to increment the views count
 * @method incrementVotes - Instance method to increment the vote count
 * @method addAnswer - Instance method to add an answer reference
 * @method findQuestionsWithTag - Static method to find questions with a specific tag
 * @method findRecentQuestions - Static method to find all questions sorted by date
 */
const Question = mongoose.model<IQuestionDocument, IQuestionModel>(
  "Question",
  QuestionSchema
);

export default Question;
