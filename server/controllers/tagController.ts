// src/controllers/tagController.ts
import { Request, Response } from "express";
import * as tagService from "../services/tagService";

/**
 * Controller to handle fetching tags with question count
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when the tags are fetched
 * @description Fetches tags with question count using the tag service and returns the result.
 *              If an error occurs, returns a 500 status code with error details.
 */
const getTagsWithQuestionNumber = async (req: Request, res: Response) => {
  try {
    const result = await tagService.getTagsWithQuestionCount();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

/**
 * Tag controller containing methods for tag-related operations
 * @exports {Object} Controller object containing tag-related methods
 * @property {Function} getTagsWithQuestionNumber - Method to fetch tags with their question counts
 */
export default {
  getTagsWithQuestionNumber,
};
