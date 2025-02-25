import e, { Request, Response } from 'express';
import { addUser, getAllUsers, editUser, deleteUser } from '../db/userService';

export const addUserController = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await addUser(username, password);
        res.status(201).json({ message: 'User created successfully', user });
    } 
    catch (err) {
        console.error('Error creating user:', err.message || err); // Log to terminal
        return res.status(500).json({ error: err.message || 'Error creating user' });
    }
};


export const getAllUsersController = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.status(200).json({ users });
    } 
    catch (err) {
        console.error('Error retrieving user:', err.message || err); // Log to terminal
        return res.status(500).json({ error: err.message || 'Error retrieving user' });
    }
};


export const editUserController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, password } = req.body;

    try {
        const updatedUser = await editUser(id, username, password);
        if (updatedUser) {
            res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        } 
        else {
            res.status(404).json({ message: 'User not found' });
        }
    } 
    catch (err) {
        console.error('Error updating user:', err.message || err); // Log to terminal
        return res.status(500).json({ error: err.message || 'Error updating user' });
    }
};


export const deleteUserController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await deleteUser(id);
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'User deleted successfully' });
        } 
        else {
            res.status(404).json({ message: 'User not found' });
        }
    } 
    catch (err) {
        console.error('Error deleting user:', err.message || err); // Log to terminal
        return res.status(500).json({ error: err.message || 'Error deleting user' });
    }
};

