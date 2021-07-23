const express = require("express");
const { sendApprovalRequest, approved } = require("../controls/approval");
const router = express.Router();

router.post("/", sendApprovalRequest);
router.patch("/approved/:approvalId", approved);

module.exports = router;
