const Post = require("../models/postModel");
const User = require("../models/userModel");
const imageKit = require("../utils/imageKit").initImageKit();
const ErrorHandler = require("../utils/errorHandler");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const path = require("path");

exports.postHome = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Post Api!",
  });
});

exports.createPost = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.id);
  const file = req.files.post;
  const text = req.body.text;
  console.log(file)
  const modifiedFileName = `Post-${Date.now}${path.extname(file.name)}`;
  const { fileId, url } = await imageKit.upload({
    file: file.data,
    fileName: modifiedFileName,
  });
  const post = await Post.create({
   text:text,
    postImage: { fileId, url },
    userid: req.id,
  });
  user.posts.push(post._id);
  user.save();
  res.status(200).json({
    success: true,
    message: "Post Created!",
  });
});

exports.allPost = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.id);
  // {
  //   userid: { $in: [user.following] },
  // }
  const allPosts = await Post.find().populate('userid');
  res.status(200).json({
    success: true,
    allPosts,
  });
});

exports.postById = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate({
      path: "comment",
      populate: {
        path: "reply",
        populate: {
          path: "userid",
        },
      },
    })
    .populate("userid")
    .populate({
      path: "comment",
      populate: {
        path: "userid",
      },
    });
  res.status(200).json({
    success: true,
    post,
  });
});

exports.likePost = catchAsyncErrors(async (req, res, next) => {
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $push: { likes: req.id },
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    updatedPost,
  });
});

exports.unLikePost = catchAsyncErrors(async (req, res, next) => {
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { likes: req.id },
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    updatedPost,
  });
});

exports.savePost = catchAsyncErrors(async (req, res, next) => {
  const postId = req.params.id;
  const user = await User.findById(req.id);
  if (user.savedPost.includes(postId)) {
    const index = user.savedPost.indexOf(postId);
    user.savedPost.splice(index, 1);
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Post Removed!",
    });
  } else {
    user.savedPost.push(postId);
    await user.save();
    return res.status(200).json({ success: true, message: "Post Saved!" });
  }
});

exports.deletePost = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  const user = await User.findById(req.id);
  if (!post) {
    return next(new ErrorHandler("Post Not Found!"));
  }
  await imageKit.deleteFile(post.postImage.fileId);
  await Post.findByIdAndDelete(req.params.id);
  const index = user.posts.indexOf(req.params.id);
  user.posts.splice(index, 1);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Post Deleted!",
  });
});
