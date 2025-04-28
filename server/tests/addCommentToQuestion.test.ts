
// To run: NODE_ENV=test OPENAI_API_KEY=dummy npx jest
import { Request, Response } from 'express';
import questionController from '../controllers/questionController';
import * as questionService from '../services/questionService';

// Mock the questionService module
jest.mock('../services/questionService');

// Mock the Question model
jest.mock('../models/schema/question');

describe('questionController.addCommentToQuestion', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: Record<string, unknown>;

    beforeEach(() => {
        mockRequest = {
            params: { qid: '123' },
            body: { text: 'This is a test comment', comment_by: 'testUser' },
        };
        responseObject = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockImplementation((data) => {
                responseObject = data;
                return mockResponse;
            }),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add a comment successfully and return 200 status', async () => {
        const mockComment = {
            text: 'This is a test comment',
            comment_by: 'testUser',
            comment_time: new Date(),
        };
        const mockResult = {
            message: 'Comment added successfully',
            comment: mockComment,
        };

        (questionService.addComment as jest.Mock).mockResolvedValue(mockResult);

        await questionController.addCommentToQuestion(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.addComment).toHaveBeenCalledWith('123', {
            text: 'This is a test comment',
            comment_by: 'testUser',
        });
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
        expect(responseObject).toEqual(mockResult);
    });

    it('should return 400 status when user is not found', async () => {
        const error = new Error('User not found');
        (questionService.addComment as jest.Mock).mockRejectedValue(error);

        await questionController.addCommentToQuestion(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.addComment).toHaveBeenCalledWith('123', {
            text: 'This is a test comment',
            comment_by: 'testUser',
        });
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'User not found',
        });
    });

    it('should return 404 status when question is not found', async () => {
        const error = new Error('Question not found');
        (questionService.addComment as jest.Mock).mockRejectedValue(error);

        await questionController.addCommentToQuestion(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.addComment).toHaveBeenCalledWith('123', {
            text: 'This is a test comment',
            comment_by: 'testUser',
        });
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Question not found',
        });
    });

    it('should return 500 status for other errors', async () => {
        const error = new Error('Unexpected error');
        (questionService.addComment as jest.Mock).mockRejectedValue(error);

        await questionController.addCommentToQuestion(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.addComment).toHaveBeenCalledWith('123', {
            text: 'This is a test comment',
            comment_by: 'testUser',
        });
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Unexpected error',
        });
    });

    it('should reject malicious comment with script tags', async () => {
        mockRequest.params = { qid: '67d0e8e6f9512f1f28a74d93' };
        mockRequest.body.text = '<script>alert("XSS")</script>';

        const mockResult = {
            message: 'Comment added successfully',
            comment: {
                text: 'alert("XSS")',
                comment_by: 'testUser',
                comment_time: expect.any(Date),
            },
        };
        (questionService.addComment as jest.Mock).mockResolvedValue(mockResult);

        await questionController.addCommentToQuestion(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.addComment).toHaveBeenCalledWith(
            '67d0e8e6f9512f1f28a74d93',
            expect.objectContaining({
                text: '<script>alert("XSS")</script>',
                comment_by: 'testUser',
            })
        );
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
        expect(responseObject).toEqual(mockResult);
    });

    it('should reject empty comment text', async () => {
        mockRequest.body.text = '';

        await questionController.addCommentToQuestion(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Comment text is required and must be a string',
        });
    });

    it('should reject overly long comment text', async () => {
        mockRequest.body.text = 'A'.repeat(1001);

        await questionController.addCommentToQuestion(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Comment text is too long',
        });
    });
});
