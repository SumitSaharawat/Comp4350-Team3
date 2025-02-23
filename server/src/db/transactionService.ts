import Transaction, { ITransaction, ITag } from './transactionDB.js';
import User from './userDB.js'
import mongoose from 'mongoose';

export const addTransaction = async (userId: string, date: string, amount: number, currency: string, tag: ITag) => {
    try {

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
        return newTransaction;
    } catch (err) {
        if (err.name === 'ValidationError') {
            throw new Error(`Validation Error: ${Object.values(err.errors).map(e => (e as any).message).join(', ')}`);
        }
        console.error('Error adding transaction:', err);
        throw err;
    }
};

// get all transactions for a user
export const getAllTransactions = async (userId: string): Promise<ITransaction[]> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID format');
        }

        const transactions = await Transaction.find({user: userId}).populate('user');
        return transactions;
    } catch (err) {
        if (err.name === 'ValidationError') {
            throw new Error(`Validation Error: ${Object.values(err.errors).map(e => (e as any).message).join(', ')}`);
        }
        console.error('Error retrieving transactions:', err);
        throw err;
    }
};

//To edit, need to enter in the body, all the fields again, even ones that you didn't intend to replace. If you don't enter tag, it deletes it and sets it to default.
export const editTransaction = async (id: string, date?: string, amount?: number, currency?: string, tag?: ITag): Promise<ITransaction | null> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid transaction ID format');
        }
        const updatedTransaction = await Transaction.findById(id);

        if (!updatedTransaction) {
            console.log('No transaction found with the given ID.');
            return null;
        }

        // const updatedFields: Partial<ITransaction> = {};

        if (date) updatedTransaction.date = new Date(date); 
        if (amount) updatedTransaction.amount = amount;
        if (currency) updatedTransaction.currency = currency;
        if (tag) 
            updatedTransaction.tag = tag;
        else {
            updatedTransaction.tag = {name: "null", color: "#000000"};
        }

      //  const updatedTransaction = await Transaction.findByIdAndUpdate(id, updatedFields, { new: true });



        await updatedTransaction.save();

        return updatedTransaction;
    } 
    catch (err) {
        if (err.name === 'ValidationError') {
            const errorMessages = Object.values(err.errors).map((e: any) => e.message).join(', ');
            console.error('Validation failed:', errorMessages);
            throw new Error(`Validation Error: ${errorMessages}`);
        }
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
        if (err.name === 'ValidationError') {
            throw new Error(`Validation Error: ${Object.values(err.errors).map(e => (e as any).message).join(', ')}`);
        }
        console.error('Error deleting user:', err);
        throw err;
    }
};

