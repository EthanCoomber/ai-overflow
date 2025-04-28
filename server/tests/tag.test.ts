// To run: NODE_ENV=test npx jest
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import TagSchema from '../models/schema/tag'; // Adjust path to your tag.ts file
import { ITagDocument, ITagModel } from '../types/types'; // Adjust path to types

describe('TagSchema', () => {
    let mongoServer: MongoMemoryServer;
    let Tag: ITagModel;

    // Set up in-memory MongoDB server and connect Mongoose
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);

        // Create the Tag model
        Tag = mongoose.model<ITagDocument, ITagModel>('Tag', TagSchema);
    });

    // Clean up after each test
    afterEach(async () => {
        await Tag.deleteMany({});
    });

    // Disconnect and stop MongoDB server after all tests
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe('Schema Validation', () => {
        it('should require name field', async () => {
            const invalidTag = new Tag({});
            await expect(invalidTag.save()).rejects.toThrow(/Path `name` is required/);
        });

        it('should save a valid tag', async () => {
            const validTag = new Tag({
                name: 'test-tag',
            });
            const savedTag = await validTag.save();
            expect(savedTag.name).toBe('test-tag');
        });
    });

    describe('Static Methods', () => {
        describe('findByName', () => {
            it('should find a tag by name', async () => {
                await Tag.create({ name: 'test-tag' });
                const tag = await Tag.findByName('test-tag');
                expect(tag).not.toBeNull();
                expect(tag!.name).toBe('test-tag');
            });

            it('should return null if tag is not found', async () => {
                const tag = await Tag.findByName('nonexistent');
                expect(tag).toBeNull();
            });
        });

        describe('findAllTags', () => {
            it('should return all tags in the collection', async () => {
                await Tag.create([
                    { name: 'tag1' },
                    { name: 'tag2' },
                ]);
                const tags = await Tag.findAllTags();
                expect(tags).toHaveLength(2);
                expect(tags.map(t => t.name)).toContain('tag1');
                expect(tags.map(t => t.name)).toContain('tag2');
            });

            it('should return an empty array if no tags exist', async () => {
                const tags = await Tag.findAllTags();
                expect(tags).toEqual([]);
            });
        });

        describe('createTag', () => {
            it('should create a new tag', async () => {
                const tag = await Tag.createTag('new-tag');
                expect(tag.name).toBe('new-tag');
                const savedTag = await Tag.findOne({ name: 'new-tag' });
                expect(savedTag).not.toBeNull();
                expect(savedTag!.name).toBe('new-tag');
            });
        });
    });

    describe('toJSON Transform', () => {
        it('should convert _id to string and remove __v', async () => {
            const tag = await Tag.create({ name: 'test-tag' });
            const json = tag.toJSON();
            expect(typeof json._id).toBe('string');
            expect(json.__v).toBeUndefined();
            expect(json.name).toBe('test-tag');
        });
    });
});