import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../models/user'; // Adjust path to your user.ts file
import { IUserModel } from '../types/types';

describe('UserSchema', () => {
  let mongoServer: MongoMemoryServer;
  let UserModel: IUserModel;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  
    await mongoose.connection.db!.dropDatabase(); // 💥 non-null assertion
    UserModel = User;
    await UserModel.syncIndexes();
  });
  

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('Schema Validation', () => {
    it('should require username, email, and password fields', async () => {
      const invalidUser = new UserModel({});
      await expect(invalidUser.save()).rejects.toThrow(/Path `username` is required/);
      await expect(invalidUser.save()).rejects.toThrow(/Path `email` is required/);
      await expect(invalidUser.save()).rejects.toThrow(/Path `password` is required/);
    });

    it('should enforce email uniqueness', async () => {
      await UserModel.create({
        username: 'user1',
        email: 'test@example.com',
        password: 'password123',
      });

      const duplicateUser = new UserModel({
        username: 'user2',
        email: 'test@example.com',
        password: 'password456',
      });

      try {
        await duplicateUser.save();
        throw new Error('Expected duplicate key error, but save succeeded');
      } catch (err: unknown) {
        if (
          err instanceof mongoose.mongo.MongoServerError &&
          err.code === 11000
        ) {
          expect(err.message).toMatch(/duplicate key/);
          expect(err.code).toBe(11000);
        } else {
          throw new Error('Expected duplicate key error, but got something else');
        }
      }      
    });

    it('should save a valid user', async () => {
      const validUser = new UserModel({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      const savedUser = await validUser.save();
      expect(savedUser.username).toBe('testuser');
      expect(savedUser.email).toBe('test@example.com');
      expect(savedUser.password).toBe('password123');
    });
  });

  describe('Static Methods', () => {
    describe('findUserByEmail', () => {
      it('should find a user by email', async () => {
        await UserModel.create({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });
        const user = await UserModel.findUserByEmail('test@example.com');
        expect(user).not.toBeNull();
        expect(user!.email).toBe('test@example.com');
        expect(user!.username).toBe('testuser');
      });

      it('should return null if user is not found by email', async () => {
        const user = await UserModel.findUserByEmail('nonexistent@example.com');
        expect(user).toBeNull();
      });
    });

    describe('findUserByUsername', () => {
      it('should find a user by username', async () => {
        await UserModel.create({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });
        const user = await UserModel.findUserByUsername('testuser');
        expect(user).not.toBeNull();
        expect(user!.username).toBe('testuser');
        expect(user!.email).toBe('test@example.com');
      });

      it('should return null if user is not found by username', async () => {
        const user = await UserModel.findUserByUsername('nonexistent');
        expect(user).toBeNull();
      });
    });

    describe('createUser', () => {
      it('should create a new user', async () => {
        const userData = {
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123',
        };
        const user = await UserModel.createUser(userData);
        expect(user.username).toBe('newuser');
        expect(user.email).toBe('newuser@example.com');
        expect(user.password).toBe('password123');
        const savedUser = await UserModel.findOne({ email: 'newuser@example.com' });
        expect(savedUser).not.toBeNull();
        expect(savedUser!.username).toBe('newuser');
      });
    });
  });

  describe('toJSON Transform', () => {
    it('should convert _id to string and remove __v', async () => {
      const user = await UserModel.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      const json = user.toJSON();
      expect(typeof json._id).toBe('string');
      expect(json.__v).toBeUndefined();
      expect(json.password).toBeUndefined(); // password should be removed
      expect(json.username).toBe('testuser');
      expect(json.email).toBe('test@example.com');
    });
  });
});
