const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const client = require("../helpers/init_redis");

const createToken = (id, expiry) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: expiry });
};
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(401).json("something went wrong");
  }
};
exports.addNewUser = async (req, res) => {
  const { fullName, userName, password } = req.body;
  try {
    const user = await User.create({ fullName, userName, password });
    res.status(200).json({ userId: user._id });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.userLogin = async (req, res) => {
  const { userName, password } = req.body;
  const { uuid } = req.cookies;

  if (uuid) {
    client.del(uuid);
  }
  try {
    const user = await User.login(userName, password);
    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1 d",
    });
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY_REFRESH,
      {
        expiresIn: "15 d",
      }
    );
    let expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    // create unique uuid
    const uuid = uuidv4();
    client.set(uuid, JSON.stringify(refreshToken));
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      expires: expiryDate,
      // secure: true,
      sameSite: "None",
    });
    res.cookie("uuid", uuid, {
      httpOnly: true,
      expires: expiryDate,
      // secure: true,
      sameSite: "None",
    });
    res.status(200).json({ token: accessToken, uuid });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.userInactive = async (req, res) => {
  const { userId } = req.body;
  try {
    const { active, fullName } = await User.findById(userId);
    const response = await User.updateOne({ _id: userId }, { active: !active });
    res.status(200).json({
      message: `${fullName} account has been ${
        active ? "in-activated" : "activated"
      }`,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  try {
    const response = await User.changePassword(
      userId,
      currentPassword,
      newPassword
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.checkUserActive = async (req, res) => {
  const userId = req.userId;
  const { active } = await User.findById(userId);
  if (active) {
    res.status(200).json("user is active");
  } else {
    res.status(401).json({ error: "Access denined" });
  }
};

exports.userLogout = async (req, res) => {
  try {
    res.cookie("accessToken", "logout", {
      httpOnly: true,
      expires: "1 s",
      // secure: true,
      sameSite: "None",
    });
    res.status(200).json({ token: accessToken, uuid });
  } catch (error) {}
};
