// To run: NODE_ENV=test npx jest
import * as questionService from '../services/questionService';
import Question from '../models/questions';
import Tag from '../models/tags';
import { openai } from '../config/openai';
import { IQuestion, IQuestionDocument } from '../types/types';
import sanitizeHtml from 'sanitize-html';
import mongoose from 'mongoose';

// Mock dependencies
jest.mock('../models/questions');
jest.mock('../models/tags');
jest.mock('../config/openai');
jest.mock('sanitize-html');

// Define interfaces for test data
interface QuestionData {
    title: string;
    text: string;
    asked_by: string;
    tags: { name: string }[];
    answers?: IQuestion['answers'];
    views?: number;
    ask_date_time?: Date;
}

describe('questionService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createQuestion', () => {
        it('should create a new question with tags', async () => {
            const mockData: QuestionData = {
                title: 'Test Question',
                text: 'This is a test question',
                asked_by: 'user123',
                tags: [{ name: 'test' }],
            };
            const mockTag = { _id: 'tag123', name: 'test' };
            const mockQuestion = {
                ...mockData,
                _id: 'qid123',
                ask_date_time: new Date(),
                tags: [mockTag],
                answers: [],
                views: 0,
                toObject: () => ({
                    ...mockData,
                    _id: 'qid123',
                    tags: [mockTag],
                    answers: [],
                }),
                incrementViews: jest.fn(),
                addAnswer: jest.fn(),
                incrementVotes: jest.fn()
            } as unknown as IQuestionDocument;

            (Tag.findByName as jest.Mock).mockResolvedValue(mockTag);
            const mockQuery = {
                populate: jest.fn().mockResolvedValue(mockQuestion),
            };
            (Question.create as jest.Mock).mockResolvedValue(mockQuery);

            const result = await questionService.createQuestion(mockData as unknown as IQuestionDocument);

            expect(Tag.findByName).toHaveBeenCalledWith('test');
            expect(Question.create).toHaveBeenCalledWith({
                title: 'Test Question',
                text: 'This is a test question',
                asked_by: 'user123',
                tags: ['tag123'],
                answers: [],
                views: 0,
                ask_date_time: expect.any(Date),
            });
            expect(mockQuery.populate).toHaveBeenCalledWith('tags');
            expect(result).toEqual({
                ...mockData,
                _id: 'qid123',
                tags: [{ _id: 'tag123', name: 'test' }],
                answers: [],
            });
        });

        it('should create a new tag if it does not exist', async () => {
            const mockData: QuestionData = {
                title: 'Test Question',
                text: 'This is a test question',
                asked_by: 'user123',
                tags: [{ name: 'newtag' }],
            };
            const mockTag = { _id: 'tag123', name: 'newtag' };
            const mockQuestion = {
                ...mockData,
                _id: 'qid123',
                ask_date_time: new Date(),
                tags: [mockTag],
                answers: [],
                views: 0,
                toObject: () => ({
                    ...mockData,
                    _id: 'qid123',
                    tags: [mockTag],
                    answers: [],
                }),
                incrementViews: jest.fn(),
                addAnswer: jest.fn(),
                incrementVotes: jest.fn()
            } as unknown as IQuestionDocument;

            (Tag.findByName as jest.Mock).mockResolvedValue(null);
            (Tag.createTag as jest.Mock).mockResolvedValue(mockTag);
            const mockQuery = {
                populate: jest.fn().mockResolvedValue(mockQuestion),
            };
            (Question.create as jest.Mock).mockResolvedValue(mockQuery);

            const result = await questionService.createQuestion(mockData as unknown as IQuestionDocument);

            expect(Tag.findByName).toHaveBeenCalledWith('newtag');
            expect(Tag.createTag).toHaveBeenCalledWith('newtag');
            expect(Question.create).toHaveBeenCalled();
            expect(mockQuery.populate).toHaveBeenCalledWith('tags');
            expect(result).toEqual({
                ...mockData,
                _id: 'qid123',
                tags: [{ _id: 'tag123', name: 'newtag' }],
                answers: [],
            });
        });

        it('should handle error in createQuestion', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            
            const mockData: QuestionData = {
                title: 'Test Question',
                text: 'This is a test question',
                asked_by: 'user123',
                tags: [{ name: 'test' }],
            };
            
            (Tag.findByName as jest.Mock).mockRejectedValue(new Error('Database error'));
            
            const result = await questionService.createQuestion(mockData as unknown as IQuestionDocument);
            
            expect(Tag.findByName).toHaveBeenCalledWith('test');
            expect(console.error).toHaveBeenCalledWith('Error creating question:', expect.any(Error));
            expect(result).toBeNull();
            
            jest.restoreAllMocks();
        });
    });

    describe('formatTag and formatAnswer', () => {
        it('should format tag when input is ObjectId', () => {
            const objectId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
            const result = questionService.formatTag(objectId);
            expect(result).toEqual({
                _id: '507f1f77bcf86cd799439011',
                name: '',
            });
        });

        it('should format tag when input is ITag', () => {
            const tag = { _id: 'tag123', name: 'javascript' };
            const result = questionService.formatTag(tag);
            expect(result).toEqual({
                _id: 'tag123',
                name: 'javascript',
            });
        });

        it('should format answer when input is ObjectId', () => {
            const objectId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
            const result = questionService.formatAnswer(objectId);
            expect(result).toBeNull();
        });

        it('should format answer when input is IAnswerDB', () => {
            const answer = { _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), text: 'This is an answer', ans_by: 'user123', ans_date_time: new Date() };
            const result = questionService.formatAnswer(answer);
            expect(result).toEqual({
                _id: '507f1f77bcf86cd799439011',
                text: 'This is an answer',
                ans_by: 'user123',
                ans_date_time: answer.ans_date_time,
            });
        });

        it('should handle null question in formatQuestion', () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = questionService.formatQuestion(null as unknown as IQuestionDocument);
            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalledWith('Question is null or undefined');
            jest.restoreAllMocks();
            });

        it('should handle error in formatQuestion', () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            
            // Create a malformed question object that will cause an error
            const malformedQuestion = {
                _id: { toString: () => { throw new Error('Cannot convert _id'); } },
                tags: [{ _id: 'tag123', name: 'test' }],
                answers: [],
                toObject: () => ({
                    _id: 'qid123',
                    tags: [{ _id: 'tag123', name: 'test' }],
                    answers: [],
                }),
            } as unknown as IQuestionDocument;

            // Test the error handling path
            const result = questionService.formatQuestion(malformedQuestion);
            
            expect(console.error).toHaveBeenCalledWith(
                'Error in formatQuestion:',
                expect.any(Error)
            );
            
            // The function should attempt to recover using JSON.parse/stringify
            expect(result).not.toBeNull();
            
            jest.restoreAllMocks();
        });

        it('should handle JSON.parse error in formatQuestion', () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            
            // Create a circular reference that will cause JSON.stringify/parse to fail
            const circularObj: Record<string, unknown> = {};
            circularObj.self = circularObj;
            
            const malformedQuestion = {
                _id: { toString: () => { throw new Error('Cannot convert _id'); } },
                tags: [{ _id: 'tag123', name: 'test' }],
                answers: [],
                toObject: () => ({
                    _id: 'qid123',
                    tags: [{ _id: 'tag123', name: 'test' }],
                    answers: [],
                    circular: circularObj
                }),
            } as unknown as IQuestionDocument;

            // Mock JSON.stringify to throw an error
            const originalStringify = JSON.stringify;
            JSON.stringify = jest.fn().mockImplementation(() => {
                throw new Error('Converting circular structure to JSON');
            });

            // Test the error handling path
            const result = questionService.formatQuestion(malformedQuestion);
            
            expect(console.error).toHaveBeenCalledWith(
                'Error in formatQuestion:',
                expect.any(Error)
            );
            
            // The function should return null when both approaches fail
            expect(result).toBeNull();
            
            // Restore mocks
            JSON.stringify = originalStringify;
            jest.restoreAllMocks();
        });
    });

    describe('findQuestionById', () => {
        it('should fetch a question by ID and increment views', async () => {
            const mockQuestion = {
                _id: 'qid123',
                title: 'Test Question',
                text: 'This is a test question',
                tags: [{ _id: 'tag123', name: 'test' }],
                answers: [],
                toObject: () => ({
                    _id: 'qid123',
                    title: 'Test Question',
                    text: 'This is a test question',
                    tags: [{ _id: 'tag123', name: 'test' }],
                    answers: [],
                }),
                incrementViews: jest.fn().mockResolvedValue(undefined),
            };
            const mockQuery = {
                populate: jest.fn().mockImplementation(function () {
                    return {
                        populate: jest.fn().mockResolvedValue(mockQuestion),
                    };
                }),
            };
            (Question.findById as jest.Mock).mockReturnValue(mockQuery);

            const result = await questionService.findQuestionById('qid123');

            expect(Question.findById).toHaveBeenCalledWith('qid123');
            expect(mockQuery.populate).toHaveBeenCalledWith({
                path: 'answers',
                options: { sort: { ans_date_time: -1 }, lean: true },
            });
            expect(mockQuestion.incrementViews).toHaveBeenCalled();
            expect(result).toEqual({
                _id: 'qid123',
                title: 'Test Question',
                text: 'This is a test question',
                tags: [{ _id: 'tag123', name: 'test' }],
                answers: [],
            });
        });

        it('should return null if findById throws an error', async () => {
            // Suppress console.error for this test
            jest.spyOn(console, 'error').mockImplementation(() => { });

            (Question.findById as jest.Mock).mockImplementation(() => {
                throw new Error('Database error');
            });

            const result = await questionService.findQuestionById('qid123');

            expect(Question.findById).toHaveBeenCalledWith('qid123');
            expect(result).toBeNull();

            // Restore console.error
            jest.restoreAllMocks();
        });

        it('should return null if qid is not provided', async () => {
            const result = await questionService.findQuestionById('');
            expect(result).toBeNull();
        });

        it('should return null if qid is undefined', async () => {
            const result = await questionService.findQuestionById(undefined as unknown as string);
            expect(result).toBeNull();
          });
          
          it('should return null if qid is null', async () => {
            const result = await questionService.findQuestionById(null as unknown as string);
            expect(result).toBeNull();
          });
          

          it('should not return early if qid is valid', async () => {
            const mockQuestion = {
              _id: 'qid123',
              title: 'Test',
              text: 'Body',
              tags: [],
              answers: [],
              incrementViews: jest.fn().mockResolvedValue(undefined),
              toObject: () => ({
                _id: 'qid123',
                title: 'Test',
                text: 'Body',
                tags: [],
                answers: [],
              }),
            };
          
            const mockQuery = {
              populate: jest.fn().mockImplementation(function () {
                return {
                  populate: jest.fn().mockResolvedValue(mockQuestion),
                };
              }),
            };
          
            (Question.findById as jest.Mock).mockReturnValue(mockQuery);
          
            const result = await questionService.findQuestionById('qid123');
          
            expect(result).toEqual({
              _id: 'qid123',
              title: 'Test',
              text: 'Body',
              tags: [],
              answers: [],
            });
          });

          it('should filter questions by keyword in title or text', async () => {
            const mockQuestions = [
              {
                _id: 'qid123',
                title: 'What is React?',
                text: 'Explain React hooks.',
                tags: [{ _id: 'tag123', name: 'javascript' }],
                answers: [],
                toObject: () => ({
                  _id: 'qid123',
                  title: 'What is React?',
                  text: 'Explain React hooks.',
                  tags: [{ _id: 'tag123', name: 'javascript' }],
                  answers: [],
                }),
              },
            ];
          
            (Question.findRecentQuestions as jest.Mock).mockResolvedValue(mockQuestions);
          
            const result = await questionService.findQuestions({ search: 'react' });
          
            expect(result).toHaveLength(1);
            expect(result[0]._id).toBe('qid123');
          });
          
          

        it('should return null if question is not found', async () => {
            const mockQuery = {
                populate: jest.fn().mockImplementation(function () {
                    return {
                        populate: jest.fn().mockResolvedValue(null),
                    };
                }),
            };
            (Question.findById as jest.Mock).mockReturnValue(mockQuery);

            const result = await questionService.findQuestionById('qid123');

            expect(Question.findById).toHaveBeenCalledWith('qid123');
            expect(result).toBeNull();
        });
    });

    describe('findQuestions', () => {
        it('should fetch questions with default sorting (newest)', async () => {
            const mockQuestions = [
                {
                    _id: 'qid123',
                    title: 'Test Question',
                    text: 'This is a test question',
                    tags: [{ _id: 'tag123', name: 'test' }],
                    answers: [],
                    toObject: () => ({
                        _id: 'qid123',
                        title: 'Test Question',
                        text: 'This is a test question',
                        tags: [{ _id: 'tag123', name: 'test' }],
                        answers: [],
                    }),
                },
            ];

            (Question.findRecentQuestions as jest.Mock).mockResolvedValue(mockQuestions);

            const result = await questionService.findQuestions({});

            expect(Question.findRecentQuestions).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                _id: 'qid123',
                title: 'Test Question',
                text: 'This is a test question',
                tags: [{ _id: 'tag123', name: 'test' }],
                answers: [],
            });
        });

        it('should fetch unanswered questions', async () => {
            const mockQuestions = [
                {
                    _id: 'qid123',
                    title: 'Test Question',
                    text: 'This is a test question',
                    tags: [{ _id: 'tag123', name: 'test' }],
                    answers: [],
                    toObject: () => ({
                        _id: 'qid123',
                        title: 'Test Question',
                        text: 'This is a test question',
                        tags: [{ _id: 'tag123', name: 'test' }],
                        answers: [],
                    }),
                },
                {
                    _id: 'qid124',
                    title: 'Answered Question',
                    text: 'This has an answer',
                    tags: [{ _id: 'tag124', name: 'test2' }],
                    answers: [{ text: 'Answer', ans_date_time: new Date() }],
                    toObject: () => ({
                        _id: 'qid124',
                        title: 'Answered Question',
                        text: 'This has an answer',
                        tags: [{ _id: 'tag124', name: 'test2' }],
                        answers: [{ text: 'Answer', ans_date_time: new Date() }],
                    }),
                },
            ];

            (Question.findRecentQuestions as jest.Mock).mockResolvedValue(mockQuestions);

            const result = await questionService.findQuestions({ order: 'unanswered' });

            expect(Question.findRecentQuestions).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0]._id).toBe('qid123');
        });

        it('should fetch active questions sorted by latest answer', async () => {
            const mockQuestions = [
                {
                    _id: 'qid123',
                    title: 'Test Question',
                    text: 'This is a test question',
                    tags: [{ _id: 'tag123', name: 'test' }],
                    answers: [{ text: 'Answer', ans_date_time: new Date('2023-01-01') }],
                    toObject: () => ({
                        _id: 'qid123',
                        title: 'Test Question',
                        text: 'This is a test question',
                        tags: [{ _id: 'tag123', name: 'test' }],
                        answers: [{ text: 'Answer', ans_date_time: new Date('2023-01-01') }],
                    }),
                },
                {
                    _id: 'qid124',
                    title: 'Answered Question',
                    text: 'This has an answer',
                    tags: [{ _id: 'tag124', name: 'test2' }],
                    answers: [{ text: 'Answer', ans_date_time: new Date('2024-01-01') }],
                    toObject: () => ({
                        _id: 'qid124',
                        title: 'Answered Question',
                        text: 'This has an answer',
                        tags: [{ _id: 'tag124', name: 'test2' }],
                        answers: [{ text: 'Answer', ans_date_time: new Date('2024-01-01') }],
                    }),
                },
            ];

            (Question.findRecentQuestions as jest.Mock).mockResolvedValue(mockQuestions);

            const result = await questionService.findQuestions({ order: 'active' });

            expect(Question.findRecentQuestions).toHaveBeenCalled();
            expect(result).toHaveLength(2);
            expect(result[0]._id).toBe('qid124');
        });

        it('should sort active questions with no answers last', async () => {
            const mockQuestions = [
                {
                    _id: 'qid123',
                    title: 'Test Question',
                    text: 'This is a test question',
                    tags: [{ _id: 'tag123', name: 'test' }],
                    answers: [],
                    toObject: () => ({
                        _id: 'qid123',
                        title: 'Test Question',
                        text: 'This is a test question',
                        tags: [{ _id: 'tag123', name: 'test' }],
                        answers: [],
                    }),
                },
                {
                    _id: 'qid124',
                    title: 'Answered Question',
                    text: 'This has an answer',
                    tags: [{ _id: 'tag124', name: 'test2' }],
                    answers: [{ text: 'Answer', ans_date_time: new Date('2024-01-01') }],
                    toObject: () => ({
                        _id: 'qid124',
                        title: 'Answered Question',
                        text: 'This has an answer',
                        tags: [{ _id: 'tag124', name: 'test2' }],
                        answers: [{ text: 'Answer', ans_date_time: new Date('2024-01-01') }],
                    }),
                },
            ];

            (Question.findRecentQuestions as jest.Mock).mockResolvedValue(mockQuestions);

            const result = await questionService.findQuestions({ order: 'active' });

            expect(Question.findRecentQuestions).toHaveBeenCalled();
            expect(result).toHaveLength(2);
            expect(result[0]._id).toBe('qid124');
            expect(result[1]._id).toBe('qid123');
        });

        it('should filter questions by search term', async () => {
            const mockQuestions = [
                {
                    _id: 'qid123',
                    title: 'Test Question',
                    text: 'This is a test question',
                    tags: [{ _id: 'tag123', name: 'javascript' }],
                    answers: [],
                    toObject: () => ({
                        _id: 'qid123',
                        title: 'Test Question',
                        text: 'This is a test question',
                        tags: [{ _id: 'tag123', name: 'javascript' }],
                        answers: [],
                    }),
                },
            ];

            (Question.findRecentQuestions as jest.Mock).mockResolvedValue(mockQuestions);

            const result = await questionService.findQuestions({ search: '[javascript]' });

            expect(Question.findRecentQuestions).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0]._id).toBe('qid123');
        });

        it('should return empty array if findRecentQuestions throws an error', async () => {
            // Suppress console.error for this test
            jest.spyOn(console, 'error').mockImplementation(() => { });

            (Question.findRecentQuestions as jest.Mock).mockImplementation(() => {
                throw new Error('Database error');
            });

            const result = await questionService.findQuestions({});

            expect(Question.findRecentQuestions).toHaveBeenCalled();
            expect(result).toEqual([]);

            // Restore console.error
            jest.restoreAllMocks();
        });
    });

    describe('getAIAnswer', () => {
        it('should fetch an AI answer for a question', async () => {
            const mockQuestion = {
                _id: 'qid123',
                title: 'Test Question',
                text: 'What is 2+2?',
            };
            const mockAIResponse = {
                choices: [{ message: { content: 'The answer is 4.' } }],
            };

            (Question.findById as jest.Mock).mockResolvedValue(mockQuestion);
            (openai.chat.completions.create as jest.Mock).mockResolvedValue(mockAIResponse);

            const result = await questionService.getAIAnswer('qid123');

            expect(Question.findById).toHaveBeenCalledWith('qid123');
            expect(openai.chat.completions.create).toHaveBeenCalled();
            expect(result).toBe('The answer is 4.');
        });

        it('should return null if question is not found', async () => {
            (Question.findById as jest.Mock).mockResolvedValue(null);

            const result = await questionService.getAIAnswer('qid123');

            expect(Question.findById).toHaveBeenCalledWith('qid123');
            expect(result).toBeNull();
        });
        it('should handle error when OpenAI API call fails', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            
            const mockQuestion = {
                _id: 'qid123',
                title: 'Test Question',
                text: 'What is 2+2?',
            };

            (Question.findById as jest.Mock).mockResolvedValue(mockQuestion);
            (openai.chat.completions.create as jest.Mock).mockRejectedValue(new Error('API error'));

            const result = await questionService.getAIAnswer('qid123');

            expect(Question.findById).toHaveBeenCalledWith('qid123');
            expect(openai.chat.completions.create).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith('Error getting AI answer:', expect.any(Error));
            expect(result).toBe('Sorry, I could not generate an answer at this time.');
            
            jest.restoreAllMocks();
        });

        it('should handle empty response from OpenAI API', async () => {
            const mockQuestion = {
                _id: 'qid123',
                title: 'Test Question',
                text: 'What is 2+2?',
            };
            const mockAIResponse = {
                choices: []
            };

            (Question.findById as jest.Mock).mockResolvedValue(mockQuestion);
            (openai.chat.completions.create as jest.Mock).mockResolvedValue(mockAIResponse);

            const result = await questionService.getAIAnswer('qid123');

            expect(Question.findById).toHaveBeenCalledWith('qid123');
            expect(openai.chat.completions.create).toHaveBeenCalled();
            expect(result).toBe('Sorry, I could not generate an answer at this time.');
        });
    });

    describe('addComment', () => {
        it('should add a comment to a question', async () => {
            const mockQuestion = {
                _id: 'qid123',
                comments: [],
                save: jest.fn().mockResolvedValue(undefined),
            };

            (Question.findById as jest.Mock).mockResolvedValue(mockQuestion);
            (sanitizeHtml as unknown as jest.Mock).mockImplementation((text) => text);

            const result = await questionService.addComment('qid123', {
                text: 'Test comment',
                comment_by: 'user123',
            });

            expect(Question.findById).toHaveBeenCalledWith('qid123');
            expect(mockQuestion.comments).toContainEqual({
                text: 'Test comment',
                comment_by: 'user123',
                comment_time: expect.any(Date),
            });
            expect(mockQuestion.save).toHaveBeenCalled();
            expect(result).toEqual({
                message: 'Comment added successfully',
                comment: {
                    text: 'Test comment',
                    comment_by: 'user123',
                    comment_time: expect.any(Date),
                },
            });
        });

        it('should sanitize comment with HTML link and add rel attribute', async () => {
            const mockQuestion = {
                _id: 'qid123',
                comments: [],
                save: jest.fn().mockResolvedValue(undefined),
            };

            (Question.findById as jest.Mock).mockResolvedValue(mockQuestion);
            // Mock sanitizeHtml to simulate transformTags behavior
            (sanitizeHtml as unknown as jest.Mock).mockImplementation((text, options) => {
                const transformed = options.transformTags.a('a', {
                    href: 'https://example.com',
                    target: '_blank',
                });
                return text.replace(
                    '<a href="https://example.com">link</a>',
                    `<a href="${transformed.attribs.href}" target="${transformed.attribs.target}" rel="${transformed.attribs.rel}">link</a>`
                );
            });

            const result = await questionService.addComment('qid123', {
                text: 'Check this <a href="https://example.com">link</a>',
                comment_by: 'user123',
            });

            expect(Question.findById).toHaveBeenCalledWith('qid123');
            expect(sanitizeHtml).toHaveBeenCalledWith(
                'Check this <a href="https://example.com">link</a>',
                expect.objectContaining({
                    allowedTags: ['b', 'i', 'em', 'strong', 'a'],
                    allowedAttributes: { a: ['href', 'target'] },
                    transformTags: expect.any(Object),
                })
            );
            expect(mockQuestion.comments).toContainEqual({
                text: 'Check this <a href="https://example.com" target="_blank" rel="noopener noreferrer">link</a>',
                comment_by: 'user123',
                comment_time: expect.any(Date),
            });
            expect(mockQuestion.save).toHaveBeenCalled();
            expect(result).toEqual({
                message: 'Comment added successfully',
                comment: {
                    text: 'Check this <a href="https://example.com" target="_blank" rel="noopener noreferrer">link</a>',
                    comment_by: 'user123',
                    comment_time: expect.any(Date),
                },
            });
        });

        it('should throw an error if question is not found', async () => {
            (Question.findById as jest.Mock).mockResolvedValue(null);

            await expect(
                questionService.addComment('qid123', {
                    text: 'Test comment',
                    comment_by: 'user123',
                })
            ).rejects.toThrow('Question not found');
        });

        it('should handle error when saving comment fails', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            
            const mockQuestion = {
                _id: 'qid123',
                comments: [],
                save: jest.fn().mockRejectedValue(new Error('Save error')),
            };

            (Question.findById as jest.Mock).mockResolvedValue(mockQuestion);
            (sanitizeHtml as unknown as jest.Mock).mockImplementation((text) => text);

            await expect(
                questionService.addComment('qid123', {
                    text: 'Test comment',
                    comment_by: 'user123',
                })
            ).rejects.toThrow('Error adding comment');

            expect(Question.findById).toHaveBeenCalledWith('qid123');
            expect(mockQuestion.save).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith('Error adding comment:', expect.any(Error));
            
            jest.restoreAllMocks();
        });
    });
});