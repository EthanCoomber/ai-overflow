// src/controllers/answerController.ts
import { Request, Response } from "express";
import * as answerService from "../services/answerService";

/**
 * Controller to handle adding a new answer
 * @param {Request} req - Express request object containing answer data in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when the answer is created
 * @description Creates a new answer using the answer service and returns the result.
 *              If an error occurs, returns a 500 status code with error details.
 */
const addAnswer = async (req: Request, res: Response) => {
  try {
    const result = await answerService.createAnswer(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

/**
 * Answer controller module
 * @module answerController
 * @exports {Object} Controller methods for handling answer-related requests
 * @property {Function} addAnswer - Method to add a new answer
 */
export default {
  addAnswer,
};
