import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { loginController, createAccountController, resetPasswordController } from '../../src/controller/loginController';
import * as userService from '../../src/db/userService';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

jest.mock('../../src/db/userService');

describe('Login Controller', () => {
    const app = express();
    app.use(bodyParser.json());
    app.post('/login', loginController);
    app.post('/register', createAccountController);
    app.post('/reset-password', resetPasswordController);

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return 404 if user is not found', async () => {
        (userService.getUsersByUsername as jest.Mock).mockResolvedValue([]);
        const response = await request(app).post('/login').send({ username: 'unknown', password: 'password' });
        expect(response.status).toBe(404);
    });

    test('should return 401 if password is incorrect', async () => {
        const hashedPassword = bcrypt.hashSync('correct_password', 10);
        (userService.getUsersByUsername as jest.Mock).mockResolvedValue([
            { _id: new mongoose.Types.ObjectId(), username: 'user', password: hashedPassword },
        ]);

        const response = await request(app).post('/login').send({ username: 'user', password: 'wrong_password' });
        expect(response.status).toBe(401);
    });

    test('should return a token if login is successful', async () => {
        const hashedPassword = bcrypt.hashSync('password', 10);
        (userService.getUsersByUsername as jest.Mock).mockResolvedValue([
            { _id: new mongoose.Types.ObjectId(), username: 'user', password: hashedPassword },
        ]);

        const response = await request(app).post('/login').send({ username: 'user', password: 'password' });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
    });

    test('should return 403 if username already exists when registering', async () => {
        (userService.getUsersByUsername as jest.Mock).mockResolvedValue([
            { _id: new mongoose.Types.ObjectId(), username: 'user' },
        ]);

        const response = await request(app).post('/register').send({ username: 'user', password: 'password' });
        expect(response.status).toBe(403);
    });

    test('should return 200 if account is created successfully', async () => {
        (userService.getUsersByUsername as jest.Mock).mockResolvedValue([]);
        (userService.addUser as jest.Mock).mockResolvedValue({ _id: new mongoose.Types.ObjectId(), username: 'new_user' });

        const response = await request(app).post('/register').send({ username: 'new_user', password: 'password' });
        expect(response.status).toBe(200);
    });

    test('should return 200 if password is reset successfully', async () => {
        (userService.getUsersByUsername as jest.Mock).mockResolvedValue([
            { _id: new mongoose.Types.ObjectId(), username: 'user' },
        ]);
        (userService.editUser as jest.Mock).mockResolvedValue({
            _id: new mongoose.Types.ObjectId(),
            username: 'user',
            password: bcrypt.hashSync('new_password', 10),
        });

        const response = await request(app).post('/reset-password').send({ username: 'user', newPassword: 'new_password' });
        expect(response.status).toBe(200);
    });

    test('should return 401 if user is not found when resetting password', async () => {
        (userService.getUsersByUsername as jest.Mock).mockResolvedValue([]);
        (userService.editUser as jest.Mock).mockResolvedValue(null);

        const response = await request(app).post('/reset-password').send({ username: 'unknown', newPassword: 'new_password' });
        expect(response.status).toBe(401);
    });
});
