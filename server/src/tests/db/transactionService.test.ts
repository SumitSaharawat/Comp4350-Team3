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
      amount: 100,
      currency: "USD",
      type: "Spending",
      tags: [tagId],
    });
    await transaction.save();
    transactionId = transaction._id;
  });

  describe("addTransaction function", () => {
    it("should add a new transaction for a user", async () => {
      const newTransaction = await addTransaction(userId, "Test Transaction", "2025-03-27", 50, "USD", "Spending", [tagId]);

      expect(newTransaction).toHaveProperty("_id");
      expect(newTransaction.name).toBe("Test Transaction");
      expect(newTransaction.amount).toBe(50);
      expect(newTransaction.currency).toBe("USD");
      expect(newTransaction.type).toBe("Spending");
      expect(newTransaction.tags.length).toBeGreaterThan(0);
    });

    it("should throw error if user does not exist", async () => {
      const invalidUserId = new mongoose.Types.ObjectId().toString();
      await expect(addTransaction(invalidUserId.toString(), "Test Transaction", "2025-03-27", 50, "USD", "Spending", [tagId])).rejects.toThrow("User does not exist");
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
      const updatedTransaction = await editTransaction(transactionId, "Updated Grocery Shopping", "2025-03-28", 120, "USD", "Spending", [tagId]);

      expect(updatedTransaction).toHaveProperty("_id", transactionId);
      expect(updatedTransaction.name).toBe("Updated Grocery Shopping");
      expect(updatedTransaction.amount).toBe(120);
    });

    it("should throw error if transaction ID is invalid", async () => {
      await expect(editTransaction("invalidTransactionId")).rejects.toThrow("Invalid transaction ID format");
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
    })    
  });
});
