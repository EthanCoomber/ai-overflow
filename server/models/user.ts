import mongoose from "mongoose";
import UserSchema from "./schema/user";
import { IUserDocument, IUserModel } from "../types/types";

/**
 * User model for the User collection
 * @description Creates a mongoose model for the User collection using the User schema.
 * The model is defined with two generic parameters: IUserDocument and IUserModel.
 * IUserDocument defines the document instance methods and properties.
 * IUserModel defines the static model methods.
 * 
 * @property {string} username - The username of the user (required)
 * @property {string} email - The email of the user (required, unique)
 * @property {string} password - The hashed password of the user (required)
 * 
 * @method findUserByEmail - Static method to find a user by email
 * @method findUserByUsername - Static method to find a user by username
 * @method createUser - Static method to create a new user
 */
export const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);

export default User;
