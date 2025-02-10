/*
 * GET user profile page.
 */
import express from 'express';
import{ getUser } from '../controller/userController.js'
import { authenticateToken } from '../middleware/authenticator.js';

const router = express.Router();

// just a test message for now
router.get('/', authenticateToken, getUser);

export default router;