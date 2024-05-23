const router = require("express").Router();
const passport = require("passport");
const authController= require("../controllers/authControllers");
const {
  verifyTokenAndEmployer,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

// Register Employer Route
router.post("/register/employer", verifyTokenAndAdmin, authController.registerEmployer);

// Register Employee Route
router.post("/register/employee", verifyTokenAndEmployer, authController.registerEmployee);

// Normal Login Admin Route
router.post("/login/admin", authController.login);

// Normal Login Employee Route
router.post("/login/employee", authController.loginEmployee);

// Normal Login Employer Route
router.post("/login/employer", authController.loginEmployer);

// Google OAuth Login Route for users
router.get("/google/login", authController.googleLogin);

// Google OAuth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleCallback
);

module.exports = router;
