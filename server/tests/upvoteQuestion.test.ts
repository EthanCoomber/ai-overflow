// To run: NODE_ENV=test npx jest
import { Request, Response } from 'express';
import questionController from '../controllers/questionController';
import Question from '../models/questions';

// Mock the Question model
jest.mock('../models/questions');

describe('questionController.upvoteQuestion', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: Record<string, unknown>;

    beforeEach(() => {
        mockRequest = {
            params: { qid: '123' },
        };

        responseObject = {};

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockImplementation((data) => {
                responseObject = data;
                return mockResponse;
            }),
        };

        expect(responseObject).toEqual({});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully upvote a question and return 200', async () => {
        const mockQuestion = {
            votes: 1,
            incrementVotes: function (this: { votes: number }) {
                this.votes += 1;
                return Promise.resolve(this);
            },
        };

        // Wrap incrementVotes in a jest.fn to track calls
        mockQuestion.incrementVotes = jest.fn(mockQuestion.incrementVotes);

        (Question.findById as jest.Mock).mockResolvedValue(mockQuestion);

        await questionController.upvoteQuestion(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(Question.findById).toHaveBeenCalledWith('123');
        expect(mockQuestion.incrementVotes).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Upvoted',
            votes: 2,
        });
    });




    it('should return 404 if question is not found', async () => {
        (Question.findById as jest.Mock).mockResolvedValue(null);

        await questionController.upvoteQuestion(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Question not found',
        });
    });

    it('should return 500 if an error occurs during upvote', async () => {
        (Question.findById as jest.Mock).mockRejectedValue(new Error('DB error'));

        await questionController.upvoteQuestion(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Internal server error',
        });
    });
});
