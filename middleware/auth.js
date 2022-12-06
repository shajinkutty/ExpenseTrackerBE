const jwt = require("jsonwebtoken");
// const client = require("../helpers/init_redis");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  // authentication from => local storage || headers
  const { tokenid } = req.headers;
  try {
    if (!tokenid) {
      res.status(401).json("Auth Error - no Token");
    }
    jwt.verify(tokenid, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        res.status(401).json("Auth Error - no Token");
      } else {
        req.userId = decodedToken.id;
        next();
      }
    });
    // } else {
    //   res.status(401).json("Auth Error - no Token");
    // }
  } catch (error) {
    res.status(401).json("Auth Error - no Token");
  }
};

const checkUserActive = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { active } = await User.findById(userId);
    if (active) {
      next();
    } else {
      res.status(401).json({ error: "Access denined" });
    }
  } catch (error) {
    res.status(401).json("Access denined");
  }
};

module.exports = { requireAuth, checkUserActive };
