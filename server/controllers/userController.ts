// src/controllers/userController.ts
import { Request, Response } from "express";
import * as userService from "../services/userService";

/**
 * Controller to handle user login
 * @param {Request} req - Express request object containing user credentials in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when the user is authenticated
 * @description Authenticates a user using the user service and returns user details with token.
 *              If credentials are invalid, returns a 401 status code.
 *              If an error occurs, returns a 500 status code with error details.
 */
const login = async (req: Request, res: Response) => {
  try {
    const result = await userService.authenticateUser(req.body);
    res.json(result);
  } catch (err) {
    if (err instanceof Error && err.message === "Invalid credentials") {
      res.status(401).json({ message: "Invalid credentials" });
    } else {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
};

/**
 * Controller to handle user signup
 * @param {Request} req - Express request object containing user registration details in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when the user is registered
 * @description Registers a new user using the user service and returns user details with token.
 *              If registration data is invalid, returns a 400 status code.
 *              If an error occurs, returns a 500 status code with error details.
 */
const signup = async (req: Request, res: Response) => {
  try {
    const result = await userService.registerUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("validation")) {
      if (err.message.includes("validation failed: User with this email or username already exists")) {
        res.status(409).json({ message: "User with this email or username already exists" });
      } else {
        res.status(400).json({ message: "Invalid registration data", error: err.message });
      }
    } else {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
};

/**
 * User controller module
 * @module userController
 * @exports {Object} Controller methods for handling user-related requests
 * @property {Function} login - Method to authenticate a user
 * @property {Function} signup - Method to register a new user
 */
export default {
  login,
  signup,
};
