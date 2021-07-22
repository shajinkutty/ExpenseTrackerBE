const express = require("express");
const { sendApprovalRequest, approved } = require("../controls/approval");
const router = express.Router();

router.post("/", sendApprovalRequest);
router.post("/approved", approved);

module.exports = router;
