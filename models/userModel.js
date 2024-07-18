const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "First Name Is Required"],
    },
    bio: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Email Is Required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      unique: true,
    },
    username: {
      type: String,
      equired: [true, "UserName Is Required"],
      unique: true,
    },
    password: {
      type: String,
      select: false,
      maxLength: [15, "Password should not exceed more than 15 characters"],
      minLength: [6, "Password should have atleast 6 characters"],
      //   match : []
    },
    resetPasswordToken: {
      type: String,
      default: "0",
    },
    resetPasswordExpire: Date,
    avatar: {
      type: Object,
      default: {
        fileId: "",
        url: "https://images.unsplash.com/photo-1695802060198-c735209f8e35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2187&q=80",
      },
    },

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    savedPost: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    followers: [{ type: mongoose.Schema.ObjectId, ref: "user" }],
    following: [{ type: mongoose.Schema.ObjectId, ref: "user" }],
  },
  { timestamps: true }
);

userModel.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userModel.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userModel.methods.getJwtoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = mongoose.model("user", userModel);

module.exports = User;
