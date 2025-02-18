/*
 * GET transactions
 */
import express from 'express';
import { getTransactions } from '../controller/transactionController.js';

const router = express.Router();

router.get('/', getTransactions);

export default router;