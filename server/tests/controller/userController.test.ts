import request from 'supertest';
import express from 'express';
import { addUserController, getAllUsersController, editUserController, deleteUserController } from '../../src/controller/userController';
import { addUser, getAllUsers, editUser, deleteUser } from '../../src/db/userService';

jest.mock('../../src/db/userService');

const app = express();
app.use(express.json());

app.post('/users', addUserController);
app.get('/users', getAllUsersController);
app.put('/users/:id', editUserController);
app.delete('/users/:id', deleteUserController);

describe('User Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    test('should create a user', async () => {
        (addUser as jest.Mock).mockResolvedValue({
            id: '1',
            username: 'testuser',
            password: 'hashedpassword'
        });

        const response = await request(app)
            .post('/users')
            .send({ username: 'testuser', password: 'password123' });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: 'User created successfully',
            user: {
                id: '1',
                username: 'testuser',
                password: 'hashedpassword'
            }
        });
    });

    test('should retrieve all users', async () => {
        (getAllUsers as jest.Mock).mockResolvedValue([
            { id: '1', username: 'user1' },
            { id: '2', username: 'user2' }
        ]);

        const response = await request(app).get('/users');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            users: [
                { id: '1', username: 'user1' },
                { id: '2', username: 'user2' }
            ]
        });
    });

    test('should update a user', async () => {
        (editUser as jest.Mock).mockResolvedValue({
            id: '1',
            username: 'updatedUser',
            password: 'newhashedpassword'
        });

        const response = await request(app)
            .put('/users/1')
            .send({ username: 'updatedUser', password: 'newpassword123' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'User updated successfully',
            user: {
                id: '1',
                username: 'updatedUser',
                password: 'newhashedpassword'
            }
        });
    });

    test('should return 404 if updating a non-existing user', async () => {
        (editUser as jest.Mock).mockResolvedValue(null);

        const response = await request(app)
            .put('/users/999')
            .send({ username: 'newuser', password: 'pass123' });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'User not found' });
    });

    test('should delete a user', async () => {
        (deleteUser as jest.Mock).mockResolvedValue({ deletedCount: 1 });

        const response = await request(app).delete('/users/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'User deleted successfully' });
    });

    test('should return 404 if deleting a non-existing user', async () => {
        (deleteUser as jest.Mock).mockResolvedValue({ deletedCount: 0 });

        const response = await request(app).delete('/users/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'User not found' });
    });
});
