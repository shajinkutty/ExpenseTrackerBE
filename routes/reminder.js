const express = require("express");
const {
  addReminder,
  deleteReminder,
  getReminder,
} = require("../controls/reminder");
const router = express.Router();

router.get("/", getReminder);
router.post("/addReminder", addReminder);
router.delete("/deleteReminder/:reminderId", deleteReminder);

module.exports = router;
