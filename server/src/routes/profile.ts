/*
 * GET user profile page.
 */
import express from 'express';
import{ getProfile } from '../controller/profileController.js'
import { authenticateToken } from '../middleware/authenticator.js';

const router = express.Router();

// just a test message for now
router.get('/', authenticateToken, getProfile);

export default router;