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
  checkUser,
  userLogout,
} = require("../controls/user");

router.get("/users", requireAuth, getUsers);
router.get("/checkUser", requireAuth, checkUser);
router.post("/addUser", requireAuth, addNewUser);
router.post("/login", userLogin);
router.post("/logout", userLogout);
router.post("/switchUserStatus", requireAuth, userInactive);
router.post("/changePassword", requireAuth, changePassword);

module.exports = router;
