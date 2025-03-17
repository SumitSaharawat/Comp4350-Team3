import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Tag from '../../db/tagDB';
import { addTag, getAllTags, editTag, deleteTag } from '../../db/tagService';

describe('Tag Service Tests', () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Tag.deleteMany({});
    });

    test('should add a tag', async () => {
        const tag = await addTag('Tag1', '#FF5733');
        expect(tag.name).toBe('Tag1');
        expect(tag.color).toBe('#FF5733');
    });

    test('should not add a tag with invalid color', async () => {
        await expect(addTag('Invalid Tag', 'invalid-color')).rejects.toThrow(
            'Tag validation failed: color: Path `color` is invalid (invalid-color).'
        );
    });

    test('should get all tags', async () => {
        await addTag('Tag1', '#FF5733');
        await addTag('Tag2', '#33FF57');
        
        const tags = await getAllTags();
        expect(tags.length).toBe(2);
        expect(tags[0].name).toBe('Tag1');
        expect(tags[1].name).toBe('Tag2');
    });

    test('should edit a tag', async () => {
        const tag = await addTag('Tag1', '#FF5733');
        const updatedTag = await editTag(tag._id.toString(), 'Updated Tag', '#33FF57');
        expect(updatedTag).not.toBeNull();
        expect(updatedTag?.name).toBe('Updated Tag');
        expect(updatedTag?.color).toBe('#33FF57');
    });

    test('should delete a tag', async () => {
        const tag = await addTag('Tag1', '#FF5733');
        await deleteTag(tag._id.toString());
        const tags = await getAllTags();
        expect(tags.length).toBe(0);
    });
});
