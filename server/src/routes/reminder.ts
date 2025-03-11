import express from 'express';
import { 
    addReminderController, 
    getAllRemindersController, 
    editReminderController, 
    deleteReminderController 
} from '../controller/reminderController';
import { authenticateToken } from '../middleware/authenticator';
import { validateReminderRequest, validateParams } from '../middleware/dbValidation';

const router = express.Router();

router.get('/:userId', authenticateToken, validateParams('userId'), getAllRemindersController);
router.post('/', authenticateToken, validateReminderRequest, addReminderController);
router.put('/:id', authenticateToken, validateReminderRequest, validateParams('id'), editReminderController);
router.delete('/:id', authenticateToken, validateReminderRequest, validateParams('id'), deleteReminderController);

export default router;
