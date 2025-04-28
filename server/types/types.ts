import mongoose from "mongoose";
import { IAnswerDB, IQuestionDB, ITagDB } from "../scripts/script_types";

/**
 * A type representing a question object
 * Use this type to define the shape of a question returned from Questions collection
 * @property {string} _id - The unique identifier of the question
 * @property {string} title - The title of the question
 * @property {string} text - The body of the question
 * @property {ITag[]} tags - The tags associated with the question
 * @property {IAnswer[]} answers - The answers to the question
 * @property {string} asked_by - The user who asked the question
 * @property {string} ask_date_time - The date and time the question was asked
 * @property {number} views - The number of views the question has
 * @property {number} votes - The number of votes the question has
 */
export interface IQuestion {
  _id?: string;
  title: string;
  text: string;
  tags: ITag[];
  answers: (IAnswer | mongoose.Types.ObjectId)[];
  asked_by?: string;
  ask_date_time: string;
  views: number;
  votes: number;
  comments?: {
    text: string;
    comment_by?: string;
    comment_time: Date;
  }[];
}

/**
 * A type representing an answer object
 * Use this type to define the shape of an answer returned from Answers collection
 * @property {string} _id - The unique identifier of the answer
 * @property {string} text - The body of the answer
 * @property {string} ans_by - The user who answered the question
 * @property {string} ans_date_time - The date and time the answer was posted
 */
export interface IAnswer {
  _id?: string;
  text: string;
  ans_by: string;
  ans_date_time: string;
}

/**
 * A type representing a tag object
 * Use this type to define the shape of a tag returned from Tags collection
 * @property {string} _id - The unique identifier of the tag
 * @property {string} name - The name of the tag
 */
export interface ITag {
  _id: string;
  name: string;
}

/**
 * A type representing a tag count object
 * Use this type to define the shape of tag statistics
 * @property {string} name - The name of the tag
 * @property {number} qcnt - The number of questions with this tag
 */
export interface ITagCount {
  name: string;
  qcnt: number;
}

/**
 * A type representing the request body for adding a new question
 * @property {string} title - The title of the question
 * @property {string} text - The body of the question
 * @property {{name: string}[]} tags - The tags associated with the question
 * @property {string} asked_by - The user who asked the question
 * @property {string} ask_date_time - The date and time the question was asked
 */
export interface IAddQuestionRequest {
  title: string;
  text: string;
  tags: { name: string }[];
  asked_by: string;
  ask_date_time: string;
}

/**
 * A type representing the request body for adding a new answer
 * @property {string} qid - The id of the question
 * @property {Object} ans - The answer to the question
 * @property {string} ans.text - The body of the answer
 * @property {string} ans.ans_by - The user who answered
 * @property {string} ans.ans_date_time - The date and time the answer was posted
 */
export interface IAddAnswerRequest {
  qid: string;
  ans: {
    text: string;
    ans_by: string;
    ans_date_time: string;
  };
}

/**
 * A type representing a tag document schema in the tags collection
 * @extends {Omit<mongoose.Document, "_id">}
 * @extends {Omit<ITagDB, "_id">}
 * @property {mongoose.Types.ObjectId} _id - The unique identifier of the tag document
 * @method findByName - A static method that finds a tag by name
 * @method createTag - A static method that creates a tag
 * @method findAllTags - A static method that finds all tags
 */
export interface ITagDocument
  extends Omit<mongoose.Document, "_id">,
  Omit<ITagDB, "_id"> {
  _id: mongoose.Types.ObjectId;
}

/**
 * A type representing a question document schema in the questions collection
 * @extends {Omit<mongoose.Document, "_id">}
 * @extends {Omit<IQuestionDB, "_id" | "answers">}
 * @property {mongoose.Types.ObjectId} _id - The unique identifier of the question document
 * @property {mongoose.Types.Array<mongoose.Types.ObjectId | IQuestionDB["answers"][0]>} answers - The answers array containing either ObjectIds or answer objects
 * @method incrementViews - An async method that increments the views of a question by 1
 * @method addAnswer - An async method that adds an answer to a question
 * @returns {Promise<IQuestionDocument>} The updated question document
 */
export interface IQuestionDocument
  extends Omit<mongoose.Document, "_id">,
  Omit<IQuestionDB, "_id" | "answers"> {
  _id: mongoose.Types.ObjectId;
  answers: mongoose.Types.Array<
    mongoose.Types.ObjectId | IQuestionDB["answers"][0]
  >;
  incrementViews(): Promise<IQuestionDocument>;
  addAnswer(answerId: mongoose.Types.ObjectId): Promise<IQuestionDocument>;
  incrementVotes(): Promise<IQuestionDocument>;
}

/**
 * A type representing the model for the questions collection
 * @extends {mongoose.Model<IQuestionDocument>}
 * @method findQuestionsWithTag - A static method that finds questions with a specific tag
 * @param {string} tagId - The ID of the tag to search for
 * @returns {Promise<IQuestion[]>} Array of questions with the specified tag
 * @method findRecentQuestions - A static method that finds recent questions
 * @returns {Promise<IQuestion[]>} Array of recent questions
 */
export interface IQuestionModel extends mongoose.Model<IQuestionDocument> {
  findQuestionsWithTag(tagId: string): Promise<IQuestion[]>;
  findRecentQuestions(): Promise<IQuestion[]>;
}

/**
 * A type representing the model for the tags collection
 * @extends {mongoose.Model<ITag>}
 * @method findByName - A static method that finds a tag by name
 * @param {string} name - The name of the tag to find
 * @returns {Promise<ITag | null>} The found tag or null
 * @method createTag - A static method that creates a tag
 * @param {string} name - The name of the tag to create
 * @returns {Promise<ITag>} The created tag
 * @method findAllTags - A static method that finds all tags
 * @returns {Promise<ITag[]>} Array of all tags
 */
export interface ITagModel extends mongoose.Model<ITag> {
  findByName(name: string): Promise<ITag | null>;
  createTag(name: string): Promise<ITag>;
  findAllTags(): Promise<ITag[]>;
}

/**
 * A type representing a model for the answers collection
 * @extends {mongoose.Model<IAnswerDocument>}
 * @method findAllAnswers - A static method that finds all answers
 * @returns {Promise<IAnswerDocument[]>} Array of all answer documents
 */
export interface IAnswerModel extends mongoose.Model<IAnswerDocument> {
  findAllAnswers(): Promise<IAnswerDocument[]>;
}

/**
 * A type representing an answer document schema in the answers collection
 * @extends {Omit<mongoose.Document, "_id">}
 * @extends {Omit<IAnswerDB, "_id">}
 * @property {mongoose.Types.ObjectId} _id - The unique identifier of the answer document
 * @method findAllAnswers - A static method that finds all answers
 * @returns {Promise<IAnswerDocument[]>} Array of all answer documents
 */
export interface IAnswerDocument
  extends Omit<mongoose.Document, "_id">,
  Omit<IAnswerDB, "_id"> {
  _id: mongoose.Types.ObjectId;
}

/**
 * A type representing an error object
 * @property {number} status - The HTTP status code
 * @property {string} message - The error message
 * @property {string[]} errors - An array of error messages
 */
export interface IError {
  status: number;
  message: string;
  errors: string[];
  statusCode: number;
}

/**
 * A type representing a user object
 * @property {string} _id - The unique identifier of the user
 * @property {string} username - The username of the user
 * @property {string} email - The email of the user
 * @property {string} password - The hashed password of the user
 */
export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
}

/**
 * A type representing a user document schema in the users collection
 * @extends {Omit<mongoose.Document, "_id">}
 * @extends {Omit<IUser, "_id">}
 * @property {mongoose.Types.ObjectId} _id - The unique identifier of the user document
 * @method findUserByEmail - A static method that finds a user by email
 * @method createUser - A static method that creates a user
 */
export interface IUserDocument
  extends Omit<mongoose.Document, "_id">,
  Omit<IUser, "_id"> {
  _id: mongoose.Types.ObjectId;
}

/**
 * A type representing a model for the users collection
 * @extends {mongoose.Model<IUserDocument>}
 * @method findUserByEmail - A static method that finds a user by email
 * @param {string} email - The email of the user to find
 * @returns {Promise<IUserDocument | null>} The found user document or null
 * @method createUser - A static method that creates a user
 * @param {Object} userData - The user data for creating a new user
 * @param {string} userData.username - The username for the new user
 * @param {string} userData.email - The email for the new user
 * @param {string} userData.password - The hashed password for the new user
 * @returns {Promise<IUserDocument>} The newly created user document
 */
export interface IUserModel extends mongoose.Model<IUserDocument> {
  findUserByEmail(email: string): Promise<IUserDocument | null>;
  findUserByUsername(username: string): Promise<IUserDocument | null>;
  createUser(userData: { username: string; email: string; password: string }): Promise<IUserDocument>;
}

/**
 * A type representing the possible order options for sorting questions
 * @typedef {("newest" | "unanswered" | "active")} SortOrder
 */
export type SortOrder = "newest" | "unanswered" | "active";
