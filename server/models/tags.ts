import mongoose from "mongoose";
import TagSchema from "./schema/tag";
import { ITagDocument, ITagModel } from "../types/types";

/**
 * Tag model for the Tag collection
 * @description Creates a mongoose model for the Tag collection using the Tag schema.
 * The model is defined with two generic parameters: ITagDocument and ITagModel.
 * ITagDocument defines the document instance methods and properties.
 * ITagModel defines the static model methods.
 * 
 * @property {string} name - The name of the tag (required)
 * 
 * @method findByName - Static method to find a tag by name
 * @method findAllTags - Static method to find all tags in the collection
 * @method createTag - Static method to create a new tag
 */
export const Tag = mongoose.model<ITagDocument, ITagModel>("Tag", TagSchema);

export default Tag;
