const express = require("express");
const {
  sendApprovalRequest,
  approved,
  deleteCloseRequest,
} = require("../controls/approval");
const router = express.Router();

router.post("/", sendApprovalRequest);
router.patch("/approved/:approvalId", approved);
router.delete("/deleteCloseRequest", deleteCloseRequest);

module.exports = router;
