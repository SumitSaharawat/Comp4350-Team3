/*
 * POST Allow user to login with username and password, return a token for future interaction after login.
 */
import express from 'express';
import { loginController, createAccountController, resetPasswordController } from '../controller/loginController.js';

const router = express.Router();

router.post('/', loginController);
router.post('/signup', createAccountController);
router.post('/reset-password', resetPasswordController);

export default router;


