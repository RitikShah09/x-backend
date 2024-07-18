const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const { sendMail } = require("../utils/nodeMailer");
const { sendToken } = require("../utils/sendToken");
const imageKit = require("../utils/imageKit").initImageKit();
const path = require("path");

const Post = require("../models/postModel");
const User = require("../models/userModel");

exports.homePage = catchAsyncErrors(async (req, res, next) => {
  res.json("Welcome, API Is Working");
});

exports.currentUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.id).populate("posts").exec();
  res.json(user);
});

exports.userSignup = catchAsyncErrors(async (req, res, next) => {
  const user = await new User(req.body).save();
  sendToken(user, 201, res);
});

exports.userSignin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email }).select("+password").exec();
  if (!user) {
    return next(new ErrorHandler("User Not Found With This Email Address"));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid Credentials"));
  }
  sendToken(user, 201, res);
});

exports.userSignout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "Successfully Singed Out!" });
});

exports.userSendMail = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).exec();
  if (!user) {
    return next(new ErrorHandler("User Not Found With This Email Address"));
  }

  const otp = Math.floor(Math.random() * 9000 + 1000);

  sendMail(req, res, next, otp);
  user.resetPasswordToken = otp;
  await user.save();

  res.json({ message: "Mail Sent successfully check your inbox" });
});

exports.userForgetLink = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).exec();
  if (!user) {
    return next(new ErrorHandler("User Not Found With This Email Address"));
  }
  if (user.resetPasswordToken == req.body.otp) {
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    user.password = req.body.password;
    await user.save();
  } else {
    return next(
      new ErrorHandler("Invalid Reset Password Link Please Try Again", 404)
    );
  }
  res.status(200).json({ message: "Password Has Been Successfully Changed" });
});

exports.userResetPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.id).exec();
  user.password = req.body.password;
  await user.save();
  sendToken(user, 201, res);
});

exports.userUpdate = catchAsyncErrors(async (req, res, next) => {
  await User.findByIdAndUpdate(req.id, req.body).exec();
  res.status(200).json({
    success: true,
    message: "User Updated Successfully",
  });
});

exports.userAvtar = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();
  const file = req.files.avtar;
  const modifiedFileName = `Profile-${user._id}${path.extname(file.name)}`;
  if (user.avatar.fileId !== "") {
    await imageKit.deleteFile(user.avatar.fileId);
  }
  const { fileId, url } = await imageKit.upload({
    file: file.data,
    fileName: modifiedFileName,
  });
  user.avatar = { fileId, url };
  await user.save();
  res.status(200).json({ success: true, message: "Profile Updated" });
});

exports.userById = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const posts = await Post.find({ userid: req.params.id }).sort("-createdAt");
  res.status(200).json({
    success: true,
    posts,
    user,
  });
});

exports.searchUser = catchAsyncErrors(async (req, res, next) => {
  const search = req.body.search;
  var data = await User.find({
    username: { $regex: ".*" + search + ".*", $options: "i" },
  });
  res.status(200).json({
    success: true,
    data,
  });
});

exports.followUser = catchAsyncErrors(async (req, res, next) => {
   await User.findByIdAndUpdate(
    req.body.id,
    {
      $push: { followers: req.id },
    },
    {
      new: true,
    }
  );
  await User.findByIdAndUpdate(
    req.id,
    {
      $push: { following: req.body.id },
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "User Followed!",
  });
});

exports.unFollowUser = catchAsyncErrors(async (req, res, next) => {
 await User.findByIdAndUpdate(
   req.body.id,
   {
     $pull: { followers: req.id },
   },
   {
     new: true,
   }
 );
 await User.findByIdAndUpdate(
   req.id,
   {
     $pull: { following: req.body.id },
   },
   { new: true }
 );
 res.status(200).json({
   success: true,
   message: "User UnFollowed!",
 });
});
