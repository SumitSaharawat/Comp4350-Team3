import Reminder, { IReminder } from './reminderDB';
import User from './userDB';
import mongoose from 'mongoose';

export const addReminder = async (userId: string, name: string, text: string, time: string) => {
    try {
        const userExists = await User.findById(userId);
        if (!userExists) {
            throw new Error('User does not exist');
        }

        const newReminder = new Reminder({
            userId: userId,
            name,
            text,
            time: new Date(time),
        });

        await newReminder.save();
        return newReminder;
    } catch (err) {
        if (err.name === 'ValidationError') {
            throw new Error(`Validation Error: ${Object.values(err.errors).map(e => (e as mongoose.Error.ValidationError).message).join(', ')}`);
        }
        console.error('Error adding reminder:', err);
        throw err;
    }
};

export const getAllReminders = async (userId: string): Promise<IReminder[]> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID format');
        }

        const reminders = await Reminder.find({ userId: userId }).populate('userId');
        return reminders;
    } catch (err) {
        console.error('Error retrieving reminders:', err);
        throw err;
    }
};

export const editReminder = async (id: string, name?: string, text?: string, time?: string): Promise<IReminder | null> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid reminder ID format');
        }

        const updatedReminder = await Reminder.findById(id);
        if (!updatedReminder) {
            console.log('No reminder found with the given ID.');
            return null;
        }

        if (name) updatedReminder.name = name;
        if (text) updatedReminder.text = text;
        if (time) updatedReminder.time = new Date(time);

        await updatedReminder.save();
        return updatedReminder;
    } catch (err) {
        console.error('Error updating reminder:', err);
        throw err;
    }
};

export const deleteReminder = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid reminder ID format');
        }

        const result = await Reminder.deleteOne({ _id: id });
        if (result.deletedCount > 0) {
            console.log('Reminder deleted successfully.');
        } else {
            console.log('No reminder found.');
        }
        return result;
    } catch (err) {
        console.error('Error deleting reminder:', err);
        throw err;
    }
};
