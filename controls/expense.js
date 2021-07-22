const Expense = require("../models/Expense");
const User = require("../models/User");

exports.getAllExpenses = async (req, res) => {
  try {
    const expense = await Expense.find().populate({
      path: "userId",
      select: ["fullName"],
    });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addExpense = async (req, res) => {
  const { amount, date, description, userId } = req.body;

  try {
    const expense = await Expense.create({ amount, date, description, userId });
    res.status(200).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserExpenses = async (req, res) => {
  const { userId } = req.params;
  try {
    const expense = await Expense.find({ userId }).populate({
      path: "userId",
      select: ["fullName"],
    });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  const { expenseId } = req.params;

  try {
    const { userId } = await Expense.findById(expenseId);
    if (userId == req.userId) {
      const result = await Expense.deleteOne({ _id: expenseId });
      res.status(200).json({
        message:
          result.deletedCount > 0
            ? "Document has been deleted successfully"
            : "Document not found",
      });
    } else {
      throw Error("You don't have permission for delete this document");
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  const { expenseId } = req.params;
  const { amount, description, date } = req.body;
  try {
    const result = await Expense.updateOne(
      { _id: expenseId },
      { amount, description, date }
    );
    res.status(200).json({ message: "Update done" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
