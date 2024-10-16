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
        url: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
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
