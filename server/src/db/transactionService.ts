import Transaction, { ITransaction, ITag } from './transactionDB.js';
import User from './userDB.js'
import mongoose from 'mongoose';

export const addTransaction = async (userId: string, date: string, amount: number, currency: string, tag: ITag) => {
    try {
        console.log("Received transaction data:", { userId, date, amount, currency, tag });

        // 🔹 Validate if user exists before proceeding
        const userExists = await User.findById(userId);
        if (!userExists) {
            throw new Error('User does not exist');
        }

        const newTransaction = new Transaction({
            user: userId,
            date: new Date(date), 
            amount,
            currency,
            tag
        });

        await newTransaction.save();
        console.log('Transaction added successfully:', newTransaction);
        return newTransaction;
    } catch (err) {
        console.error('Error adding transaction:', err);
        throw err;
    }
};

// Function to get all transactions
export const getAllTransactions = async (userId: string): Promise<ITransaction[]> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID format');
        }

        const transactions = await Transaction.find({user: userId}).populate('user');
        console.log('Transactions retrieved for user ${userId}:', transactions);
        return transactions;
    } catch (err) {
        console.error('Error retrieving transactions:', err);
        throw err;
    }
};

export const editTransaction = async (id: string, date?: string, amount?: number, currency?: string, tag?: ITag): Promise<ITransaction | null> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid transaction ID format');
        }

        const updatedFields: Partial<ITransaction> = {};

        if (date) updatedFields.date = new Date(date); 
        if (amount) updatedFields.amount = amount;
        if (currency) updatedFields.currency = currency;
        if (tag) updatedFields.tag = tag;

        const updatedTransaction = await Transaction.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!updatedTransaction) {
            console.log('No transaction found with the given ID.');
            return null;
        }

        console.log('Transaction updated successfully:', updatedTransaction);
        return updatedTransaction;
    } catch (err) {
        console.error('Error updating transaction:', err);
        throw err;
    }
};



// Delete by entering just the id in the body
export const deleteTransaction = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid user ID format');
        }
        const result = await Transaction.deleteOne({_id: id});
        if (result.deletedCount > 0) {
            console.log('User deleted successfully.');
        } else {
            console.log('No user found with the given username.');
        }
        return result;
    } catch (err) {
        console.error('Error deleting user:', err);
        throw err;
    }
};

