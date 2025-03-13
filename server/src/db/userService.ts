import User, {IUser} from './userDB'; // Import the User model
import mongoose from 'mongoose';
import { dbLog } from '../middleware/loggers';

// Function to add a new user
export const addUser = async (username: string, password: string, balance: number): Promise<IUser> => {
    try {

        if (balance === undefined) {
            throw new Error('Balance is required');
        }

        const newUser = new User({ username, password, balance });
        await newUser.save();
        return newUser;
    } 
    catch (err) {
        //duplicate key error mongoDB
        if (err.code === 11000) {
            console.error('Duplicate username:', err.message);
            throw new Error('Username already exists');
        }
        console.error('Error adding user:', err);
        throw err;
    }
};

export const getAllUsers = async () => {
    try {
        const users = await User.find({}); // Fetch all users
        return users;
    } 
    catch (err) {
        console.error('Error retrieving users:', err);
        throw err;
    }
};

export const getUsersByUsername = async (username: string) => {
    try {
        const users = await User.find({ username });
        if (users.length === 0) {
            dbLog('no users found with username:', username);
        }
        return users;
    }
    catch (err) {
        console.error('Error retrieving users:', err);
        throw err;
    }
}



// Function to edit a user
export const editUser = async (id: string, username?: string, password?: string, balance?: number): Promise<IUser | null> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid user ID format');
        }

        const updatedFields: Partial<IUser> = {};
        
        //Ensures only username and password are updated, not some other field
        if (username) updatedFields.username = username;
        if (password) updatedFields.password = password;
        if (balance) updatedFields.balance = balance;

        const updatedUser = await User.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!updatedUser) {
            dbLog(`No user with the ID ${id} found.`);
            return null;
        }

        return updatedUser;
    } 
    catch (err) {
        //duplicate key error mongoDB
        if (err.code === 11000) {
            console.error('Duplicate username:', err.message);
            throw new Error('Username already exists');
        }
        console.error('Error updating user:', err);
        throw err;
    }
};

export const deleteUser = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid user ID');
        }
        const result = await User.deleteOne({_id: id});
        if (result.deletedCount > 0) {
            dbLog(`User ${id} deleted successfully.`);
        } else {
            dbLog(`User ${id} not found.`);
        }
        return result;
    } 
    catch (err) {
        console.error('Error deleting user:', err);
        throw err;
    }
};
