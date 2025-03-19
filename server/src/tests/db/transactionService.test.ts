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
    let invalidTagId: mongoose.Types.ObjectId;

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

        // Creating an invalid tag ID for testing
        invalidTagId = new mongoose.Types.ObjectId();
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

    test('should not add a transaction with an invalid tag ID', async () => {
        await expect(addTransaction(userId.toString(), 'Test', '2025-05-10', 50, 'CAD', 'Spending', [invalidTagId.toString()]))
            .rejects.toThrow('One or more tags do not exist.');
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

    // Testing balance insufficient for spending transactions
    test('should not add a spending transaction if balance is insufficient', async () => {
        const user = await User.findById(userId);
        if (user) {
            user.balance = 30; // set balance to a lower amount
            await user.save();
        }

        await expect(addTransaction(userId.toString(), 'Grocery Shopping', '2025-05-10', 50, 'CAD', 'Spending', [tagId.toString()]))
            .rejects.toThrow('Insufficient balance for spending.');
    });

    // Testing balance update when editing a transaction (spending)
    test('should adjust balance correctly when editing a spending transaction', async () => {
        const transaction = await addTransaction(userId.toString(), 'Gym Membership', '2025-07-01', 30, 'CAD', 'Spending');
        
        // Update the transaction amount to a higher value
        const updatedTransaction = await editTransaction(transaction._id, 'Updated Gym', undefined, 40, 'USD');
        
        const user = await User.findById(userId);
        if (user) {
            expect(user.balance).toBe(500 - 40); // Initial balance was 500, now deduct the new amount
        }
    });

    // Testing tag update in editTransaction
    test('should update tags when editing a transaction', async () => {
        const transaction = await addTransaction(userId.toString(), 'Gym Membership', '2025-07-01', 30, 'CAD', 'Spending', [tagId.toString()]);
        
        const newTag = new Tag({ name: 'Workout', color: '#FF5733' });
        await newTag.save();
        
        const updatedTransaction = await editTransaction(transaction._id, undefined, undefined, undefined, undefined, undefined, [newTag._id.toString()]);

        expect(updatedTransaction?.tags.length).toBe(1);
        expect(updatedTransaction?.tags[0]._id.toString()).toBe(newTag._id.toString());
    });

    // Testing invalid transaction ID during edit
    test('should throw error when editing a transaction with an invalid ID', async () => {
        await expect(editTransaction("invalid ID", 'Updated Name'))
            .rejects.toThrow('Invalid transaction ID format');
    });

    // Testing invalid user ID during delete
    test('should throw error when deleting a transaction with an invalid ID', async () => {
        await expect(deleteTransaction("invalid ID"))
            .rejects.toThrow('Invalid transaction ID format');
    });

    // Testing invalid transaction ID during delete
    test('should throw error when deleting a non-existent transaction', async () => {
        await expect(deleteTransaction(new mongoose.Types.ObjectId().toString()))
            .rejects.toThrow('No transaction found with ID');
    });

    // Testing invalid tag ID format in editTransaction
    test('should throw error when editing transaction with invalid tag ID format', async () => {
        const transaction = await addTransaction(userId.toString(), 'Gym Membership', '2025-07-01', 30, 'CAD', 'Spending');
        await expect(editTransaction(transaction._id, undefined, undefined, undefined, undefined, undefined, ['invalidTagID']))
            .rejects.toThrow('One or more tags do not exist.');
    });

    // Testing invalid type in addTransaction
    test('should throw error for invalid transaction type', async () => {
        await expect(addTransaction(userId.toString(), 'Test', '2025-05-10', 50, 'CAD', 'InvalidType'))
            .rejects.toThrow('Invalid type. Must be one of: Saving, Spending');
    });

    // Testing invalid type in editTransaction
    test('should throw error for invalid type in editTransaction', async () => {
        const transaction = await addTransaction(userId.toString(), 'Test', '2025-05-10', 50, 'CAD', 'Spending');
        await expect(editTransaction(transaction._id, undefined, undefined, undefined, undefined, 'InvalidType'))
            .rejects.toThrow('Invalid type. Must be one of: Saving, Spending');
    });
});
