import mongoose from "mongoose";
import { IUserDocument, IUserModel } from "../../types/types";

/**
 * The schema for a document in the Users collection.
 * 
 * @description The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IUserDocument and IUserModel.
 * IUserDocument is used to define the instance methods of the User document.
 * IUserModel is used to define the static methods of the User model.
 * 
 * @property {string} username - The username of the user (required)
 * @property {string} email - The email of the user (required, unique)
 * @property {string} password - The hashed password of the user (required)
 */
const UserSchema = new mongoose.Schema<IUserDocument, IUserModel>(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { collection: "User" }
);

/**
 * Find a user by email
 * @method findUserByEmail
 * @static
 * @async
 * @param {string} email - The email of the user to find
 * @returns {Promise<IUserDocument | null>} A promise that resolves to the user document if found, null otherwise
 * @description Queries the database for a user with the specified email
 */
UserSchema.statics.findUserByEmail = async function(email: string): Promise<IUserDocument | null> {
  return await this.findOne({ email: email });
};

/**
 * Find a user by username
 * @method findUserByUsername
 * @static
 * @async
 * @param {string} username - The username of the user to find
 * @returns {Promise<IUserDocument | null>} A promise that resolves to the user document if found, null otherwise
 * @description Queries the database for a user with the specified username
 */
UserSchema.statics.findUserByUsername = async function(username: string): Promise<IUserDocument | null> {
  return await this.findOne({ username: username });
};

/**
 * Create a new user
 * @method createUser
 * @static
 * @async
 * @param {Object} userData - The user data for creating a new user
 * @param {string} userData.username - The username for the new user
 * @param {string} userData.email - The email for the new user
 * @param {string} userData.password - The hashed password for the new user
 * @returns {Promise<IUserDocument>} A promise that resolves to the newly created user document
 * @description Creates a new user document in the database with the specified data
 */
UserSchema.statics.createUser = async function(userData: { username: string; email: string; password: string }): Promise<IUserDocument> {
  const user = await this.create(userData);
  return user as unknown as IUserDocument;
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
 *              - Removes the password field for security
 */
UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export default UserSchema;
