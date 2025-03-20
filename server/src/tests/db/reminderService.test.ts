import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Reminder from '../../db/reminderDB';
import User from '../../db/userDB';
import { addReminder, getAllReminders, editReminder, deleteReminder } from '../../db/reminderService';
import { addUser } from '../../db/userService';

describe('Reminder Service Tests', () => {
    let mongoServer: MongoMemoryServer;
    let userId: string;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Reminder.deleteMany({});
        await User.deleteMany({});
        const user = await addUser('reminderUser', 'password123', 500);
        userId = user._id.toString();
    });

    test('should add a reminder', async () => {
        const reminder = await addReminder(userId, 'Doctor Appointment', 'Visit Dr. Smith at 5 PM', '2025-12-31T17:00:00.000Z');
        expect(reminder.name).toBe('Doctor Appointment');
        expect(reminder.text).toBe('Visit Dr. Smith at 5 PM');
    });

    test('should not add a reminder with an invalid date', async () => {
        await expect(addReminder(userId, 'Invalid Reminder', 'Invalid time test', 'invalid-date'))
            .rejects.toThrow(expect.objectContaining({ message: expect.stringMatching(/Invalid date format|Cast to date failed/) }));
    });

    test('should retrieve all reminders for a user', async () => {
        await addReminder(userId, 'Reminder1', 'Meeting at 10 AM', '2025-12-31T10:00:00.000Z');
        await addReminder(userId, 'Reminder2', 'Dinner at 7 PM', '2025-12-31T19:00:00.000Z');
        const reminders = await getAllReminders(userId);
        expect(reminders.length).toBe(2);
    });

    test('should edit a reminder', async () => {
        const reminder = await addReminder(userId, 'Initial Reminder', 'Some details', '2025-12-31T12:00:00.000Z');
        const updatedReminder = await editReminder(reminder._id.toString(), 'Updated Reminder', undefined, '2025-12-31T15:00:00.000Z');
        expect(updatedReminder).not.toBeNull();
        expect(updatedReminder?.name).toBe('Updated Reminder');
        expect(updatedReminder?.time.toISOString()).toBe('2025-12-31T15:00:00.000Z');
    });

    test('should delete a reminder', async () => {
        const reminder = await addReminder(userId, 'Delete Reminder', 'To be deleted', '2025-12-31T14:00:00.000Z');
        await deleteReminder(reminder._id.toString());
        const reminders = await getAllReminders(userId);
        expect(reminders.length).toBe(0);
    });

    // Edge case 1: Invalid userId when adding reminder
    test('should not add a reminder with an invalid userId', async () => {
        await expect(addReminder(new mongoose.Types.ObjectId().toString(), 'Invalid User', 'Test reminder', '2025-12-31T12:00:00.000Z'))
            .rejects.toThrow('User does not exist');
    });

    // Edge case 2: Editing a non-existent reminder
    test('should not edit a non-existent reminder', async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();
        const result = await editReminder(nonExistentId, 'New Name');
        expect(result).toBeNull();
    });

    // Edge case 3: Deleting a non-existent reminder
    test('should not delete a non-existent reminder', async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();
        const result = await deleteReminder(nonExistentId);
        expect(result.deletedCount).toBe(0);
    });

    // Edge case 4: Editing a reminder without changing anything
    test('should not change reminder if no fields are updated', async () => {
        const reminder = await addReminder(userId, 'Unchanged Reminder', 'No updates', '2025-12-31T08:00:00.000Z');
        const unchangedReminder = await editReminder(reminder._id.toString());
        expect(unchangedReminder).not.toBeNull();
        expect(unchangedReminder?.name).toBe('Unchanged Reminder');
        expect(unchangedReminder?.text).toBe('No updates');
    });

    // Edge case 5: Retrieving reminders with an invalid userId
    test('should not retrieve reminders with an invalid userId', async () => {
        await expect(getAllReminders("Invalid ID"))
            .rejects.toThrow('Invalid user ID format');
    });
});
