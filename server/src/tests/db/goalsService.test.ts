import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import Goal from "../../db/goalsDB";
import User from "../../db/userDB";
import { addGoal, getAllGoals, editGoal, deleteGoal } from "../../db/goalsService";
import { addUser } from "../../db/userService";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe("Goals Service Tests", () => {
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
    const user = await addUser("goalUser", "password123", 500);
    userId = user._id.toString();
  });

  // ✅ Adding Goals
  test("should add a goal successfully", async () => {
    const goal = await addGoal(userId, "Save for Laptop", "2025-12-31", 200, 1000, "Saving");
    expect(goal.name).toBe("Save for Laptop");
    expect(goal.goalAmount).toBe(1000);
  });

  test("should not add a goal with an invalid category", async () => {
    await expect(addGoal(userId, "Invalid Goal", "2025-12-31", 100, 500, "InvalidCategory"))
      .rejects.toThrow("Invalid category. Must be one of: Saving, Investment, Debt Payment, Other");
  });

  test("should not add a goal if user does not exist", async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId().toString();
  
    await expect(
      addGoal(nonExistentUserId, "Non-Existent User Goal", "2025-12-31", 100, 500, "Saving")
    ).rejects.toThrow("User does not exist");
  });

  test("should fail to add a goal if required fields are missing", async () => {
    await expect(
      addGoal(userId, "", "", NaN, NaN, "")
    ).rejects.toThrow();
  });

  test("should not add a goal if date is invalid", async () => {
    await expect(
      addGoal(userId, "Invalid Date Goal", "not-a-date", 100, 500, "Saving")
    ).rejects.toThrow();
  });

  // ✅ Retrieving Goals
  test("should retrieve all goals for a user", async () => {
    await addGoal(userId, "Goal1", "2025-12-31", 200, 1000, "Saving");
    await addGoal(userId, "Goal2", "2026-06-30", 500, 1500, "Investment");
    const goals = await getAllGoals(userId);
    expect(goals.length).toBe(2);
  });

  test("should return empty array if user has no goals", async () => {
    const goals = await getAllGoals(userId);
    expect(goals.length).toBe(0);
  });

  test("should not get goals with invalid user ID format", async () => {
    await expect(getAllGoals("invalid-user-id")).rejects.toThrow("Invalid user ID format");
  });

  // ✅ Editing Goals
  test("should edit a goal successfully", async () => {
    const goal = await addGoal(userId, "Edit Goal", "2025-12-31", 300, 800, "Saving");
    const updatedGoal = await editGoal(goal._id.toString(), "Updated Goal", undefined, 400, 1200);
    expect(updatedGoal).not.toBeNull();
    expect(updatedGoal?.name).toBe("Updated Goal");
    expect(updatedGoal?.goalAmount).toBe(1200);
  });

  test("should not edit a goal with invalid ID format", async () => {
    await expect(editGoal("invalid-id", "New Name")).rejects.toThrow("Invalid goal ID format");
  });

  test("should not edit a non-existent goal", async () => {
    await expect(editGoal(new mongoose.Types.ObjectId().toString(), "New Name")).resolves.toBeNull();
  });

  test("should not edit a goal when currAmount exceeds goalAmount", async () => {
    const goal = await addGoal(userId, "Overflow Goal", "2025-12-31", 100, 500, "Saving");
    const updatedGoal = await editGoal(goal._id.toString(), undefined, undefined, 600, 500);
    expect(updatedGoal?.currAmount).toBe(500);
  });

  test("should not update goal with an invalid category", async () => {
    const goal = await addGoal(userId, "Edit Invalid Category", "2025-12-31", 100, 500, "Saving");
    await expect(editGoal(goal._id.toString(), undefined, undefined, undefined, undefined, "Invalid"))
      .rejects.toThrow("Invalid category. Must be one of: Saving, Investment, Debt Payment, Other");
  });

  test("should not add a goal with an empty name", async () => {
    await expect(addGoal(userId, "", "2025-12-31", 100, 500, "Saving"))
      .rejects.toThrow();
  });

  test("should not update currAmount to be higher than goalAmount", async () => {
    const goal = await addGoal(userId, "Limit Test Goal", "2025-12-31", 200, 500, "Saving");
    
    const updatedGoal = await editGoal(goal._id.toString(), undefined, undefined, 600, 500);
    
    expect(updatedGoal?.currAmount).toBe(500); // currAmount should be adjusted to goalAmount
  });

  test("should update the category of an existing goal", async () => {
    const goal = await addGoal(userId, "Initial Goal", "2025-12-31", 200, 1000, "Saving");
    const updatedGoal = await editGoal(goal._id.toString(), undefined, undefined, undefined, 1200, "Investment");
  
    expect(updatedGoal).not.toBeNull();
    expect(updatedGoal?.category).toBe("Investment");
  });

  test("should not update a goal with an invalid category", async () => {
    const goal = await addGoal(userId, "Goal with Invalid Category", "2025-12-31", 200, 1000, "Saving");
  
    await expect(editGoal(goal._id.toString(), undefined, undefined, undefined, 1200, "InvalidCategory"))
      .rejects.toThrow("Invalid category. Must be one of: Saving, Investment, Debt Payment, Other");
  });

  test("should update only category of an existing goal", async () => {
    const goal = await addGoal(userId, "Goal with Category Update", "2025-12-31", 200, 1000, "Saving");
    const updatedGoal = await editGoal(goal._id.toString(), undefined, undefined, undefined, undefined, "Debt Payment");
  
    expect(updatedGoal).not.toBeNull();
    expect(updatedGoal?.category).toBe("Debt Payment");
  });

  test("should update the time of an existing goal", async () => {
    const goal = await addGoal(userId, "Initial Goal", "2025-12-31", 200, 1000, "Saving");
    const updatedGoal = await editGoal(goal._id.toString(), undefined, "2026-06-30", undefined, undefined, undefined);
  
    expect(updatedGoal).not.toBeNull();
    expect(updatedGoal?.time.toISOString()).toBe("2026-06-30T00:00:00.000Z");
  });

  test("should not change time if no new time is provided", async () => {
    const goal = await addGoal(userId, "Goal without Time Change", "2025-12-31", 200, 1000, "Saving");
    const unchangedGoal = await editGoal(goal._id.toString(), undefined, undefined, undefined, undefined, undefined);
  
    expect(unchangedGoal).not.toBeNull();
    expect(unchangedGoal?.time.toISOString()).toBe("2025-12-31T00:00:00.000Z");
  });

  test("should update the time of the goal when a specific date is provided", async () => {
    const goal = await addGoal(userId, "Goal with Specific Time", "2025-12-31", 200, 1000, "Saving");
    const updatedGoal = await editGoal(goal._id.toString(), undefined, "2025-12-25", undefined, undefined, undefined);
  
    expect(updatedGoal).not.toBeNull();
    expect(updatedGoal?.time.toISOString()).toBe("2025-12-25T00:00:00.000Z");
  });

  // ✅ Deleting Goals
  test("should delete a goal successfully", async () => {
    const goal = await addGoal(userId, "Delete Goal", "2025-12-31", 100, 500, "Saving");
    await deleteGoal(goal._id.toString());
    const goals = await getAllGoals(userId);
    expect(goals.length).toBe(0);
  });

  test("should not delete a goal with invalid ID format", async () => {
    await expect(deleteGoal("invalid-id")).rejects.toThrow("Invalid goal ID format");
  });

  test("should not delete a non-existent goal", async () => {
    const result = await deleteGoal(new mongoose.Types.ObjectId().toString());
    expect(result.deletedCount).toBe(0);
  });
});
