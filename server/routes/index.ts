/**
 * Express router configuration module
 * @module routes/index
 * @description Defines all API routes and their handlers
 */

import { Router } from "express";
import questionController from "../controllers/questionController";
import answerController from "../controllers/answerController";
import tagController from "../controllers/tagController";
import userController from "../controllers/userController";
import { aiRateLimiter } from "../middleware/rateLimiter";


const router = Router();

// User routes
/**
 * User login
 * @route POST /user/login
 * @description Authenticates a user with credentials
 * @param {object} req.body - The user credentials (email/username and password)
 * @returns {object} 200 - User details and authentication token
 * @returns {Error} 401 - If credentials are invalid
 * @returns {Error} 500 - If an error occurs during authentication
 */
router.post('/user/login', userController.login);

/**
 * User signup
 * @route POST /user/signup
 * @description Registers a new user
 * @param {object} req.body - The user registration details
 * @returns {object} 201 - Newly created user details and authentication token
 * @returns {Error} 400 - If registration data is invalid
 * @returns {Error} 500 - If an error occurs during registration
 */
router.post('/user/signup', userController.signup);

// Tag routes
/**
 * Get all tags with their question counts
 * @route GET /tag/getTagsWithQuestionNumber
 * @description Retrieves all tags along with the number of questions for each tag
 * @returns {object} 200 - An array of tag details with question counts
 * @returns {Error} 500 - If an error occurs when fetching the tag details
 */
router.get('/tag/getTagsWithQuestionNumber', tagController.getTagsWithQuestionNumber);

// Question routes
/**
 * Add a new question
 * @route POST /question/addQuestion
 * @description Creates a new question with the provided details
 * @param {IAddQuestionRequest} req.body - The question details
 * @returns {object} 200 - A message indicating the question was added successfully
 * @returns {Error} 500 - If an error occurs when adding the question
 */
router.post('/question/addQuestion', questionController.addQuestion);

/**
 * Get a question by ID
 * @route GET /question/getQuestionById/:qid
 * @description Retrieves a specific question by its ID
 * @param {string} qid - The ID of the question
 * @returns {object} 200 - The question object
 * @returns {Error} 500 - If an error occurs when fetching the question
 */
router.get('/question/getQuestionById/:qid', questionController.getQuestionById);

/**
 * Get filtered questions
 * @route GET /question/getQuestion
 * @description Retrieves questions based on filter criteria
 * @param {string} order - The sort order (newest, etc)
 * @param {string} search - Search term to filter questions
 * @returns {object} 200 - An array of filtered question details
 * @returns {Error} 500 - If an error occurs when fetching the questions
 */
router.get('/question/getQuestion', questionController.getQuestions);

// Answer routes
/**
 * Add a new answer
 * @route POST /answer/addAnswer
 * @description Creates a new answer for a specific question
 * @param {IAddAnswerRequest} req.body - The answer details including question ID
 * @returns {object} 200 - A message indicating the answer was added successfully
 * @returns {Error} 500 - If an error occurs when adding the answer
 */
router.post('/answer/addAnswer', answerController.addAnswer);

/**
 * Get an AI answer for a question
 * @route GET /question/getAIAnswer/:qid
 * @description Retrieves an AI answer for a specific question
 * @param {string} qid - The ID of the question
 * @returns {object} 200 - The AI answer
 */
router.get('/question/getAIAnswer/:qid', aiRateLimiter, questionController.getAIAnswer);

/**
 * Upvote a question
 * @route POST /question/upvoteQuestion/:qid
 * @description Increments the vote count for question
 * @param {string} qid - The ID of the question
 * @returns {object} 200 - Question upvoted successfully
 */
router.post('/question/upvoteQuestion/:qid', questionController.upvoteQuestion);

/**
 * Add a comment to a question
 * @route POST /question/addCommentToQuestion/:qid
 * @description Adds a comment to the question identified by the provided ID
 * @param {string} qid - The ID of the question
 * @bodyParam {string} text - The text of the comment (required)
 * @bodyParam {string} [comment_by] - The user who made the comment (optional)
 * @returns {object} 200 - Comment added successfully
 */
router.post('/question/addCommentToQuestion/:qid', questionController.addCommentToQuestion);



export default router;