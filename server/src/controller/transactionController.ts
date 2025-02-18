import { Request, Response } from 'express';
import { addTransaction, deleteTransaction, editTransaction, getAllTransactions } from '../db/transactionService.js';

export const addTransactionController = async (req: Request, res: Response) => {
    const { userId, date, amount, currency, tag }= req.body;

    try {
        const transaction = await addTransaction(userId, date, amount, currency, tag);
        res.status(201).json({ message: 'Transaction added successfully', transaction });
    } 
    catch (err) {
        res.status(500).json({ error: 'Error creating transaction' });
    }
};

export const getAllTransactionController = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const transactions = await getAllTransactions(userId);
        res.status(200).json(transactions);
    } 
    catch (err) {
        res.status(500).json({ error: 'Error retrieving transactions' });
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
        res.status(500).json({ error: 'Error updating transaction' });
    }
};

export const deleteTransactionController = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
        const result = await deleteTransaction(id);
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'User deleted successfully' });
        } 
        else {
            res.status(404).json({ message: 'User not found' });
        }
    } 
    catch (err) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};

