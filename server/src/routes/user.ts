/*
 * GET user profile page.
 */
import express from 'express';
import{ addUserController, getAllUsersController, editUserController, deleteUserController } from '../controller/userController.js'
import { authenticateToken } from '../middleware/authenticator.js';

const router = express.Router();

//http://localhost:portNum/api/user

router.get('/', authenticateToken, getAllUsersController);

// example body for post: 
// { 'username': 'someUser', 'password': 'somePass'}

router.post('/', authenticateToken, addUserController);

//http://localhost:portNum/api/user/someID
// example body for put:
// { 'username': 'someUser', 'password': 'somePass'}
router.put('/:id', authenticateToken, editUserController);

// example for delete:
//http://localhost:portNum/api/user/someID
router.delete('/:id', authenticateToken, deleteUserController);

export default router;