import mongoose from 'mongoose';
import * as answerService from '../services/answerService';
import Question from '../models/questions';
import Answer from '../models/answers';
import { IAddAnswerRequest } from '../types/types';

// Mock dependencies
jest.mock('../models/questions');
jest.mock('../models/answers');

describe('answerService', () => {
    const fixedDate = '2025-04-16T00:36:35.810Z';
    const fixedDateObj = new Date(fixedDate);

    beforeEach(() => {
        jest.useFakeTimers().setSystemTime(fixedDateObj);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    describe('createAnswer', () => {
        let mockData: IAddAnswerRequest;

        beforeEach(() => {
            mockData = {
                qid: new mongoose.Types.ObjectId().toString(), // Valid ObjectId
                ans: {
                    text: 'This is an answer',
                    ans_by: 'user123',
                    ans_date_time: fixedDate,
                },
            };
        });

        it('should create an answer and link it to the question', async () => {
            const mockAnswer = {
                _id: new mongoose.Types.ObjectId(),
                text: 'This is an answer',
                ans_by: 'user123',
                ans_date_time: fixedDateObj,
                toObject: jest.fn().mockReturnValue({
                    _id: new mongoose.Types.ObjectId().toString(),
                    text: 'This is an answer',
                    ans_by: 'user123',
                    ans_date_time: fixedDateObj,
                }),
            };

            const mockQuestion = {
                _id: mockData.qid,
                addAnswer: jest.fn().mockResolvedValue(undefined),
            };

            // Mock Question.findOne instead of Question.findById
            (Question.findOne as jest.Mock).mockResolvedValue(mockQuestion);
            (Answer.create as jest.Mock).mockResolvedValue(mockAnswer);
            (Answer.findByIdAndDelete as jest.Mock).mockResolvedValue(undefined);

            const result = await answerService.createAnswer(mockData);

            expect(Question.findOne).toHaveBeenCalledWith({ _id: new mongoose.Types.ObjectId(mockData.qid) });
            expect(Answer.create).toHaveBeenCalledWith({
                text: 'This is an answer',
                ans_by: 'user123',
                ans_date_time: expect.any(Date),
            });
            expect(mockQuestion.addAnswer).toHaveBeenCalledWith(mockAnswer._id);
            expect(Answer.findByIdAndDelete).not.toHaveBeenCalled();
            expect(result).toEqual({
                _id: expect.any(String),
                text: 'This is an answer',
                ans_by: 'user123',
                ans_date_time: fixedDateObj,
            });
        });

        it('should throw an error and delete the answer if the question is not found', async () => {
            const mockAnswer = {
                _id: new mongoose.Types.ObjectId(),
                text: 'This is an answer',
                ans_by: 'user123',
                ans_date_time: fixedDateObj,
            };

            // Mock Question.findOne to return null
            (Question.findOne as jest.Mock).mockResolvedValue(null);
            (Answer.create as jest.Mock).mockResolvedValue(mockAnswer);
            (Answer.findByIdAndDelete as jest.Mock).mockResolvedValue(mockAnswer);

            await expect(answerService.createAnswer(mockData)).rejects.toThrow('Question not found');

            expect(Question.findOne).toHaveBeenCalledWith({ _id: new mongoose.Types.ObjectId(mockData.qid) });
            expect(Answer.create).toHaveBeenCalledWith({
                text: 'This is an answer',
                ans_by: 'user123',
                ans_date_time: expect.any(Date),
            });
            expect(Answer.findByIdAndDelete).toHaveBeenCalledWith(mockAnswer._id);
        });

        it('should throw an error if the question ID is invalid', async () => {
            // Set an invalid ObjectId
            mockData.qid = 'invalid-object-id';

            await expect(answerService.createAnswer(mockData)).rejects.toThrow('Invalid question ID');

            // Verify that no database operations were attempted
            expect(Question.findOne).not.toHaveBeenCalled();
            expect(Answer.create).not.toHaveBeenCalled();
            expect(Answer.findByIdAndDelete).not.toHaveBeenCalled();
        });
    });
});