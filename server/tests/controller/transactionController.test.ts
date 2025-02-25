import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import {
    addTransactionController,
    getAllTransactionController,
    editTransactionController,
    deleteTransactionController
} from '../../src/controller/transactionController';
import * as transactionService from '../../src/db/transactionService';

jest.mock('../../src/db/transactionService', () => ({
    ...jest.requireActual('../../src/db/transactionService'),
    addTransaction: jest.fn(),
    getAllTransactions: jest.fn(),
    editTransaction: jest.fn(),
    deleteTransaction: jest.fn(),
}));

describe('Transaction Controller', () => {
    const app = express();
    app.use(bodyParser.json());
    app.post('/transaction', addTransactionController);
    app.get('/transaction/:userId', getAllTransactionController);
    app.put('/transaction/:id', editTransactionController);
    app.delete('/transaction/:id', deleteTransactionController);

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return 201 if transaction is added successfully', async () => {
        const transaction = { id: '123', userId: 'user1', date: '2024-02-25', amount: 100, currency: 'USD', tag: { name: 'Food', color: '#ff0000' } };
        (transactionService.addTransaction as jest.Mock).mockResolvedValue(transaction);
        
        const response = await request(app).post('/transaction').send(transaction);
        
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Transaction added successfully');
        expect(transactionService.addTransaction).toHaveBeenCalledWith('user1', '2024-02-25', 100, 'USD', { name: 'Food', color: '#ff0000' });
    });

    test('should return 500 if transaction creation fails', async () => {
        (transactionService.addTransaction as jest.Mock).mockRejectedValue(new Error('Database error'));
        
        const response = await request(app).post('/transaction').send({ userId: 'user1', date: '2024-02-25', amount: 100, currency: 'USD', tag: { name: 'Food', color: '#ff0000' } });
        
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database error');
    });

    test('should return 200 with all transactions for a user', async () => {
        const transactions = [{ id: '123', userId: 'user1', date: '2024-02-25', amount: 100, currency: 'USD', tag: { name: 'Food', color: '#ff0000' } }];
        (transactionService.getAllTransactions as jest.Mock).mockResolvedValue(transactions);
        
        const response = await request(app).get('/transaction/user1');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual(transactions);
    });

    test('should return 500 if fetching transactions fails', async () => {
        (transactionService.getAllTransactions as jest.Mock).mockRejectedValue(new Error('Database error'));
        
        const response = await request(app).get('/transaction/user1');
        
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database error');
    });

    test('should return 200 if transaction is updated successfully', async () => {
        const updatedTransaction = { id: '123', userId: 'user1', date: '2024-02-26', amount: 150, currency: 'USD', tag: { name: 'Groceries', color: '#00ff00' } };
        (transactionService.editTransaction as jest.Mock).mockResolvedValue(updatedTransaction);
        
        const response = await request(app).put('/transaction/123').send(updatedTransaction);
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Transaction updated successfully');
    });

    test('should return 404 if transaction to update is not found', async () => {
        (transactionService.editTransaction as jest.Mock).mockResolvedValue(null);
        
        const response = await request(app).put('/transaction/123').send({ date: '2024-02-26', amount: 150, currency: 'USD', tag: { name: 'Groceries', color: '#00ff00' } });
        
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Transaction not found');
    });

    test('should return 200 if transaction is deleted successfully', async () => {
        (transactionService.deleteTransaction as jest.Mock).mockResolvedValue({ deletedCount: 1 });
        
        const response = await request(app).delete('/transaction/123');
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Transaction deleted successfully');
    });

    test('should return 404 if transaction to delete is not found', async () => {
        (transactionService.deleteTransaction as jest.Mock).mockResolvedValue({ deletedCount: 0 });
        
        const response = await request(app).delete('/transaction/123');
        
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Transaction not found');
    });
});
