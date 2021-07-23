const mongoose = require("mongoose");
const approvalSchema = new mongoose.Schema(
  {
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    totalApprovar: Number,
    approverId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

const Approval = mongoose.model("approval", approvalSchema);
module.exports = Approval;
