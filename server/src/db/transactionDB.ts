import mongoose, { Document } from 'mongoose';
const Schema = mongoose.Schema;

export interface ITag {
    name: string;
    color: string; //hex code
}

export interface ITransaction extends Document {
    date: Date;
    amount: number;
    currency: string;
    tag: ITag
}

const tagSchema = new Schema<ITag>({
    name: {type: String, required: true},
    color: {type: String, required: true, match: /^#([0-9A-Fa-f]{6})$/}
});


// Define the schema for the transaction
const transactionSchema = new Schema<ITransaction>({
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    tag: { type: tagSchema, required: true }, 
});

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction;


// The controller class for transactions that I used to test on postman

// import express from 'express';
// import { addTransaction, deleteTransaction, editTransaction, getAllTransactions } from './transactionService';

// const router = express.Router();

// // Route to create a transaction
// router.post('/addTransaction', async (req, res) => {
//     const { date, amount, currency, tag }= req.body;

//     try {
//         const transaction = await addTransaction(date, amount, currency, tag);
//         res.status(201).json({ message: 'Transaction added successfully', transaction });
//     } catch (err) {
//         res.status(500).json({ error: 'Error creating transaction' });
//     }
// });

// // Route to get all transactions
// router.get('/getAllTransactions', async (req, res) => {
//     try {
//         const transactions = await getAllTransactions();
//         res.status(200).json(transactions);
//     } catch (err) {
//         res.status(500).json({ error: 'Error retrieving transactions' });
//     }
// });

// router.put('/editTransaction', async (req, res) => {
//     const { id, date, amount, currency, tag } = req.body;

//     try {
//         // Call the editTransaction function with the provided data
//         const updatedTransaction = await editTransaction(id, date, amount, currency, tag);

//         // If the transaction is updated successfully, send a success response
//         if (updatedTransaction) {
//             res.status(200).json({ message: 'Transaction updated successfully', transaction: updatedTransaction });
//         } else {
//             // If no transaction is found with the provided ID, send a 404 response
//             res.status(404).json({ message: 'Transaction not found' });
//         }
//     } catch (err) {
//         // If there's an error, send a 500 response with the error message
//         res.status(500).json({ error: 'Error updating transaction' });
//     }
// });

// // Route to delete a user
// // Postman delete with just the body: 
// // {
// //    "id": "someID"
// // }
// router.delete('/deleteTransaction', async (req, res) => {
//     const { id } = req.body;
//     try {
//         const result = await deleteTransaction(id);
//         if (result.deletedCount > 0) {
//             res.status(200).json({ message: 'User deleted successfully' });
//         } else {
//             res.status(404).json({ message: 'User not found' });
//         }
//     } catch (err) {
//         res.status(500).json({ error: 'Error deleting user' });
//     }
// });


// export default router;
