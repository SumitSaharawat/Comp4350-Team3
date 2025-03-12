import Goal, { IGoal } from './goalsDB';
import User from './userDB';
import mongoose from 'mongoose';
import { dbLog } from '../middleware/loggers';

export const addGoal = async (userId: string, name: string, time: string, currAmount: number, goalAmount: number, category: string) => {
    try {
        const userExists = await User.findById(userId);
        if (!userExists) {
            throw new Error('User does not exist');
        }

        if (category) {
            const validCategories = ['Saving', 'Investment', 'Debt Payment', 'Other'];
            if (!validCategories.includes(category)) {
                throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
            }
        }

        const newGoal = new Goal({
            user: userId,
            name,
            time: new Date(time),
            currAmount,
            goalAmount,
            category
        });

        await newGoal.save();
        return newGoal;
    } catch (err) {
        if (err.name === 'ValidationError') {
            throw new Error(`Validation Error: ${Object.values(err.errors).map(e => (e as mongoose.Error.ValidationError).message).join(', ')}`);
        }
        console.error('Error adding goal:', err);
        throw err;
    }
};

export const getAllGoals = async (userId: string): Promise<IGoal[]> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID format');
        }

        const goals = await Goal.find({ user: userId }).populate('user');
        console.log(goals);
        return goals;
    } catch (err) {
        console.error('Error retrieving goals:', err);
        throw err;
    }
};

export const editGoal = async (id: string, name?: string, time?: string, currAmount?: number, goalAmount?: number, category?: string): Promise<IGoal | null> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid goal ID format');
        }
        
        const updatedGoal = await Goal.findById(id);
        if (!updatedGoal) {
            dbLog('No goal found with the given ID.');
            return null;
        }
        const numCurrAmount = parseFloat(currAmount as unknown as string);
        const numGoalAmount = parseFloat(goalAmount as unknown as string);

        if (numCurrAmount > numGoalAmount) {
            currAmount = goalAmount;
        }

        if (time) updatedGoal.time = new Date(time);
        if (name) updatedGoal.name = name;
        if (currAmount) updatedGoal.currAmount = currAmount;
        if (goalAmount) updatedGoal.goalAmount = goalAmount;
        if (category) {
            const validCategories = ['Saving', 'Investment', 'Debt Payment', 'Other'];
            if (!validCategories.includes(category)) {
                throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
            }
            updatedGoal.category = category;
        }

        await updatedGoal.save();
        return updatedGoal;
    } catch (err) {
        console.error('Error updating goal:', err);
        throw err;
    }
};

export const deleteGoal = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid goal ID format');
        }
        
        const result = await Goal.deleteOne({ _id: id });
        if (result.deletedCount > 0) {
            dbLog('Goal deleted successfully.');
        } else {
            dbLog('No goal found.');
        }
        return result;
    } catch (err) {
        console.error('Error deleting goal:', err);
        throw err;
    }
};
