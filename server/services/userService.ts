/**
 * @fileoverview Service module for handling user-related operations
 * @module services/userService
 */

import User from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IUser } from "../types/types";

/**
 * Authenticates a user with provided credentials
 * @async
 * @function authenticateUser
 * @param {IUser} credentials - User login credentials (email/username and password)
 * @returns {Promise<{user: IUser, token: string}>} Object containing user details and authentication token
 * @throws {Error} If credentials are invalid or authentication fails
 * @description 
 * 1. Finds the user by email/username
 * 2. Verifies the password
 * 3. Generates a JWT token
 * 4. Returns user details and token
 */
export const authenticateUser = async (credentials: IUser) => {
  const { email, password } = credentials;
  
  // Find user by email
  const user = await User.findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }
  
  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "24h" }
  );
  
  // Return user details and token
  return {
    user: {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
    },
    token
  };
};

/**
 * Registers a new user
 * @async
 * @function registerUser
 * @param {IUserRegistration} userData - User registration details
 * @returns {Promise<{user: IUser, token: string}>} Object containing new user details and authentication token
 * @throws {Error} If registration data is invalid or user already exists
 * @description 
 * 1. Validates user input
 * 2. Checks if user already exists
 * 3. Hashes the password
 * 4. Creates a new user
 * 5. Generates a JWT token
 * 6. Returns user details and token
 */
export const registerUser = async (userData: IUser) => {
  const { username, email, password } = userData;
  
  // Validate user input
  if (!username || !email || !password) {
    throw new Error("validation failed: All fields are required");
  }
  
  // Check if user already exists
  const existingUserbyEmail = await User.findUserByEmail(email);
  const existingUserbyUsername = await User.findUserByUsername(username);
  if (existingUserbyEmail || existingUserbyUsername) {
    throw new Error("validation failed: User with this email or username already exists");
  }
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // Create new user
  const newUser = await User.createUser({
    username,
    email,
    password: hashedPassword,
  });
  
  const token = jwt.sign(
    { userId: newUser._id, email: newUser.email },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "24h" }
  );
  
  return {
    user: {
      _id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
    },
    token
  };
};
