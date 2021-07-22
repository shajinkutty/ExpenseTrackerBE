const Approval = require("../models/Approval");
const User = require("../models/User");
const Expense = require("../models/Expense");

exports.sendApprovalRequest = async (req, res) => {
  const userId = req.userId; // userId from auth middleware

  try {
    await Approval.deleteMany(); //deleting excisting collections
    const users = await User.find({ active: true }); //get active users

    // create new approval request
    const newApprove = await Approval.create({
      requesterId: userId,
      totalApprovar: users.length,
      approverId: [userId],
    });
    res.status(200).json(newApprove);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.approved = async (req, res) => {
  const userId = req.userId; // userId from auth middleware

  try {
    const { approvalId } = req.query; //active approval id from query params
    const approval = await Approval.findById(approvalId); //get active approval collection

    if (userId == approval.requesterId) {
      res.status(200).json("You placed the request");
    } else {
      const approvalArray = approval.approverId;
      if (approvalArray.includes(userId)) {
        res.status(200).json("You already approved");
      } else {
        // update approved user id
        const update = {
          ...approval._doc,
          approverId: [...approval._doc.approverId, userId],
        };
        const result = await Approval.updateOne({ _id: approvalId }, update);

        //  if total active users greater than or equel to total approved
        //  user ids delete the entire approval collection and all live expence change to false
        if (update.approverId.length >= approval.totalApprovar) {
          await Approval.deleteMany();
          const status = await Expense.updateMany(
            { isLive: true },
            { isLive: false }
          );
          res.json({ message: "Updated all live expenses" });
        } else {
          res.status(200).json({ message: "Pending approval" });
        }
      }
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
