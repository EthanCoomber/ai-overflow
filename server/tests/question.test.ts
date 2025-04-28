import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import QuestionSchema from '../models/schema/question';
import AnswerSchema from '../models/schema/answer';
import { IQuestionDocument, IQuestionModel, ITagDocument, IAnswerDocument } from '../types/types';

jest.setTimeout(30000);

describe('QuestionSchema', () => {
  let mongoServer: MongoMemoryServer | null = null;
  let Question: IQuestionModel | undefined;
  let Tag: mongoose.Model<ITagDocument> | undefined;
  let Answer: mongoose.Model<IAnswerDocument> | undefined;

  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create({
        instance: {
          args: ['--quiet'],
        },
        binary: {
          downloadDir: './.mongodb-binaries',
        },
      });

      const uri = mongoServer.getUri();
      await mongoose.connect(uri);

      const TagSchema = new mongoose.Schema<ITagDocument>({
        name: { type: String, required: true },
      }, { collection: 'Tag' });

      Tag = mongoose.model<ITagDocument>('Tag', TagSchema);
      Answer = mongoose.model<IAnswerDocument>('Answer', AnswerSchema);
      Question = mongoose.model<IQuestionDocument, IQuestionModel>('Question', QuestionSchema);
    } catch (err) {
      console.error("❌ MongoMemoryServer setup failed:", err);
      mongoServer = null;
    }
  });

  afterEach(async () => {
    if (Question && Tag && Answer) {
      await Question.deleteMany({});
      await Tag.deleteMany({});
      await Answer.deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  describe('Schema Validation', () => {
    it('should require title, text, asked_by, and ask_date_time fields', async () => {
      if (!Question) throw new Error('Question model not initialized');
      const invalidQuestion = new Question({});
      await expect(invalidQuestion.save()).rejects.toThrow(/Path `title` is required/);
      await expect(invalidQuestion.save()).rejects.toThrow(/Path `text` is required/);
      await expect(invalidQuestion.save()).rejects.toThrow(/Path `asked_by` is required/);
      await expect(invalidQuestion.save()).rejects.toThrow(/Path `ask_date_time` is required/);
    });

    it('should save a valid question with default views and votes', async () => {
      if (!Question) throw new Error('Question model not initialized');
      const valid = new Question({
        title: 'Test Question',
        text: 'This is a test question',
        asked_by: 'testuser',
        ask_date_time: new Date(),
      });
      const saved = await valid.save();
      expect(saved.views).toBe(0);
      expect(saved.votes).toBe(0);
      expect(saved.answers).toEqual([]);
      expect(saved.tags).toEqual([]);
      expect(saved.comments).toEqual([]);
    });

    it('should save a question with comments', async () => {
      if (!Question) throw new Error('Question model not initialized');
      const question = new Question({
        title: 'Test Question',
        text: 'This is a test question',
        asked_by: 'testuser',
        ask_date_time: new Date(),
        comments: [{ text: 'Test comment', comment_by: 'user1', comment_time: new Date() }],
      });
      const saved = await question.save();
      expect(saved.comments).toHaveLength(1);
      expect(saved.comments[0].text).toBe('Test comment');
    });
  });

  describe('Instance Methods', () => {
    it('should increment views by 1', async () => {
      if (!Question) throw new Error('Question model not initialized');
      const q = await Question.create({
        title: 'Q',
        text: 'T',
        asked_by: 'user',
        ask_date_time: new Date(),
      });
      const updated = await q.incrementViews();
      expect(updated.views).toBe(1);
    });

    it('should increment votes by 1', async () => {
      if (!Question) throw new Error('Question model not initialized');
      const q = await Question.create({
        title: 'Q',
        text: 'T',
        asked_by: 'user',
        ask_date_time: new Date(),
      });
      const updated = await q.incrementVotes();
      expect(updated.votes).toBe(1);
    });

    it('should add an answer ID to the answers array', async () => {
      if (!Question || !Answer) throw new Error('Models not initialized');
      const q = await Question.create({
        title: 'Q',
        text: 'T',
        asked_by: 'user',
        ask_date_time: new Date(),
      });
      const a = await Answer.create({
        text: 'Answer',
        ans_by: 'user',
        ans_date_time: new Date(),
      });
      const updated = await q.addAnswer(a._id);
      expect(updated.answers).toContainEqual(a._id);
    });
  });

  describe('Static Methods', () => {
    it('should return questions with a specific tag', async () => {
      if (!Question || !Tag) throw new Error('Models not initialized');
      const tag = await Tag.create({ name: 'test-tag' });
      await Question.create({
        title: 'Q',
        text: 'T',
        asked_by: 'user',
        ask_date_time: new Date(),
        tags: [tag._id],
      });
      const results = await Question.findQuestionsWithTag(tag._id.toString());
      expect(results).toHaveLength(1);
      expect(results[0].tags).toContainEqual(tag._id);
    });

    it('should return an empty array if no questions have the tag', async () => {
      if (!Question) throw new Error('Question model not initialized');
      const tagId = new mongoose.Types.ObjectId();
      const results = await Question.findQuestionsWithTag(tagId.toString());
      expect(results).toEqual([]);
    });

    it('should return questions sorted by ask_date_time descending', async () => {
      if (!Question || !Tag || !Answer) throw new Error('Models not initialized');
      const tag = await Tag.create({ name: 'test-tag' });
      const answer = await Answer.create({
        text: 'A',
        ans_by: 'user',
        ans_date_time: new Date(),
      });

      await Question.create([
        {
          title: 'Older',
          text: 'Old',
          asked_by: 'u1',
          ask_date_time: new Date('2022-01-01'),
          tags: [tag._id],
          answers: [answer._id],
        },
        {
          title: 'Newer',
          text: 'New',
          asked_by: 'u2',
          ask_date_time: new Date('2023-01-01'),
          tags: [tag._id],
          answers: [answer._id],
        },
      ]);

      const results = await Question.findRecentQuestions();
      expect(results).toHaveLength(2);
      expect(results[0].title).toBe('Newer');
      expect(results[1].title).toBe('Older');
    });

    it('should return an empty array if no questions exist', async () => {
      if (!Question) throw new Error('Question model not initialized');
      const results = await Question.findRecentQuestions();
      expect(results).toEqual([]);
    });
  });

  describe('JSON Transformation', () => {
    it('should transform ObjectId to string in toJSON method', async () => {
      if (!Question || !Tag) throw new Error('Models not initialized');
      
      const tag = await Tag.create({ name: 'json-test-tag' });
      const question = await Question.create({
        title: 'JSON Test',
        text: 'Testing JSON transformation',
        asked_by: 'user',
        ask_date_time: new Date(),
        tags: [tag._id],
      });

      // Convert to JSON
      const jsonQuestion = question.toJSON();
      
      // Check that _id is a string
      expect(typeof jsonQuestion._id).toBe('string');
      
      // Check that tag IDs are properly transformed
      expect(Array.isArray(jsonQuestion.tags)).toBe(true);
      expect(typeof jsonQuestion.tags[0]._id).toBe('string');
      
      // Verify __v is removed
      expect(jsonQuestion.__v).toBeUndefined();
    });

    it('should handle tag objects in toJSON transformation', async () => {
      if (!Question || !Tag) throw new Error('Models not initialized');
      
      const tag = await Tag.create({ name: 'complex-tag' });
      const question = await Question.create({
        title: 'Complex JSON Test',
        text: 'Testing complex JSON transformation',
        asked_by: 'user',
        ask_date_time: new Date(),
        tags: [tag._id],
      });

      // Populate tags to test object transformation
      const populatedQuestion = await Question.findById(question._id).populate('tags');
      
      if (!populatedQuestion) throw new Error('Question not found');
      
      // Convert to JSON
      const jsonQuestion = populatedQuestion.toJSON();
      
      // Check that tag objects have string IDs
      expect(typeof jsonQuestion.tags[0]._id).toBe('string');
      expect(jsonQuestion.tags[0].name).toBe('complex-tag');
    });
  });
});
