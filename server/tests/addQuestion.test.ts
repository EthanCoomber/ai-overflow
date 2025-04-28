// To run: NODE_ENV=test npx jest
import { Request, Response } from 'express';
import questionController from '../controllers/questionController';
import * as questionService from '../services/questionService';

// Mock the questionService module
jest.mock('../services/questionService');

describe('questionController.addQuestion', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: Record<string, unknown>;

    beforeEach(() => {
        mockRequest = {
            body: {
                title: 'How to test controllers in Express?',
                text: 'I need help writing Jest tests for Express controllers.',
                tags: [{ name: 'jest' }, { name: 'express' }],
                asked_by: 'testUser',
                ask_date_time: new Date().toISOString(),
            },
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

    it('should add a new question and return the created question', async () => {
        const mockCreatedQuestion = {
            _id: '123456789',
            ...mockRequest.body,
            tags: [
                { _id: 't1', name: 'jest' },
                { _id: 't2', name: 'express' },
            ],
            answers: [],
            views: 0,
        };

        (questionService.createQuestion as jest.Mock).mockResolvedValue(mockCreatedQuestion);

        await questionController.addQuestion(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.createQuestion).toHaveBeenCalledWith(mockRequest.body);
        expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedQuestion);
        expect(responseObject).toEqual(mockCreatedQuestion);
    });

    it('should return 500 if there is a service error', async () => {
        const error = new Error('Database failure');
        (questionService.createQuestion as jest.Mock).mockRejectedValue(error);

        await questionController.addQuestion(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.createQuestion).toHaveBeenCalledWith(mockRequest.body);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Internal Server Error',
            error,
        });
    });
});
