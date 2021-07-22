const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Must not be empty"],
    },
    date: Date,
    description: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    isLive: Boolean,
  },
  { timestamps: true }
);

expenseSchema.pre("save", function (next) {
  this.isLive = true;
  next();
});

const Expense = mongoose.model("expense", expenseSchema);
module.exports = Expense;
