import request from 'supertest';
import express from 'express';
import { loginController } from '../../src/controller/loginController';
import { getUsersByUsername } from '../../src/db/userService';

// Mock the database service
jest.mock('../../src/db/userService'); 

const app = express();
app.use(express.json());
app.post('/login', loginController);

describe('Login Controller', () => {
  it('should return 200 and a success message for valid credentials', async () => {
    const mockUser = [{ id: 1, username: 'user', password: 'hashedpassword' }];
    (getUsersByUsername as jest.Mock).mockResolvedValue(mockUser);
    
    const response = await request(app)
      .post('/login')
      .send({ username: 'user', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
  });

  it('should return 404 if user not found', async () => {
    (getUsersByUsername as jest.Mock).mockResolvedValue([]);

    const response = await request(app)
      .post('/login')
      .send({ username: 'user', password: 'password' });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
  });

  it('should return 401 for incorrect password', async () => {
    const mockUser = [{ id: 1, username: 'user', password: 'hashedpassword' }];
    (getUsersByUsername as jest.Mock).mockResolvedValue(mockUser);
    
    const response = await request(app)
      .post('/login')
      .send({ username: 'user', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid credentials');
  });
});
