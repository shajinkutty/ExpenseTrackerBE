const express = require("express");
const router = express.Router();

const {
  addExpense,
  getAllExpenses,
  getUserExpenses,
  deleteExpense,
  updateExpense,
} = require("../controls/expense");

router.get("/", getAllExpenses);
router.post("/addExpense", addExpense);
router.get("/:userId", getUserExpenses);
router.delete("/:expenseId", deleteExpense);
router.patch("/:expenseId", updateExpense);

module.exports = router;
