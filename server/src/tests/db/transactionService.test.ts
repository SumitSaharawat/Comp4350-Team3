import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Transaction from '../../db/transactionDB';
import User from '../../db/userDB';
import Tag from '../../db/tagDB';
import { addTransaction, getAllTransactions, editTransaction, deleteTransaction } from '../../db/transactionService';
import { addUser } from '../../db/userService';

describe('Transaction Service Tests', () => {
    let mongoServer: MongoMemoryServer;
    let userId: mongoose.Types.ObjectId;
    let tagId: mongoose.Types.ObjectId;

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
        userId = user._id;

        const tag = new Tag({ name: 'Food', color: '#FF5733' });
        await tag.save();
        tagId = tag._id;
    });

    test('should add a transaction', async () => {
        const transaction = await addTransaction(userId.toString(), 'Grocery Shopping', '2025-05-10', 50, 'CAD', 'Spending', [tagId.toString()]);

        expect(transaction.user).toEqual(userId);
        expect(transaction.name).toBe('Grocery Shopping');
        expect(transaction.amount).toBe(50);
        expect(transaction.currency).toBe('CAD');
        expect(transaction.type).toBe('Spending');
        expect(transaction.tags.length).toBe(1);
        expect(transaction.tags[0]).toEqual(tagId);
    });

    test('should not add a transaction with an invalid user ID', async () => {
        await expect(addTransaction(new mongoose.Types.ObjectId().toString(), 'Test', '2025-05-10', 50, 'CAD', 'Spending'))
            .rejects.toThrow('User does not exist');
    });

    test('should retrieve all transactions for a user', async () => {
        await addTransaction(userId.toString(), 'Rent', '2025-06-01', 1200, 'CAD', 'Saving');
        await addTransaction(userId.toString(), 'Internet Bill', '2025-06-05', 60, 'CAD', 'Spending');

        const transactions = await getAllTransactions(userId.toString());
        expect(transactions.length).toBe(2);
    });

    test('should edit a transaction', async () => {
        const transaction = await addTransaction(userId.toString(), 'Gym Membership', '2025-07-01', 30, 'CAD', 'Spending');
        const updatedTransaction = await editTransaction(transaction._id, 'Updated Gym', undefined, 40, 'USD');

        expect(updatedTransaction).not.toBeNull();
        expect(updatedTransaction?.name).toBe('Updated Gym');
        expect(updatedTransaction?.amount).toBe(40);
        expect(updatedTransaction?.currency).toBe('USD');
    });

    test('should delete a transaction', async () => {
        const transaction = await addTransaction(userId.toString(), 'Coffee', '2025-06-15', 5, 'CAD', 'Spending');
        await deleteTransaction(transaction._id);

        const transactions = await getAllTransactions(userId.toString());
        expect(transactions.length).toBe(0);
    });
});
