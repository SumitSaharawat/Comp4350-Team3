/*
 * GET user profile page.
 */
import express from 'express';
import{ getProfile } from '../controller/profileController.js'

const router = express.Router();

// just a test message for now
router.get('/', getProfile);

export default router;