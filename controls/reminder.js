const Reminder = require("../models/Reminder");

exports.addReminder = async (req, res) => {
  const { amount, type, date, description } = req.body;
  const userId = req.userId;

  try {
    const reminder = await Reminder.create({
      amount,
      type,
      date,
      description,
      userId,
    });
    res.status(200).json(reminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.deleteReminder = async (req, res) => {
  const { reminderId } = req.params;
  const result = await Reminder.deleteOne({ _id: reminderId });
  res.status(200).json({ message: "Deleted successfully" });
  try {
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getReminder = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.userId });
    res.status(200).json(reminders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
