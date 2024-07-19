const express = require("express");
const {
  userById,
  homePage,
  userAvtar,
  userForgetLink,
  userResetPassword,
  userSendMail,
  userSignin,
  userSignout,
  currentUser,
  userSignup,
  userUpdate,
  searchUser,
  followUser,
  unFollowUser
} = require("../controllers/userControllers");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.get("/", homePage);

// POST /user
router.get("/user", isAuthenticated, currentUser);

// POST /user/signup
router.post("/user/signup", userSignup);
router.post("/user/signin", userSignin);
router.get("/user/signout", userSignout);
router.get("/user/:id", isAuthenticated, userById);

router.post('/user/search',isAuthenticated,searchUser)
// send mail
router.post("/user/send-mail", userSendMail);

router.post('/user/follow',isAuthenticated,followUser)

router.post("/user/unfollow", isAuthenticated, unFollowUser);


// Get /user/forget-link/:userId
router.post("/user/forget-link", userForgetLink);

// Post /user/reset-password/:userId
router.post("/user/reset-password/:id", isAuthenticated, userResetPassword);

// Post /user/update/:userId

router.post("/user/update", isAuthenticated, userUpdate);

// upload avtar
router.post("/user/avtar/:id", isAuthenticated, userAvtar);

module.exports = router;
