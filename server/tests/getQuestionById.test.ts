
// To run: NODE_ENV=test npx jest
import { Request, Response } from 'express';
import questionController from '../controllers/questionController';
import * as questionService from '../services/questionService';

// Mock the questionService module
jest.mock('../services/questionService');

describe('questionController.getQuestionById', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: Record<string, unknown>;

    beforeEach(() => {
        mockRequest = {
            params: {
                qid: '679846196243c96505ba4007', // Matches OpenAPI example
            } as { qid: string }, // Ensure params is defined with qid
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

    it('should fetch a question by ID and return the question', async () => {
        const mockQuestion = {
            _id: '679846196243c96505ba4007',
            title: 'How to test controllers in Express?',
            text: 'I need help writing Jest tests for Express controllers.',
            tags: [
                { _id: 't1', name: 'jest' },
                { _id: 't2', name: 'express' },
            ],
            asked_by: 'testUser',
            ask_date_time: new Date().toISOString(),
            answers: [],
            views: 1,
            votes: 0,
            comments: [],
        };

        (questionService.findQuestionById as jest.Mock).mockResolvedValue(mockQuestion);

        await questionController.getQuestionById(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.findQuestionById).toHaveBeenCalledWith(mockRequest.params!.qid);
        expect(mockResponse.json).toHaveBeenCalledWith(mockQuestion);
        expect(responseObject).toEqual(mockQuestion);
    });

    it('should return 404 if the question is not found', async () => {
        (questionService.findQuestionById as jest.Mock).mockResolvedValue(null);

        await questionController.getQuestionById(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.findQuestionById).toHaveBeenCalledWith(mockRequest.params!.qid);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Question not found' });
        expect(responseObject).toEqual({ message: 'Question not found' });
    });

    it('should return 500 if the qid is invalid', async () => {
        mockRequest.params = { qid: 'invalid-id' } as { qid: string };

        const error = new Error('Invalid question ID');
        (questionService.findQuestionById as jest.Mock).mockRejectedValue(error);

        await questionController.getQuestionById(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.findQuestionById).toHaveBeenCalledWith(mockRequest.params!.qid);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Internal Server Error',
            error,
        });
        expect(responseObject).toEqual({
            message: 'Internal Server Error',
            error,
        });
    });

    it('should return 500 if there is a service error', async () => {
        const error = new Error('Database failure');
        (questionService.findQuestionById as jest.Mock).mockRejectedValue(error);

        await questionController.getQuestionById(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.findQuestionById).toHaveBeenCalledWith(mockRequest.params!.qid);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Internal Server Error',
            error,
        });
        expect(responseObject).toEqual({
            message: 'Internal Server Error',
            error,
        });
    });
});
