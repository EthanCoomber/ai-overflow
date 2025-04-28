
// To run: NODE_ENV=test npx jest
import * as tagService from '../services/tagService';
import Tag from '../models/tags';
import Question from '../models/questions';
import { ITag } from '../types/types';

// Define a minimal question type based on usage
interface IQuestion {
    _id: string;
    tags: string[];
}

// Mock dependencies
jest.mock('../models/tags');
jest.mock('../models/questions');

describe('tagService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getTagsWithQuestionCount', () => {
        it('should return tags with their question counts', async () => {
            const mockTags: ITag[] = [
                { _id: 'tag1', name: 'javascript' },
                { _id: 'tag2', name: 'typescript' },
            ];

            const mockQuestionsForTag1: IQuestion[] = [
                { _id: 'qid1', tags: ['tag1'] },
                { _id: 'qid2', tags: ['tag1'] },
            ];

            const mockQuestionsForTag2: IQuestion[] = [
                { _id: 'qid3', tags: ['tag2'] },
            ];

            (Tag.findAllTags as jest.Mock).mockResolvedValue(mockTags);
            (Question.findQuestionsWithTag as jest.Mock)
                .mockResolvedValueOnce(mockQuestionsForTag1) // For tag1
                .mockResolvedValueOnce(mockQuestionsForTag2); // For tag2

            const result = await tagService.getTagsWithQuestionCount();

            expect(Tag.findAllTags).toHaveBeenCalled();
            expect(Question.findQuestionsWithTag).toHaveBeenCalledWith('tag1');
            expect(Question.findQuestionsWithTag).toHaveBeenCalledWith('tag2');
            expect(result).toEqual([
                { _id: 'tag1', name: 'javascript', qcnt: 2 },
                { _id: 'tag2', name: 'typescript', qcnt: 1 },
            ]);
        });

        it('should filter out tags without an _id', async () => {
            const mockTags: (ITag | { name: string })[] = [
                { _id: 'tag1', name: 'javascript' },
                { name: 'invalid' }, // No _id
                { _id: 'tag2', name: 'typescript' },
            ];

            const mockQuestionsForTag1: IQuestion[] = [
                { _id: 'qid1', tags: ['tag1'] },
            ];

            const mockQuestionsForTag2: IQuestion[] = [];

            (Tag.findAllTags as jest.Mock).mockResolvedValue(mockTags);
            (Question.findQuestionsWithTag as jest.Mock)
                .mockResolvedValueOnce(mockQuestionsForTag1) // For tag1
                .mockResolvedValueOnce(mockQuestionsForTag2); // For tag2

            const result = await tagService.getTagsWithQuestionCount();

            expect(Tag.findAllTags).toHaveBeenCalled();
            expect(Question.findQuestionsWithTag).toHaveBeenCalledWith('tag1');
            expect(Question.findQuestionsWithTag).toHaveBeenCalledWith('tag2');
            expect(Question.findQuestionsWithTag).toHaveBeenCalledTimes(2); // Should not be called for invalid tag
            expect(result).toEqual([
                { _id: 'tag1', name: 'javascript', qcnt: 1 },
                { _id: 'tag2', name: 'typescript', qcnt: 0 },
            ]);
        });

        it('should return an empty array if no tags exist', async () => {
            (Tag.findAllTags as jest.Mock).mockResolvedValue([]);

            const result = await tagService.getTagsWithQuestionCount();

            expect(Tag.findAllTags).toHaveBeenCalled();
            expect(Question.findQuestionsWithTag).not.toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });
});
