const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    amount: {
      type: String,
    },
    type: {
      type: String,
    },
    date: {
      type: Date,
      default: new Date(),
    },
    description: String,
    userId: mongoose.Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

const reminder = mongoose.model("reminder", reminderSchema);
module.exports = reminder;
