import mongoose from "mongoose";
import { IAnswerDocument, IAnswerModel } from "../../types/types";

/**
 * The schema for a document in the Answer collection.
 * 
 * @description The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IAnswerDocument and IAnswerModel.
 * IAnswerDocument is used to define the instance methods of the Answer document.
 * IAnswerModel is used to define the static methods of the Answer model.
 * 
 * @property {string} text - The text content of the answer (required)
 * @property {string} ans_by - The username of the answer author (required)  
 * @property {Date} ans_date_time - The timestamp when the answer was created (required)
 */
const AnswerSchema = new mongoose.Schema<IAnswerDocument, IAnswerModel> (
  {
    text: {
      type: String,
      required: true
    },
    ans_by: {
      type: String, 
      required: true
    },
    ans_date_time: {
      type: Date,
      required: true
    }
  },
  { collection: "Answer" }
);

/**
 * Static method to find all answers in the collection
 * @method findAllAnswers
 * @static
 * @async
 * @returns {Promise<IAnswerDocument[]>} A promise that resolves to an array of answer documents
 * @description Retrieves all answers from the database using lean queries for better performance
 */
AnswerSchema.statics.findAllAnswers = async function(): Promise<IAnswerDocument[]> {
  return await this.find()
    .lean();
};

/**
 * Transform method for JSON serialization
 * @method toJSON
 * @param {Document} doc - The mongoose document being converted
 * @param {Object} ret - The plain object representation that will be returned
 * @returns {Object} The transformed object with string _id and removed __v field
 * @description Customizes how the document is transformed when converted to JSON:
 *              - Converts ObjectId to string for _id
 *              - Removes the version key (__v)
 */
AnswerSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

export default AnswerSchema;
