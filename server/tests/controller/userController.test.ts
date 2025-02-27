import request from 'supertest';
import express from 'express';
import { addUserController, getAllUsersController, editUserController, deleteUserController } from '../../src/controller/userController';
import { addUser, getAllUsers, editUser, deleteUser } from '../../src/db/userService';

jest.mock('../../src/db/userService'); // Mocking userService

const app = express();
app.use(express.json());

app.post('/users', addUserController);
app.get('/users', getAllUsersController);
app.put('/users/:id', editUserController);
app.delete('/users/:id', deleteUserController);

describe('User Controller', () => {
    // POST /users - Create User
    describe('POST /users', () => {
        it('should create a user successfully', async () => {
            // Mock userService.addUser
            (addUser as jest.Mock).mockResolvedValue({
                _id: '123',
                username: 'testUser',
                password: 'password123',
            });

            const response = await request(app)
                .post('/users')
                .send({ username: 'testUser', password: 'password123' });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User created successfully');
            expect(response.body.user.username).toBe('testUser');
        });

        it('should return error if username already exists', async () => {
            // Mock userService.addUser to throw an error
            (addUser as jest.Mock).mockRejectedValue(new Error('Username already exists'));

            const response = await request(app)
                .post('/users')
                .send({ username: 'testUser', password: 'newpassword123' });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Username already exists');
        });
    });

    // GET /users - Get All Users
    describe('GET /users', () => {
        it('should return all users successfully', async () => {
            // Mock userService.getAllUsers
            (getAllUsers as jest.Mock).mockResolvedValue([
                { _id: '1', username: 'user1', password: 'password1' },
                { _id: '2', username: 'user2', password: 'password2' },
            ]);

            const response = await request(app).get('/users');

            expect(response.status).toBe(200);
            expect(response.body.users.length).toBe(2);
        });

        it('should handle errors when retrieving users', async () => {
            // Mock userService.getAllUsers to throw an error
            (getAllUsers as jest.Mock).mockRejectedValue(new Error('Error retrieving users'));

            const response = await request(app).get('/users');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Error retrieving users');
        });
    });

    // PUT /users/:id - Edit User
    describe('PUT /users/:id', () => {
        it('should update a user successfully', async () => {
            const updatedUser = { _id: '123', username: 'updatedUser', password: 'newpassword123' };

            // Mock userService.editUser
            (editUser as jest.Mock).mockResolvedValue(updatedUser);

            const response = await request(app)
                .put('/users/123')
                .send({ username: 'updatedUser', password: 'newpassword123' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User updated successfully');
            expect(response.body.user.username).toBe('updatedUser');
        });

        it('should return error if user not found', async () => {
            // Mock userService.editUser to return null (user not found)
            (editUser as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .put('/users/123')
                .send({ username: 'updatedUser', password: 'newpassword123' });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('User not found');
        });

        it('should return error if user ID format is invalid', async () => {
            const response = await request(app)
                .put('/users/invalidId')
                .send({ username: 'invalidUser', password: 'password123' });

            expect(response.status).toBe(404);
        });
    });

    // DELETE /users/:id - Delete User
    describe('DELETE /users/:id', () => {
        it('should delete a user successfully', async () => {
            // Mock userService.deleteUser
            (deleteUser as jest.Mock).mockResolvedValue({ deletedCount: 1 });

            const response = await request(app).delete('/users/123');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User deleted successfully');
        });

        it('should return error if user not found', async () => {
            // Mock userService.deleteUser to return { deletedCount: 0 }
            (deleteUser as jest.Mock).mockResolvedValue({ deletedCount: 0 });

            const response = await request(app).delete('/users/123');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('User not found');
        });

        it('should return error if user ID is invalid', async () => {
            const response = await request(app).delete('/users/invalidId');

            expect(response.status).toBe(404);
        });
    });
});
