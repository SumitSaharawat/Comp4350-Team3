import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from '../../db/userDB';
import { addUser, getAllUsers, getUsersByUsername, editUser, deleteUser } from '../../db/userService';

describe('User Service Tests', () => {
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
        await User.deleteMany({});
    });

    test('should add a user', async () => {
        const user = await addUser('testUser', 'password123', 100);
        expect(user.username).toBe('testUser');
        expect(user.balance).toBe(100);
    });

    test('should not add a user with duplicate username', async () => {
        await addUser('duplicateUser', 'password123', 100);
        await expect(addUser('duplicateUser', 'password123', 200)).rejects.toThrow('Username already exists');
    });

    test('should get all users', async () => {
        await addUser('user1', 'pass1', 50);
        await addUser('user2', 'pass2', 150);
        const users = await getAllUsers();
        expect(users.length).toBe(2);
    });

    test('should get user by username', async () => {
        await addUser('searchUser', 'pass123', 75);
        const users = await getUsersByUsername('searchUser');
        expect(users.length).toBe(1);
        expect(users[0].username).toBe('searchUser');
    });

    test('should edit a user', async () => {
        const user = await addUser('editUser', 'pass123', 80);
        const updatedUser = await editUser(user._id.toString(), 'newUser', undefined, 200);
        expect(updatedUser).not.toBeNull();
        expect(updatedUser?.username).toBe('newUser');
        expect(updatedUser?.balance).toBe(200);
    });

    test('should delete a user', async () => {
        const user = await addUser('deleteUser', 'pass123', 90);
        await deleteUser(user._id.toString());
        const users = await getAllUsers();
        expect(users.length).toBe(0);
    });
});
