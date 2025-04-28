// To run: NODE_ENV=test npx jest
import { Request, Response } from 'express';
import answerController from '../controllers/answerController';
import * as answerService from '../services/answerService';

// Mock the answerService module
jest.mock('../services/answerService');

describe('answerController.addAnswer', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: Record<string, unknown>;

    beforeEach(() => {
        mockRequest = {
            body: {
                qid: 'q123456',
                ans: {
                    text: 'This is a test answer',
                    ans_by: 'testUser',
                    ans_date_time: new Date().toISOString(),
                },
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

    it('should add a new answer and return it', async () => {
        const mockAnswer = {
            _id: 'a123456',
            text: 'This is a test answer',
            ans_by: 'testUser',
            ans_date_time: new Date().toISOString(),
        };

        (answerService.createAnswer as jest.Mock).mockResolvedValue(mockAnswer);

        await answerController.addAnswer(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(answerService.createAnswer).toHaveBeenCalledWith(mockRequest.body);
        expect(mockResponse.json).toHaveBeenCalledWith(mockAnswer);
        expect(responseObject).toEqual(mockAnswer);
    });

    it('should return 500 if service throws an error', async () => {
        const error = new Error('Database error');
        (answerService.createAnswer as jest.Mock).mockRejectedValue(error);

        await answerController.addAnswer(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(answerService.createAnswer).toHaveBeenCalledWith(mockRequest.body);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Internal Server Error',
            error,
        });
    });
});
