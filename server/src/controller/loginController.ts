/**
 * The logic to login a user with username and password
 */
import { Request, Response } from 'express';
import webToken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface AuthError extends Error {
    status?: number;
}

// stub database
export const users = [{ id: 1, username: 'user', password: bcrypt.hashSync('password', 10) }];
// stay in the code for now, need to move it to environment variables later
export const LOGIN_KEY = "I_AM_KEY";

// logic to verify if the password is correct
export const loginController = (req: Request, res: Response, next) => {
    const {username, password} = req.body;
    const userFound = users.find(user => user.username === username);

    // if the password is correct, return with a valid token for future use
    if (userFound && bcrypt.compareSync(password, userFound.password)) {
        const token = webToken.sign({ id: userFound.id, username: userFound.username }, LOGIN_KEY, { expiresIn: '1h' });
        res.cookie("token", token, {
            httpOnly: true,
            secure:false,
            maxAge: 3600000,        // 1 hour
        }).json({ message: "Login successful" });
    } 
    // if the password is wrong, throw out the error for error handler
    else {
        const error:AuthError = new Error(`Invalid credentials`);
        error.status = 401;
        next(error);
    }
}

// logic to create account
export const createAccountController = (req: Request, res: Response) => {
    const {username, password} = req.body;
    const userFound = users.find(user => user.username === username);

    // if the username already exists, reject the account creation
    if (userFound) {
        res.status(403).json({message: "username already exists."});
    }
    // otherwise, create the account and return a successful message
    // will be replaced by mongodb integration once its set up 
    else {
        const account = { id: users.length, username: username, password: bcrypt.hashSync(password, 10)};
        users[users.length] = account;
        res.status(200).json({message: "Account created successfully!"});
    }
}

// logic to reset password
export const resetPasswordController = (req: Request, res: Response, next) => {
    const {username, newPassword } = req.body;
    const userFound = users.find(user => user.username === username);

    // if the old password is correct, reset the password in the database
    if (userFound) {
        userFound.password = bcrypt.hashSync(newPassword, 10);
        res.status(200).json({ message: "Password changed successfully!" });
    } 
    // if the password is wrong, throw out the error for error handler
    else {
        const error:AuthError = new Error(`User not found.`);
        error.status = 401;
        next(error);
    }
}