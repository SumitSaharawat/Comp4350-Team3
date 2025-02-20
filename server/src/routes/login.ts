/*
 * POST Allow user to login with username and password, return a token for future interaction after login.
 */


//Some of the early entries in the database that were created without the hashing may not work for login (because not encoded properly)
import express from 'express';
import { loginController, createAccountController, resetPasswordController } from '../controller/loginController.js';
import { validateUserRequest } from '../middleware/dbValidation.js';


const router = express.Router();

router.post('/', validateUserRequest, loginController);
router.post('/signup', validateUserRequest, createAccountController);
router.put('/reset-password', validateUserRequest, resetPasswordController);

export default router;


