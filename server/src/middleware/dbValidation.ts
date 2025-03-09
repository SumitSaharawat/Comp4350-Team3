import { Request, Response, NextFunction } from 'express';
import { getUsersByUsername } from '../db/userService.js';
import mongoose from 'mongoose';

export const validateTransactionRequest = (req: Request, res: Response, next: NextFunction) => {
    const allowedFields = ['userId', 'name', 'date', 'amount', 'currency', 'tags'];
    const bodyKeys = Object.keys(req.body);

    // Find unexpected fields
    const unexpectedFields = bodyKeys.filter(key => !allowedFields.includes(key));

    if (unexpectedFields.length > 0) {
        return res.status(400).json({ 
            error: `Unexpected field(s): ${unexpectedFields.join(', ')}` 
        });
    }

    next(); 
};

export const validateParams = (paramName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const id = req.params[paramName];
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: `Invalid ${paramName} format` });
        }
        
        next(); 
    };
};


export const validateUserRequest = (req: Request, res: Response, next: NextFunction) => {
    const allowedFields = ['id', 'username', 'password', 'newPassword'];
    const bodyKeys = Object.keys(req.body);

    // Find unexpected fields
    const unexpectedFields = bodyKeys.filter(key => !allowedFields.includes(key));

    if (unexpectedFields.length > 0) {
        return res.status(400).json({ 
            error: `Unexpected field(s): ${unexpectedFields.join(', ')}` 
        });
    }

    next(); 
};

export const validateParamsUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;

    try {
        // Check if the user exists in the database
        const users = await getUsersByUsername(username);

        if (users.length === 0) {
            return res.status(404).json({
                error: `User with username "${username}" not found.`,
            });
        }

        // If user exists, proceed to the next middleware/controller
        next();
    } catch (err) {
        console.error('Error checking username in database:', err);
        return res.status(500).json({ error: 'Error checking username in database' });
    }
};

export const validateTagRequest = (req: Request, res: Response, next: NextFunction) => {
    const allowedFields = ['id', 'name', 'color'];
    const bodyKeys = Object.keys(req.body);

    // Find unexpected fields
    const unexpectedFields = bodyKeys.filter(key => !allowedFields.includes(key));

    if (unexpectedFields.length > 0) {
        return res.status(400).json({ 
            error: `Unexpected field(s): ${unexpectedFields.join(', ')}` 
        });
    }

    next(); 
};


export const validateGoalRequest = (req: Request, res: Response, next: NextFunction) => {
    const allowedFields = ['userId', 'name', 'time', 'currAmount', 'goalAmount', 'category'];
    const bodyKeys = Object.keys(req.body);

    // Find unexpected fields
    const unexpectedFields = bodyKeys.filter(key => !allowedFields.includes(key));

    if (unexpectedFields.length > 0) {
        return res.status(400).json({ 
            error: `Unexpected field(s): ${unexpectedFields.join(', ')}` 
        });
    }

    // Validate category field (must be one of the predefined options)
    if (req.body.category) {
        const validCategories = ['Saving', 'Investment', 'Debt Payment', 'Other'];
        if (!validCategories.includes(req.body.category)) {
            return res.status(400).json({
                error: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
            });
        }
    }

    next();
};

export const validateReminderRequest = (req: Request, res: Response, next: NextFunction) => {
    const allowedFields = ['name', 'text', 'time', 'user'];
    const bodyKeys = Object.keys(req.body);

    const unexpectedFields = bodyKeys.filter(key => !allowedFields.includes(key));

    if (unexpectedFields.length > 0) {
        return res.status(400).json({ 
            error: `Unexpected field(s): ${unexpectedFields.join(', ')}` 
        });
    }

    if (!req.body.name || typeof req.body.name !== 'string') {
        return res.status(400).json({ error: '`name` is required and must be a string.' });
    }

    if (!req.body.text || typeof req.body.text !== 'string') {
        return res.status(400).json({ error: '`text` is required and must be a string.' });
    }

    if (!req.body.time || isNaN(Date.parse(req.body.time))) {
        return res.status(400).json({ error: '`time` is required and must be a valid date format (ISO 8601).' });
    }

    if (!req.body.user || !mongoose.Types.ObjectId.isValid(req.body.user)) {
        return res.status(400).json({ error: '`user` is required and must be a valid ObjectId.' });
    }

    next();
};