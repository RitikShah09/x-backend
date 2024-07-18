const Post = require("../models/postModel");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Comment = require("../models/commentModel");
const Reply = require("../models/replySchema");

exports.createComment = catchAsyncErrors(async (req, res, next) => {
  const { postId, text } = req.body;
  const createComment = await Comment.create({ postId, text, userid: req.id });
  const post = await Post.findOne({ _id: postId });
  post.comment.push(createComment._id);
  post.save();
  res.status(200).json("Comment Added!");
});

exports.deleteComment = catchAsyncErrors(async (req, res, next) => {
  const commentId = req.params.commentId;
  const comment = await Comment.findById(commentId);
  if (comment.userid !== req.id) {
    return next(new ErrorHandler("Only Owner Can Delete!", 404));
  }
  await Comment.findByIdAndDelete(commentId);
  res.status(200).json("Comment Deleted!");
});

exports.replyComment = catchAsyncErrors(async (req, res, next) => {
  const { commentId, text } = req.body;
  const comment = await Comment.findById(commentId);
  const replyDetails = { text, commentId, userid: req.id };
  const createReply = await Reply.create(replyDetails);
  comment.reply.push(createReply._id);
  comment.save();
  res.status(200).json("Reply Added!");
});

exports.deleteReply = catchAsyncErrors(async (req, res, next) => {
  const { commentId, replyId } = req.body;
  const comment = await Comment.findById(commentId);
  const index = comment.reply.indexOf(replyId);
  comment.reply.splice(index, 1);
  await comment.save();
  await Reply.findByIdAndDelete(replyId);

  res.status(200).json("Reply Deleted!");
});
