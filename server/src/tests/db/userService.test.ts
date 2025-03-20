import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from '../../db/userDB';
import { addUser, getAllUsers, getUsersByUsername, editUser, deleteUser } from '../../db/userService';

describe('User Service Tests', () => {
    let mongoServer: MongoMemoryServer;
    let existingUserId: string;

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
        await User.deleteMany({});
        const user = await addUser('testUser', 'password123', 100);
        existingUserId = user._id.toString();
    });

    test('should add a user', async () => {
        const user = await addUser('newUser', 'securePass', 200);
        expect(user.username).toBe('newUser');
        expect(user.balance).toBe(200);
    });

    test('should not add a user with duplicate username', async () => {
        await expect(addUser('testUser', 'anotherPass', 150))
            .rejects.toThrow('Username already exists');
    });

    test('should not add a user without balance', async () => {
        await expect(addUser('noBalanceUser', 'password', undefined as any))
            .rejects.toThrow('Balance is required');
    });

    test('should get all users', async () => {
        await addUser('user1', 'pass1', 50);
        await addUser('user2', 'pass2', 150);
        const users = await getAllUsers();
        expect(users.length).toBe(3); // 包括 beforeEach 添加的 testUser
    });

    test('should get user by username', async () => {
        const users = await getUsersByUsername('testUser');
        expect(users.length).toBe(1);
        expect(users[0].username).toBe('testUser');
    });

    test('should return empty array for non-existent username', async () => {
        const users = await getUsersByUsername('nonExistentUser');
        expect(users).toEqual([]);
    });

    test('should edit a user', async () => {
        const updatedUser = await editUser(existingUserId, 'updatedUser', undefined, 200);
        expect(updatedUser).not.toBeNull();
        expect(updatedUser?.username).toBe('updatedUser');
        expect(updatedUser?.balance).toBe(200);
    });

    test('should not update user with invalid ID format', async () => {
        await expect(editUser('invalidID', 'newUser'))
            .rejects.toThrow('Invalid user ID format');
    });

    test('should not allow duplicate usernames when editing', async () => {
        await addUser('uniqueUser', 'pass', 300);
        await expect(editUser(existingUserId, 'uniqueUser'))
            .rejects.toThrow('Username already exists');
    });

    test('should return null when editing a non-existent user', async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const result = await editUser(fakeId, 'newName');
        expect(result).toBeNull();
    });

    test('should delete a user', async () => {
        await deleteUser(existingUserId);
        const users = await getAllUsers();
        expect(users.length).toBe(0);
    });

    test('should not delete non-existent user', async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const result = await deleteUser(fakeId);
        expect(result.deletedCount).toBe(0);
    });

    test('should throw error when deleting with invalid ID format', async () => {
        await expect(deleteUser('invalidID'))
            .rejects.toThrow('Invalid user ID');
    });
});