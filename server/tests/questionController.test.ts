import { Request, Response } from 'express';
import mongoose from 'mongoose';
import questionController from '../controllers/questionController';
import * as questionService from '../services/questionService';

// Mock dependencies
jest.mock('../services/questionService');
jest.mock('../models/questions');

describe('questionController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn().mockReturnValue({});
    responseStatus = jest.fn().mockReturnThis();
    mockResponse = {
      json: responseJson,
      status: responseStatus,
    };
    mockRequest = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addCommentToQuestion', () => {
    it('should return 400 if comment_by is provided but not a string', async () => {
      // This test specifically targets line 153 in questionController.ts
      mockRequest = {
        params: { qid: new mongoose.Types.ObjectId().toString() },
        body: {
          text: 'This is a valid comment',
          comment_by: 123 // Not a string
        }
      };

      await questionController.addCommentToQuestion(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Commenter name must be a string'
      });
      // Verify the service was not called
      expect(questionService.addComment).not.toHaveBeenCalled();
    });

    it('should return 400 if text is missing or not a string', async () => {
      mockRequest = {
        params: { qid: new mongoose.Types.ObjectId().toString() },
        body: {
          // text is missing
          comment_by: 'user123'
        }
      };

      await questionController.addCommentToQuestion(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Comment text is required and must be a string'
      });
    });

    it('should return 400 if text is too long', async () => {
      mockRequest = {
        params: { qid: new mongoose.Types.ObjectId().toString() },
        body: {
          text: 'a'.repeat(1001), // Text longer than 1000 characters
          comment_by: 'user123'
        }
      };

      await questionController.addCommentToQuestion(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Comment text is too long'
      });
    });

    it('should successfully add a comment to a question', async () => {
      const qid = new mongoose.Types.ObjectId().toString();
      const commentData = {
        text: 'This is a valid comment',
        comment_by: 'user123'
      };
      
      mockRequest = {
        params: { qid },
        body: commentData
      };

      const mockResult = {
        message: 'Comment added successfully',
        comment: {
          ...commentData,
          comment_time: new Date()
        }
      };

      (questionService.addComment as jest.Mock).mockResolvedValue(mockResult);

      await questionController.addCommentToQuestion(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(questionService.addComment).toHaveBeenCalledWith(qid, commentData);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockResult);
    });

    it('should return 404 if question is not found', async () => {
      mockRequest = {
        params: { qid: new mongoose.Types.ObjectId().toString() },
        body: {
          text: 'This is a valid comment',
          comment_by: 'user123'
        }
      };

      (questionService.addComment as jest.Mock).mockRejectedValue(new Error('Question not found'));

      await questionController.addCommentToQuestion(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Question not found'
      });
    });
  });
});
