const {
  createComment,
  deleteReply,
  deleteComment,
  replyComment,
} = require("../controllers/commentControllers");
const { isAuthenticated } = require("../middlewares/auth");
const express = require('express');


const router = express.Router();

router.post("/", isAuthenticated, createComment);

router.get("/delete-comment", isAuthenticated, deleteComment);

router.post("/delete-reply", isAuthenticated, deleteReply);

router.post("/reply-comment", isAuthenticated, replyComment);

module.exports = router;
