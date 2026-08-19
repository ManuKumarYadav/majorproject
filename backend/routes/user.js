const express = require("express");
const router = express.Router();
const User = require("../models/user.js"); 
const wrapasync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

// Signup
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapasync(userController.signup));

// Local Login
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }), 
    userController.login
    );

// Logout
router.get("/logout", userController.logout);

// Google OAuth Routes
router.get("/auth/google", (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        req.flash("error", "Google Sign-In is not configured yet. Please provide GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env");
        return res.redirect("/login");
    }
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

router.get("/auth/google/callback", (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        req.flash("error", "Google Sign-In is not configured yet.");
        return res.redirect("/login");
    }
    passport.authenticate("google", {
        failureRedirect: "/login",
        failureFlash: "Google sign-in failed. Please try again."
    })(req, res, next);
}, userController.googleCallback);

// Firebase Google Auth Route
router.post("/auth/firebase-google", wrapasync(userController.firebaseGoogleAuth));

// Forgot Password (page)
router
    .route("/forgot-password")
    .get(userController.renderForgotForm)
    .post(wrapasync(userController.sendResetEmail));

// Inline reset API: verify email exists
router.post("/forgot-password/check-email", wrapasync(userController.checkEmailExists));

// Inline reset API: directly set new password
router.post("/forgot-password/reset-direct", wrapasync(userController.resetPasswordDirect));

// Reset Password (token-based, kept for email flow compatibility)
router
    .route("/reset-password/:token")
    .get(wrapasync(userController.renderResetForm))
    .post(wrapasync(userController.resetPassword));

module.exports = router;


