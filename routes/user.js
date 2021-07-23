const express = require("express");
const router = express.Router();

// middleware for changing the password
const { requireAuth } = require("../middleware/auth");

const {
  addNewUser,
  userLogin,
  userInactive,
  changePassword,
  getUsers,
  checkUserActive,
} = require("../controls/user");

router.get("/users", requireAuth, getUsers);
router.get("/checkUserActive", requireAuth, checkUserActive);
router.post("/addUser", requireAuth, addNewUser);
router.post("/login", userLogin);
router.post("/switchUserStatus", requireAuth, userInactive);
router.post("/changePassword", requireAuth, changePassword);

module.exports = router;
