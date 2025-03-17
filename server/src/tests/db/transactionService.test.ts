import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Transaction from '../../db/transactionDB';
import User from '../../db/userDB';
import Tag from '../../db/tagDB';
import { addTransaction, getAllTransactions, editTransaction, deleteTransaction } from '../../db/transactionService';
import { addUser } from '../../db/userService';

describe('Transaction Service Tests', () => {
    let mongoServer: MongoMemoryServer;
    let userId: string;
    let tagId: string;

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
        await Transaction.deleteMany({});
        await User.deleteMany({});
        await Tag.deleteMany({});

        const user = await addUser('testUser', 'password123', 500);
        userId = user._id.toString();

        const tag = new Tag({ name: 'Food', color: '#FF5733' });
        await tag.save();
        tagId = tag._id.toString();
    });

    test('should add a transaction', async () => {
        const transaction = await addTransaction(userId, 'Grocery Shopping', '2025-05-10', 50, 'CAD', [tagId]);

        expect(transaction.name).toBe('Grocery Shopping');
        expect(transaction.amount).toBe(50);
        expect(transaction.currency).toBe('CAD');
        expect(transaction.tags.length).toBe(1);
        expect(transaction.tags[0].toString()).toBe(tagId);
    });

    test('should not add a transaction with an invalid user ID', async () => {
        await expect(addTransaction('invalidUserId', 'Test', '2025-05-10', 50, 'CAD'))
            .rejects.toThrow('User does not exist');
    });

    test('should retrieve all transactions for a user', async () => {
        await addTransaction(userId, 'Rent', '2025-06-01', 1200, 'CAD');
        await addTransaction(userId, 'Internet Bill', '2025-06-05', 60, 'CAD');

        const transactions = await getAllTransactions(userId);
        expect(transactions.length).toBe(2);
    });

    test('should edit a transaction', async () => {
        const transaction = await addTransaction(userId, 'Gym Membership', '2025-07-01', 30, 'CAD');
        const updatedTransaction = await editTransaction(transaction._id.toString(), 'Updated Gym', undefined, 40, 'USD');

        expect(updatedTransaction).not.toBeNull();
        expect(updatedTransaction?.name).toBe('Updated Gym');
        expect(updatedTransaction?.amount).toBe(40);
        expect(updatedTransaction?.currency).toBe('USD');
    });

    test('should delete a transaction', async () => {
        const transaction = await addTransaction(userId, 'Coffee', '2025-06-15', 5, 'CAD');
        await deleteTransaction(transaction._id.toString());

        const transactions = await getAllTransactions(userId);
        expect(transactions.length).toBe(0);
    });
});
