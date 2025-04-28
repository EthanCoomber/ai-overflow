// To run: NODE_ENV=test npx jest

import { Request, Response } from 'express';
import questionController from '../controllers/questionController';
import * as questionService from '../services/questionService';

// Mock the questionService module
jest.mock('../services/questionService');

// Define interfaces to match Question model and formatQuestion output
interface Answer {
    _id: string;
    text: string;
    ans_date_time: Date | string;
}

interface Comment {
    _id: string;
    text: string;
    comment_by: string;
    comment_date_time: string;
}

interface Question {
    _id: string;
    title: string;
    text: string;
    tags: { _id: string; name: string }[];
    asked_by: string;
    ask_date_time: string;
    answers: Answer[];
    views: number;
    votes: number;
    comments: Comment[];
}

describe('questionController.getQuestions', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: Record<string, unknown>;

    beforeEach(() => {
        mockRequest = {
            query: {
                order: 'newest',
                search: '',
            } as { order?: string; search?: string },
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

    it('should fetch questions with default order and no search term', async () => {
        const mockQuestions: Question[] = [
            {
                _id: '679846196243c96505ba4007',
                title: 'How to test controllers in Express?',
                text: 'I need help writing Jest tests for Express controllers.',
                tags: [
                    { _id: 't1', name: 'jest' },
                    { _id: 't2', name: 'express' },
                ],
                asked_by: 'testUser',
                ask_date_time: new Date('2025-04-01T10:00:00Z').toISOString(),
                answers: [],
                views: 1,
                votes: 0,
                comments: [],
            },
            {
                _id: '679846196243c96505ba4008',
                title: 'What is TypeScript?',
                text: 'Explain TypeScript benefits.',
                tags: [{ _id: 't3', name: 'typescript' }],
                asked_by: 'anotherUser',
                ask_date_time: new Date('2025-04-02T12:00:00Z').toISOString(),
                answers: [],
                views: 0,
                votes: 0,
                comments: [],
            },
        ];

        const expectedQuestions = mockQuestions.map((question) => ({
            ...question,
            tags: question.tags.map((tag) => ({
                ...tag,
                _id: tag._id.toString(),
            })),
            answers: question.answers.map((answer) => ({
                ...answer,
                _id: answer._id.toString(),
            })),
            comments: question.comments || [],
        }));

        (questionService.findQuestions as jest.Mock).mockResolvedValue(mockQuestions);

        await questionController.getQuestions(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.findQuestions).toHaveBeenCalledWith({
            order: 'newest',
            search: '',
        });
        expect(mockResponse.json).toHaveBeenCalledWith(expectedQuestions);
        expect(responseObject).toEqual(expectedQuestions);
    });

    it('should fetch questions with active order and search term', async () => {
        mockRequest.query = {
            order: 'active',
            search: '[jest] test',
        } as { order?: string; search?: string };

        const mockQuestions: Question[] = [
            {
                _id: '679846196243c96505ba4007',
                title: 'How to test controllers in Express?',
                text: 'I need help writing Jest tests for Express controllers.',
                tags: [
                    { _id: 't1', name: 'jest' },
                    { _id: 't2', name: 'express' },
                ],
                asked_by: 'testUser',
                ask_date_time: new Date('2025-04-01T10:00:00Z').toISOString(),
                answers: [
                    {
                        _id: 'a1',
                        text: 'Use Jest with supertest.',
                        ans_date_time: new Date('2025-04-02T10:00:00Z'),
                    },
                ],
                views: 1,
                votes: 0,
                comments: [],
            },
        ];

        const expectedQuestions = mockQuestions.map((question) => ({
            ...question,
            tags: question.tags.map((tag) => ({
                ...tag,
                _id: tag._id.toString(),
            })),
            answers: question.answers.map((answer) => ({
                ...answer,
                _id: answer._id.toString(),
            })),
            comments: question.comments || [],
        }));

        (questionService.findQuestions as jest.Mock).mockResolvedValue(mockQuestions);

        await questionController.getQuestions(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.findQuestions).toHaveBeenCalledWith({
            order: 'active',
            search: '[jest] test',
        });
        expect(mockResponse.json).toHaveBeenCalledWith(expectedQuestions);
        expect(responseObject).toEqual(expectedQuestions);
    });

    it('should fetch unanswered questions with tag search', async () => {
        mockRequest.query = {
            order: 'unanswered',
            search: '[typescript]',
        } as { order?: string; search?: string };

        const mockQuestions: Question[] = [
            {
                _id: '679846196243c96505ba4008',
                title: 'What is TypeScript?',
                text: 'Explain TypeScript benefits.',
                tags: [{ _id: 't3', name: 'typescript' }],
                asked_by: 'anotherUser',
                ask_date_time: new Date('2025-04-02T12:00:00Z').toISOString(),
                answers: [],
                views: 0,
                votes: 0,
                comments: [],
            },
        ];

        const expectedQuestions = mockQuestions.map((question) => ({
            ...question,
            tags: question.tags.map((tag) => ({
                ...tag,
                _id: tag._id.toString(),
            })),
            answers: question.answers.map((answer) => ({
                ...answer,
                _id: answer._id.toString(),
            })),
            comments: question.comments || [],
        }));

        (questionService.findQuestions as jest.Mock).mockResolvedValue(mockQuestions);

        await questionController.getQuestions(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.findQuestions).toHaveBeenCalledWith({
            order: 'unanswered',
            search: '[typescript]',
        });
        expect(mockResponse.json).toHaveBeenCalledWith(expectedQuestions);
        expect(responseObject).toEqual(expectedQuestions);
    });

    it('should return empty array if no questions match', async () => {
        mockRequest.query = {
            order: 'newest',
            search: 'nonexistent',
        } as { order?: string; search?: string };

        const mockQuestions: Question[] = [];

        (questionService.findQuestions as jest.Mock).mockResolvedValue(mockQuestions);

        await questionController.getQuestions(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.findQuestions).toHaveBeenCalledWith({
            order: 'newest',
            search: 'nonexistent',
        });
        expect(mockResponse.json).toHaveBeenCalledWith([]);
        expect(responseObject).toEqual([]);
    });

    it('should fetch questions with undefined order defaulting to newest', async () => {
        mockRequest.query = {
            search: 'test',
        } as { order?: string; search?: string };

        const mockQuestions: Question[] = [
            {
                _id: '679846196243c96505ba4007',
                title: 'How to test controllers in Express?',
                text: 'I need help writing Jest tests for Express controllers.',
                tags: [
                    { _id: 't1', name: 'jest' },
                    { _id: 't2', name: 'express' },
                ],
                asked_by: 'testUser',
                ask_date_time: new Date('2025-04-01T10:00:00Z').toISOString(),
                answers: [],
                views: 1,
                votes: 0,
                comments: [],
            },
        ];

        const expectedQuestions = mockQuestions.map((question) => ({
            ...question,
            tags: question.tags.map((tag) => ({
                ...tag,
                _id: tag._id.toString(),
            })),
            answers: question.answers.map((answer) => ({
                ...answer,
                _id: answer._id.toString(),
            })),
            comments: question.comments || [],
        }));

        (questionService.findQuestions as jest.Mock).mockResolvedValue(mockQuestions);

        await questionController.getQuestions(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.findQuestions).toHaveBeenCalledWith({
            search: 'test',
        });
        expect(mockResponse.json).toHaveBeenCalledWith(expectedQuestions);
        expect(responseObject).toEqual(expectedQuestions);
    });

    it('should return 500 if there is a service error', async () => {
        const error = new Error('Database failure');
        (questionService.findQuestions as jest.Mock).mockRejectedValue(error);

        await questionController.getQuestions(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(questionService.findQuestions).toHaveBeenCalledWith({
            order: 'newest',
            search: '',
        });
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