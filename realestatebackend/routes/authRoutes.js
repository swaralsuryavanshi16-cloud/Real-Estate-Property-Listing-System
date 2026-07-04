
const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
} = require("../controllers/authController");

const {
  sendOTP,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
} = require("../controllers/otpController");

const { protect } = require("../middleware/auth");
const { uploadAvatar } = require("../middleware/upload");

// ==============================
// Public Authentication Routes
// ==============================

// OTP Routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

// Registration & Login
router.post("/register", register);
router.post("/login", login);

// Password Reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ==============================
// Protected Routes
// ==============================

// User Profile
router.get("/me", protect, getMe);

// Update Profile
router.put(
  "/updateprofile",
  protect,
  uploadAvatar.single("avatar"),
  updateProfile
);

// Change Password
router.put("/changepassword", protect, changePassword);

// Logout
router.get("/logout", protect, logout);

module.exports = router;