
import { Request, Response } from 'express';

export const getTransactions=(req: Request, res: Response) => {
    const data = {transactions: [{"id": 1, "date": new Date(), "amount": 30, "currency": "CAD"}, {"id": 2, "date": new Date(), "amount": 25, "currency": "CAD"}, {"id": 3, "date": new Date(), "amount": 35, "currency": "CAD"}]};
    res.json(data);
};
