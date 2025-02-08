import { Request, Response } from 'express';

export const getProfile=(req: Request, res: Response) => {
    res.send("responded with a resource");
};