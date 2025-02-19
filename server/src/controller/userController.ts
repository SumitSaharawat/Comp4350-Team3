import e, { Request, Response } from 'express';
import { addUser, getAllUsers, editUser, deleteUser } from '../db/userService.js'; 

export const addUserController = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await addUser(username, password);
        res.status(201).json({ message: 'User created successfully', user });
    } 
    catch (err) {
        res.status(500).json({ error: 'Error creating user' });
    }
};


export const getAllUsersController = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.status(200).json({ users });
    } 
    catch (err) {
        res.status(500).json({ error: 'Error retrieving users' });
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
        res.status(500).json({ error: 'Error updating user' });
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
        res.status(500).json({ error: 'Error deleting user' });
    }
};

