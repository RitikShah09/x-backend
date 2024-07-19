const express = require("express");

const {
  postHome,
  allPost,
  likePost,
  savePost,
  createPost,
  deletePost,
  unLikePost,
  postById,
  savedPost,
} = require("../controllers/postControllers");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.post("/", isAuthenticated,createPost);
router.get("/saved-post", isAuthenticated, savedPost);

router.get("/all-post", isAuthenticated, allPost);
router.get("/:id", isAuthenticated, postById);
router.get("/delete/:id", isAuthenticated, deletePost);
// // POST /student
router.get("/like/:id", isAuthenticated, likePost);

router.get("/unlike/:id", isAuthenticated, unLikePost);
router.get("/save-post/:id", isAuthenticated, savePost);

module.exports = router;
