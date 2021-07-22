const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please enter your name"],
    },
    userName: {
      type: String,
      required: [true, "Please enter a username"],
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    active: Boolean,
  },
  { timestamps: true }
);

// function run after user create

// userSchema.post("save", async function (doc, next) {
//   const { totalMembers } = await Settings.findOne().exec();
//   await Settings.create({ totalMembers: 1 });
//   next();
// });

// function before document saved to database
// note:arrow function is not working
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  this.active = true;
  next();
});

// static function

userSchema.statics.login = async function (userName, password) {
  const user = await this.findOne({ userName });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect password");
  }
  throw Error("User does not exist");
};

userSchema.statics.changePassword = async function (
  userId,
  oldPassword,
  newPassword
) {
  const user = await this.findById(userId);
  if (user) {
    const auth = await bcrypt.compare(oldPassword, user.password);
    if (auth) {
      const salt = await bcrypt.genSalt();
      const encryptedNewPassword = await bcrypt.hash(newPassword, salt);
      const update = await this.updateOne(
        { _id: userId },
        { password: encryptedNewPassword }
      );
      return {
        message: "Password has been changed",
      };
    }
    throw Error("Password hasn't match");
  }
  throw Error("Authentication error");
};

const User = mongoose.model("user", userSchema);
module.exports = User;
