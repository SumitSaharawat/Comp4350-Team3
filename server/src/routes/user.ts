/*
 * GET user profile page.
 */
import express from 'express';
import{ addUserController, getAllUsersController, editUserController, deleteUserController } from '../controller/userController.js'
import { authenticateToken } from '../middleware/authenticator.js';
import { validateUserRequest, validateParams } from '../middleware/dbValidation.js';

const router = express.Router();

//http://localhost:portNum/api/user

router.get('/', validateUserRequest, getAllUsersController);

// example body for post: 
// { 'username': 'someUser', 'password': 'somePass'}

router.post('/', validateUserRequest, addUserController);

//http://localhost:portNum/api/user/someID
// example body for put:
// { 'username': 'someUser', 'password': 'somePass'}
router.put('/:id', validateUserRequest, validateParams("id"), editUserController);

// example for delete:
//http://localhost:portNum/api/user/someID
router.delete('/:id', validateUserRequest, validateParams("id"), deleteUserController);

export default router;