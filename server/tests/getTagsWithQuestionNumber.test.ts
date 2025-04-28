// To run: NODE_ENV=test npx jest

import { Request, Response } from 'express';
import tagController from '../controllers/tagController';
import * as tagService from '../services/tagService';

// Mock the tagService module
jest.mock('../services/tagService');

// Define interface to match TagCount schema
interface TagCount {
    _id: string;
    name: string;
    qcnt: number;
}

describe('tagController.getTagsWithQuestionNumber', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: Record<string, unknown>;

    beforeEach(() => {
        mockRequest = {};

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

    it('should fetch tags with question counts', async () => {
        const mockTags: TagCount[] = [
            {
                _id: 't1',
                name: 'jest',
                qcnt: 5,
            },
            {
                _id: 't2',
                name: 'express',
                qcnt: 3,
            },
            {
                _id: 't3',
                name: 'typescript',
                qcnt: 0,
            },
        ];

        (tagService.getTagsWithQuestionCount as jest.Mock).mockResolvedValue(mockTags);

        await tagController.getTagsWithQuestionNumber(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(tagService.getTagsWithQuestionCount).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith(mockTags);
        expect(responseObject).toEqual(mockTags);
    });

    it('should return empty array if no tags exist', async () => {
        const mockTags: TagCount[] = [];

        (tagService.getTagsWithQuestionCount as jest.Mock).mockResolvedValue(mockTags);

        await tagController.getTagsWithQuestionNumber(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(tagService.getTagsWithQuestionCount).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith([]);
        expect(responseObject).toEqual([]);
    });

    it('should return 500 if there is a service error', async () => {
        const error = new Error('Database failure');
        (tagService.getTagsWithQuestionCount as jest.Mock).mockRejectedValue(error);

        await tagController.getTagsWithQuestionNumber(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(tagService.getTagsWithQuestionCount).toHaveBeenCalled();
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