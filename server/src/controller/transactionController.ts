import { Request, Response } from 'express';
import { addTransaction, deleteTransaction, editTransaction, getAllTransactions } from '../db/transactionService.js';

export const addTransactionController = async (req: Request, res: Response) => {
    const { userId, date, amount, currency, tag }= req.body;

    try {
        const transaction = await addTransaction(userId, date, amount, currency, tag);
        res.status(201).json({ message: 'Transaction added successfully', transaction });
    } 
    catch (err) {
        console.error('Error creating transaction:', err.message || err); // Log to terminal
        return res.status(500).json({ error: err.message || 'Error creating transaction' }); 
    }
};

export const getAllTransactionController = async (req: Request, res: Response) => {
    const { userId } = req.params;
    console.log(`Fetching transactions for user: ${userId}`);

    try {
        const transactions = await getAllTransactions(userId);
        res.status(200).json(transactions);
    } 
    catch (err) {
        console.error('Error retrieving transaction:', err.message || err); // Log to terminal
        return res.status(500).json({ error: err.message || 'Error retrieving transaction' }); 
    }
};

export const editTransactionController = async(req: Request, res: Response) => {
    const { id } = req.params;
    const { date, amount, currency, tag } = req.body;

    try {
        const updatedTransaction = await editTransaction(id, date, amount, currency, tag);

        if (updatedTransaction) {
            res.status(200).json({ message: 'Transaction updated successfully', transaction: updatedTransaction });
        } 
        else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } 
    catch (err) {
        console.error('Error updating transaction:', err.message || err); // Log to terminal
        return res.status(500).json({ error: err.message || 'Error updating transaction' }); 
    }
};

export const deleteTransactionController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await deleteTransaction(id);
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Transaction deleted successfully' });
        } 
        else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } 
    catch (err) {
        console.error('Error deleting transaction:', err.message || err); // Log to terminal
        return res.status(500).json({ error: err.message || 'Error deleting transaction' });
        
    }
};

