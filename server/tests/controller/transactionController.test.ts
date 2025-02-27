import { Request, Response } from 'express';
import { 
    addTransactionController, 
    getAllTransactionController, 
    editTransactionController, 
    deleteTransactionController 
} from '../../src/controller/transactionController';

import { 
    addTransaction, 
    getAllTransactions, 
    editTransaction, 
    deleteTransaction 
} from '../../src/db/transactionService';

// Mock transactionService
jest.mock('../../src/db/transactionService');

describe('Transaction Controller', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });

        mockRes = {
            status: statusMock,
            json: jsonMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('addTransactionController', () => {
        it('should return 201 and transaction data when successful', async () => {
            mockReq = { body: { userId: '123', name: 'Test', date: '2025-02-26', amount: 100, currency: 'USD' } };
            const mockTransaction = { _id: '1', ...mockReq.body };

            (addTransaction as jest.Mock).mockResolvedValue(mockTransaction);

            await addTransactionController(mockReq as Request, mockRes as Response);

            expect(addTransaction).toHaveBeenCalledWith('123', 'Test', '2025-02-26', 100, 'USD');
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Transaction added successfully',
                transaction: expect.objectContaining({ id: '1', name: 'Test', amount: 100, currency: 'USD' }),
            });
        });

        it('should return 500 if transaction creation fails', async () => {
            mockReq = { body: { userId: '123', name: 'Test', date: '2025-02-26', amount: 100, currency: 'USD' } };

            (addTransaction as jest.Mock).mockRejectedValue(new Error('Database error'));

            await addTransactionController(mockReq as Request, mockRes as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });

    describe('getAllTransactionController', () => {
        it('should return 200 and a list of transactions', async () => {
            mockReq = { params: { userId: '123' } };
            const mockTransactions = [{ _id: '1', name: 'Test', date: '2025-02-26', amount: 100, currency: 'USD' }];

            (getAllTransactions as jest.Mock).mockResolvedValue(mockTransactions);

            await getAllTransactionController(mockReq as Request, mockRes as Response);

            expect(getAllTransactions).toHaveBeenCalledWith('123');
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith([
                expect.objectContaining({ id: '1', name: 'Test', amount: 100, currency: 'USD' }),
            ]);
        });

        it('should return 500 if retrieval fails', async () => {
            mockReq = { params: { userId: '123' } };

            (getAllTransactions as jest.Mock).mockRejectedValue(new Error('Database error'));

            await getAllTransactionController(mockReq as Request, mockRes as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });

    describe('editTransactionController', () => {
        it('should return 200 and updated transaction data if transaction exists', async () => {
            mockReq = { params: { id: '1' }, body: { name: 'Updated Test' } };
            const mockTransaction = { _id: '1', name: 'Updated Test', date: '2025-02-26', amount: 100, currency: 'USD' };

            (editTransaction as jest.Mock).mockResolvedValue(mockTransaction);

            await editTransactionController(mockReq as Request, mockRes as Response);

            expect(editTransaction).toHaveBeenCalledWith('1', 'Updated Test', undefined, undefined, undefined);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Transaction updated successfully',
                transaction: expect.objectContaining({ id: '1', name: 'Updated Test' }),
            });
        });

        it('should return 404 if transaction does not exist', async () => {
            mockReq = { params: { id: '1' }, body: { name: 'Updated Test' } };

            (editTransaction as jest.Mock).mockResolvedValue(null);

            await editTransactionController(mockReq as Request, mockRes as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Transaction not found' });
        });

        it('should return 500 if update fails', async () => {
            mockReq = { params: { id: '1' }, body: { name: 'Updated Test' } };

            (editTransaction as jest.Mock).mockRejectedValue(new Error('Database error'));

            await editTransactionController(mockReq as Request, mockRes as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });

    describe('deleteTransactionController', () => {
        it('should return 200 if transaction is deleted', async () => {
            mockReq = { params: { id: '1' } };
            (deleteTransaction as jest.Mock).mockResolvedValue({ deletedCount: 1 });

            await deleteTransactionController(mockReq as Request, mockRes as Response);

            expect(deleteTransaction).toHaveBeenCalledWith('1');
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Transaction deleted successfully' });
        });

        it('should return 404 if transaction is not found', async () => {
            mockReq = { params: { id: '1' } };
            (deleteTransaction as jest.Mock).mockResolvedValue({ deletedCount: 0 });

            await deleteTransactionController(mockReq as Request, mockRes as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Transaction not found' });
        });

        it('should return 500 if deletion fails', async () => {
            mockReq = { params: { id: '1' } };

            (deleteTransaction as jest.Mock).mockRejectedValue(new Error('Database error'));

            await deleteTransactionController(mockReq as Request, mockRes as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });
});
