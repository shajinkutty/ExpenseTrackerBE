const jwt = require("jsonwebtoken");
const client = require("../helpers/init_redis");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  // authentication from => local storage || headers
  // const authHeader = req.headers.authorization;

  const { accessToken, uuid } = req.cookies;
  if (accessToken) {
    jwt.verify(
      accessToken,
      process.env.SECRET_KEY,
      async (err, decodedToken) => {
        if (err) {
          client.get(uuid, async (err, value) => {
            const refreshToken = await JSON.parse(value);
            if (refreshToken) {
              jwt.verify(
                refreshToken,
                process.env.SECRET_KEY_REFRESH,
                (err, decodedRefreshToken) => {
                  if (err) {
                    client.del(uuid);
                    res.clearCookie("accessToken");
                    res.clearCookie("uuid");
                    res.status(401).json("Login required");
                  } else {
                    const newAccessToken = jwt.sign(
                      { id: decodedRefreshToken.id },
                      process.env.SECRET_KEY,
                      { expiresIn: "15 s" }
                    );
                    res.cookie("accessToken", newAccessToken, {
                      httpOnly: true,
                    });

                    req.userId = decodedRefreshToken.id;
                    next();
                  }
                }
              );
            } else {
              res.status(401).json({ error: "Auth Error - no Token" });
            }
          });
        } else {
          req.userId = decodedToken.id;
          next();
        }
      }
    );
  } else {
    res.status(401).json({ error: "Auth Error - no Token" });
  }
};

const checkUserActive = async (req, res, next) => {
  const userId = req.userId;
  const { active } = await User.findById(userId);
  if (active) {
    next();
  } else {
    res.status(401).json({ error: "Access denined" });
  }
};

module.exports = { requireAuth, checkUserActive };
