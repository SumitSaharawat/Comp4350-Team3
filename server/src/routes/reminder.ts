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
// http://localhost:8000/api/reminder/userId
router.get('/:userId', authenticateToken, validateParams('userId'), getAllRemindersController);
//example body：
//{
//    "user": "67c27af37862793900fc11b9", 
//    "name": "Meeting Reminder", 
//    "text": "You have a meeting at 3 PM", 
//    "time": "2025-03-10T15:00:00Z"
//  }
router.post('/', authenticateToken, validateReminderRequest, addReminderController);

// http://localhost:8000/api/reminder/reminderId
router.put('/:id', authenticateToken, validateReminderRequest, validateParams('id'), editReminderController);
// http://localhost:8000/api/reminder/reminderId
router.delete('/:id', authenticateToken, validateReminderRequest, validateParams('id'), deleteReminderController);

export default router;
