import mongoose from "mongoose";
import { IQuestionDocument, IQuestionModel, ITagDocument } from "../../types/types";

/**
 * The schema for a document in the Question collection.
 * 
 * @description The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IQuestionDocument and IQuestionModel.
 * IQuestionDocument is used to define the instance methods of the Question document.
 * IQuestionModel is used to define the static methods of the Question model.
 * 
 * @property {string} title - The title of the question (required)
 * @property {string} text - The text content of the question (required)
 * @property {string} asked_by - The username of the question author (required)
 * @property {Date} ask_date_time - The timestamp when the question was created (required)
 * @property {number} views - The number of times the question has been viewed (defaults to 0)
 * @property {ObjectId[]} comments - Array of references to Comments documents
 * @property {ObjectId[]} answers - Array of references to Answer documents
 * @property {ObjectId[]} tags - Array of references to Tag documents
 */
const QuestionSchema = new mongoose.Schema<IQuestionDocument, IQuestionModel>(
  {
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    asked_by: {
      type: String,
      required: true
    },
    ask_date_time: {
      type: Date,
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    votes: {
      type: Number,
      default: 0
    },
    answers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer'
    }],
    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }],
    comments: [
      {
        text: { type: String, required: true },
        comment_by: { type: String },
        comment_time: { type: Date, default: Date.now },
      },
    ],
  },
  { collection: "Question" }
);

// Instance methods
/**
 * Increment the views count of the question
 * @method incrementViews
 * @instance
 * @async
 * @returns {Promise<IQuestionDocument>} A promise that resolves to the updated question document
 * @description Increments the views counter by 1 and saves the document
 */
QuestionSchema.methods.incrementViews = async function (): Promise<IQuestionDocument> {
  this.views += 1;
  return await this.save();
};

// Instance methods
/**
 * Increment the vote count of the question
 * @method incrementVotes
 * @instance
 * @async
 * @returns {Promise<IQuestionDocument>} A promise that resolves to the updated question document
 * @description Increments the votes counter by 1 and saves the document
 */
QuestionSchema.methods.incrementVotes = async function (): Promise<IQuestionDocument> {
  this.votes += 1;
  return await this.save();
};

/**
 * Add an answer to the question's answers array
 * @method addAnswer
 * @instance
 * @async
 * @param {mongoose.Types.ObjectId} answerId - The ObjectId of the answer to add
 * @returns {Promise<IQuestionDocument>} A promise that resolves to the updated question document
 * @description Pushes a new answer reference to the answers array and saves the document
 */
QuestionSchema.methods.addAnswer = async function (answerId: mongoose.Types.ObjectId): Promise<IQuestionDocument> {
  this.answers.push(answerId);
  return await this.save();
};

/**
 * Find all questions that contain a specific tag
 * @method findQuestionsWithTag
 * @static
 * @async
 * @param {mongoose.Types.ObjectId} tagId - The ObjectId of the tag to search for
 * @returns {Promise<IQuestionDocument[]>} A promise that resolves to an array of matching question documents
 * @description Queries the database for questions containing the specified tag ID using lean queries
 */
QuestionSchema.statics.findQuestionsWithTag = async function (tagId: mongoose.Types.ObjectId): Promise<IQuestionDocument[]> {
  return await this.find({ tags: tagId })
    .lean();
};

/**
 * Find all questions sorted by most recent
 * @method findRecentQuestions
 * @static
 * @async
 * @returns {Promise<IQuestionDocument[]>} A promise that resolves to an array of question documents
 * @description Retrieves all questions from the database, sorted by ask_date_time in descending order.
 *              Populates the answers array (sorted by date) and tags array.
 *              Uses lean queries for better performance.
 */
QuestionSchema.statics.findRecentQuestions = async function (): Promise<IQuestionDocument[]> {
  console.log("🔥 Querying questions");
  const results = await this.find()
    .sort({ ask_date_time: -1 })
    .populate("answers")
    .populate("tags")
    .lean();
  console.log("📦 Retrieved", results.length, "questions");
  return results;
};


/**
 * Transform method for JSON serialization
 * @method toJSON
 * @param {Document} doc - The mongoose document being converted
 * @param {Object} ret - The plain object representation that will be returned
 * @returns {Object} The transformed object with string IDs and properly formatted tags
 * @description Customizes how the document is transformed when converted to JSON:
 *              - Converts ObjectId to string for _id
 *              - Properly formats tag references, converting their IDs to strings
 *              - Removes the version key (__v)
 */
QuestionSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    if (ret.tags && Array.isArray(ret.tags)) {
      ret.tags = ret.tags.map((tag: ITagDocument) =>
        typeof tag === "object" && tag._id ? { ...tag, _id: tag._id.toString() } : tag.toString()
      );
    }
    delete ret.__v;
    return ret;
  },
});

export default QuestionSchema;
