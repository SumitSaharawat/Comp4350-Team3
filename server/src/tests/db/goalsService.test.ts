import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Goal from '../../db/goalsDB';
import User from '../../db/userDB';
import { addGoal, getAllGoals, editGoal, deleteGoal } from '../../db/goalsService';
import { addUser } from '../../db/userService';

describe('Goals Service Tests', () => {
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
        await Goal.deleteMany({});
        await User.deleteMany({});
        const user = await addUser('goalUser', 'password123', 500);
        userId = user._id.toString();
    });

    test('should add a goal', async () => {
        const goal = await addGoal(userId, 'Save for Laptop', '2025-12-31', 200, 1000, 'Saving');
        expect(goal.name).toBe('Save for Laptop');
        expect(goal.goalAmount).toBe(1000);
    });

    test('should not add a goal with an invalid category', async () => {
        await expect(addGoal(userId, 'Invalid Goal', '2025-12-31', 100, 500, 'InvalidCategory'))
            .rejects.toThrow('Invalid category. Must be one of: Saving, Investment, Debt Payment, Other');
    });

    test('should retrieve all goals for a user', async () => {
        await addGoal(userId, 'Goal1', '2025-12-31', 200, 1000, 'Saving');
        await addGoal(userId, 'Goal2', '2026-06-30', 500, 1500, 'Investment');
        const goals = await getAllGoals(userId);
        expect(goals.length).toBe(2);
    });

    test('should edit a goal', async () => {
        const goal = await addGoal(userId, 'Edit Goal', '2025-12-31', 300, 800, 'Saving');
        const updatedGoal = await editGoal(goal._id.toString(), 'Updated Goal', undefined, 400, 1200);
        expect(updatedGoal).not.toBeNull();
        expect(updatedGoal?.name).toBe('Updated Goal');
        expect(updatedGoal?.goalAmount).toBe(1200);
    });

    test('should delete a goal', async () => {
        const goal = await addGoal(userId, 'Delete Goal', '2025-12-31', 100, 500, 'Saving');
        await deleteGoal(goal._id.toString());
        const goals = await getAllGoals(userId);
        expect(goals.length).toBe(0);
    });
});