import mongoose from "mongoose";
import { ITagDocument, ITagModel } from "../../types/types";

/**
 * The schema for a document in the Tags collection.
 * 
 * @description The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: ITagDocument and ITagModel.
 * ITagDocument is used to define the instance methods of the Tag document.
 * ITagModel is used to define the static methods of the Tag model.
 * 
 * @property {string} name - The name of the tag (required)
 */
const TagSchema = new mongoose.Schema<ITagDocument, ITagModel>(
  {
    name: {
      type: String,
      required: true
    }
  },
  { collection: "Tag" }
);

/**
 * Find a tag by name
 * @method findByName
 * @static
 * @async
 * @param {string} name - The name of the tag to find
 * @returns {Promise<ITagDocument | null>} A promise that resolves to the tag document if found, null otherwise
 * @description Queries the database for a tag with the specified name using lean queries
 */
TagSchema.statics.findByName = async function(name: string): Promise<ITagDocument | null> {
  return await this.findOne({ name: name });
};

/**
 * Find all tags in the collection
 * @method findAllTags
 * @static
 * @async
 * @returns {Promise<ITagDocument[]>} A promise that resolves to an array of tag documents
 * @description Retrieves all tags from the database using lean queries for better performance
 */
TagSchema.statics.findAllTags = async function(): Promise<ITagDocument[]> {
  return await this.find();
};

/**
 * Create a new tag
 * @method createTag
 * @static
 * @async
 * @param {string} name - The name for the new tag
 * @returns {Promise<ITagDocument>} A promise that resolves to the newly created tag document
 * @description Creates a new tag document in the database with the specified name
 */
TagSchema.statics.createTag = async function(name: string): Promise<ITagDocument> {
  const tag = await this.create({ name });
  return tag as unknown as ITagDocument;
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
TagSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

export default TagSchema;
