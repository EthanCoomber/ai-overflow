import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import AnswerSchema from '../models/schema/answer';
import { IAnswerDocument, IAnswerModel } from '../types/types';

jest.mock('../services/answerService');

jest.setTimeout(30000); // Extend Jest timeout for slow startups

describe('AnswerSchema', () => {
  let mongoServer: MongoMemoryServer | null = null;
  let Answer: IAnswerModel | undefined;

  beforeAll(async () => {
    try {
      console.log("🧪 Starting MongoMemoryServer...");
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
      Answer = mongoose.model<IAnswerDocument, IAnswerModel>('Answer', AnswerSchema);
      console.log("✅ MongoMemoryServer started and Mongoose connected");
    } catch (error) {
      console.error("❌ Failed to initialize MongoMemoryServer or Mongoose:", error);
      mongoServer = null;
    }
  });

  afterEach(async () => {
    if (Answer) {
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
    it('should require text, ans_by, and ans_date_time fields', async () => {
      if (!Answer) throw new Error("❌ Answer model not initialized");
      const invalidAnswer = new Answer({});
      await expect(invalidAnswer.save()).rejects.toThrow(/Path `text` is required/);
      await expect(invalidAnswer.save()).rejects.toThrow(/Path `ans_by` is required/);
      await expect(invalidAnswer.save()).rejects.toThrow(/Path `ans_date_time` is required/);
    });

    it('should save a valid answer', async () => {
      if (!Answer) throw new Error("❌ Answer model not initialized");
      const validAnswer = new Answer({
        text: 'This is an answer',
        ans_by: 'testuser',
        ans_date_time: new Date(),
      });
      const savedAnswer = await validAnswer.save();
      expect(savedAnswer.text).toBe('This is an answer');
      expect(savedAnswer.ans_by).toBe('testuser');
      expect(savedAnswer.ans_date_time).toBeInstanceOf(Date);
    });
  });

  describe('findAllAnswers Static Method', () => {
    it('should return all answers in the collection', async () => {
      if (!Answer) throw new Error("❌ Answer model not initialized");
      await Answer.create([
        { text: 'Answer 1', ans_by: 'user1', ans_date_time: new Date() },
        { text: 'Answer 2', ans_by: 'user2', ans_date_time: new Date() },
      ]);
      const answers = await Answer.findAllAnswers();
      expect(answers).toHaveLength(2);
    });

    it('should return an empty array when no answers exist', async () => {
      if (!Answer) throw new Error("❌ Answer model not initialized");
      const answers = await Answer.findAllAnswers();
      expect(answers).toEqual([]);
    });
  });

  describe('toJSON Transform', () => {
    it('should convert _id to string and remove __v', async () => {
      if (!Answer) throw new Error("❌ Answer model not initialized");
      const answer = await Answer.create({
        text: 'Test answer',
        ans_by: 'testuser',
        ans_date_time: new Date(),
      });
      const json = answer.toJSON();
      expect(typeof json._id).toBe('string');
      expect(json.__v).toBeUndefined();
      expect(json.text).toBe('Test answer');
      expect(json.ans_by).toBe('testuser');
    });
  });
});
