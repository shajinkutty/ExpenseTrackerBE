const Expense = require("../models/Expense");
const User = require("../models/User");
const Approval = require("../models/Approval");

// calculate the sum of expense
const expenseSum = (exArray) => {
  const totalAmount = exArray.map((ex) => ex.amount);
  if (totalAmount.length > 0) {
    return totalAmount.reduce((total, num) => total + num);
  }
  return 0;
};

exports.dashboardEndPoint = async (req, res) => {
  try {
    const { _id, fullName, userName, active } = await User.findById(req.userId);
    const userExpense = await Expense.find({ isLive: true, userId: _id });
    const totalMembers = await User.countDocuments({ active: true });
    const expenseData = await Expense.find({ isLive: true }).populate({
      path: "userId",
      select: ["fullName"],
    });
    const closeAction = await Approval.findOne().populate({
      path: "approverId",
      select: ["fullName"],
    });

    res.status(200).json({
      user: {
        _id,
        fullName,
        userName,
        active,
      },
      totalMembers,
      expenseData,
      LiveTotalAmount: expenseSum(expenseData),
      userExpense: expenseSum(userExpense),
      closeAction: closeAction
        ? closeAction
        : {
            _id: "",
            requesterId: "",
            totalApprovar: 0,
          },
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
