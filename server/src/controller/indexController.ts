import { Request, Response } from 'express';

export const getIndex=(req: Request, res: Response) => {
    console.log(`body: ${req.body}`);
    res.json({ test: "This is a test" });
};

export const postIndex=(req: Request, res: Response) => {
    res.json({ test: "This is a test" });
};