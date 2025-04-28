import { Request, Response } from 'express';
import questionController from '../controllers/questionController';
import * as questionService from '../services/questionService';

// Mock the questionService module
jest.mock('../services/questionService');

describe('questionController.getAIAnswer', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: Record<string, unknown>;

    beforeEach(() => {
        mockRequest = {
            params: {
                qid: '67d0e8e6f9512f1f28a74d93',
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

    it('should fetch AI answer and return it', async () => {
        const mockAIAnswer = 'This is an AI generated answer.';
        (questionService.getAIAnswer as jest.Mock).mockResolvedValue(mockAIAnswer);

        await questionController.getAIAnswer(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.getAIAnswer).toHaveBeenCalledWith('67d0e8e6f9512f1f28a74d93');
        expect(mockResponse.json).toHaveBeenCalledWith(mockAIAnswer);
        expect(responseObject).toEqual(mockAIAnswer);
    });

    it('should return 500 if service throws an error', async () => {
        const error = new Error('AI service error');
        (questionService.getAIAnswer as jest.Mock).mockRejectedValue(error);

        await questionController.getAIAnswer(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.getAIAnswer).toHaveBeenCalledWith('67d0e8e6f9512f1f28a74d93');
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Internal Server Error',
            error,
        });
    });

    it('should return 500 if service returns null', async () => {
        (questionService.getAIAnswer as jest.Mock).mockResolvedValue(null);

        await questionController.getAIAnswer(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.getAIAnswer).toHaveBeenCalledWith('67d0e8e6f9512f1f28a74d93');
        expect(mockResponse.json).toHaveBeenCalledWith(null);
    });
});