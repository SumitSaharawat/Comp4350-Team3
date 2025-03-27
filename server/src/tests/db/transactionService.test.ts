import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User from "../../db/userDB";
import Tag from "../../db/tagDB";
import Transaction from "../../db/transactionDB";
import { addTransaction, getAllTransactions, editTransaction, deleteTransaction } from "../../db/transactionService";

// Test settings assisted by AI
beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe("Transaction Service Tests", () => {
  let userId: string;
  let tagId: string;
  let mongoServer: MongoMemoryServer;
  let transactionId: string;

  beforeAll(async () => {
    mongoose.set('strictQuery', true);
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Tag.deleteMany({});
    await Transaction.deleteMany({});

    const user = new User({
      username: `testuser_${Date.now()}`,
      password: "testpassword",
      balance: 1000,
    });
    await user.save();
    userId = user._id;

    const tag = new Tag({
      user: userId,
      name: "Food",
      color: "#FF5733",
    });
    await tag.save();
    tagId = tag._id;

    const transaction = new Transaction({
      user: userId,
      name: "Grocery Shopping",
      date: new Date(),
      amount: 1000,
      currency: "CAD",
      type: "Spending",
      tags: [tagId],
    });
    await transaction.save();
    transactionId = transaction._id;
  });

  describe("addTransaction function", () => {
    it("should add a new transaction for a user", async () => {
      const newTransaction = await addTransaction(userId, "Test Transaction", "2025-03-27", 50, "CAD", "Spending", [tagId]);

      expect(newTransaction).toHaveProperty("_id");
      expect(newTransaction.name).toBe("Test Transaction");
      expect(newTransaction.amount).toBe(50);
      expect(newTransaction.currency).toBe("CAD");
      expect(newTransaction.type).toBe("Spending");
      expect(newTransaction.tags.length).toBeGreaterThan(0);
    });

    it("should throw error if user does not exist", async () => {
      const invalidUserId = new mongoose.Types.ObjectId().toString();
      await expect(addTransaction(invalidUserId, "Test Transaction", "2025-03-27", 50, "CAD", "Spending", [tagId])).rejects.toThrow("User does not exist");
    });
  });

  describe("getAllTransactions function", () => {
    it("should return all transactions for a user", async () => {
      const transactions = await getAllTransactions(userId);

      expect(transactions).toHaveLength(1);
      expect(transactions[0]).toHaveProperty("name", "Grocery Shopping");
    });

    it("should throw error for invalid user ID format", async () => {
      await expect(getAllTransactions("invalidUserId")).rejects.toThrow("Invalid user ID format");
    });
  });

  describe("editTransaction function", () => {
    it("should update an existing transaction", async () => {
      const updatedTransaction = await editTransaction(transactionId, "Updated Grocery Shopping", "2025-03-28", 120, "CAD", "Spending", [tagId]);

      expect(updatedTransaction).toHaveProperty("_id", transactionId);
      expect(updatedTransaction.name).toBe("Updated Grocery Shopping");
      expect(updatedTransaction.amount).toBe(120);
      expect(updatedTransaction.currency).toBe("CAD");
    });

    it("should throw error for invalid transaction type", async () => {
      await expect(editTransaction(transactionId, "Updated Grocery Shopping", "2025-03-28", 120, "CAD", "InvalidType", [tagId])).rejects.toThrow("Invalid type. Must be one of: Saving, Spending");
    });

    it("should update user balance after spending", async () => {
      const originalBalance = (await User.findById(userId)).balance;
      const updatedTransaction = await editTransaction(transactionId, "Updated Grocery Shopping", "2025-03-28", 120, "CAD", "Spending", [tagId]);

      expect(updatedTransaction.amount).toBe(120);
      const newBalance = (await User.findById(userId)).balance;
      expect(newBalance).toBe(originalBalance - 120+1000);
    });

    it("should update user balance after saving", async () => {
      const originalBalance = (await User.findById(userId)).balance;
      const updatedTransaction = await editTransaction(transactionId, "Updated Grocery Shopping", "2025-03-28", 120, "CAD", "Saving", [tagId]);

      expect(updatedTransaction.amount).toBe(120);
      const newBalance = (await User.findById(userId)).balance;
      expect(newBalance).toBe(originalBalance + 120+1000);
    });
  });

  describe("deleteTransaction function", () => {
    it("should delete an existing transaction", async () => {
      const result = await deleteTransaction(transactionId);

      expect(result.deletedCount).toBe(1);
    });

    it("should throw error if transaction does not exist", async () => {
      const invalidTransactionId = new mongoose.Types.ObjectId().toString();
      await expect(deleteTransaction(invalidTransactionId)).rejects.toThrow(new RegExp(`No transaction found with ID ${invalidTransactionId}`));
    });

    it("should update user balance after deleting a spending transaction", async () => {
      const originalBalance = (await User.findById(userId)).balance;
      const result = await deleteTransaction(transactionId);

      const newBalance = (await User.findById(userId)).balance;
      expect(newBalance).toBe(originalBalance + 1000);
    });

    it("should update user balance after deleting a saving transaction", async () => {
      const savingTransaction = await addTransaction(userId, "Test Saving Transaction", "2025-03-28", 150, "CAD", "Saving", [tagId]);

      const originalBalance = (await User.findById(userId)).balance;
      await deleteTransaction(savingTransaction._id);

      const newBalance = (await User.findById(userId)).balance;
      expect(newBalance).toBe(originalBalance - 150);
    });
  });
});
