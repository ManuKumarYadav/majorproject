const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../../cloudConfig.js");
const upload = multer({ storage });

const listingsApi = require("../../controllers/api/listings");
const authApi = require("../../controllers/api/auth");
const bookingsApi = require("../../controllers/api/bookings");
const reviewsApi = require("../../controllers/api/reviews");
const hostApi = require("../../controllers/api/host");

// Middleware to check authentication for API
const isApiLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: "Please log in to continue." });
    }
    next();
};

// Auth API Routes
router.get("/auth/current-user", authApi.getCurrentUser);
router.post("/auth/login", authApi.login);
router.post("/auth/signup", authApi.signup);
router.post("/auth/logout", authApi.logout);
router.post("/auth/firebase-google", authApi.firebaseGoogleAuth);
router.post("/auth/check-email", authApi.checkEmailExists);
router.post("/auth/reset-password-direct", authApi.resetPasswordDirect);
router.put("/auth/profile", isApiLoggedIn, upload.single("avatar"), authApi.updateProfile);

// Listings API Routes
router.get("/listings", listingsApi.index);
router.post("/listings", isApiLoggedIn, upload.single("image"), listingsApi.createListing);
router.get("/listings/:id", listingsApi.showListing);
router.put("/listings/:id", isApiLoggedIn, upload.single("image"), listingsApi.updateListing);
router.delete("/listings/:id", isApiLoggedIn, listingsApi.destroyListing);

// Reviews API Routes
router.post("/listings/:id/reviews", isApiLoggedIn, reviewsApi.createReview);
router.delete("/listings/:id/reviews/:reviewId", isApiLoggedIn, reviewsApi.destroyReview);

// Bookings API Routes
router.post("/bookings/create-order", bookingsApi.createOrder);
router.post("/bookings/verify-payment", bookingsApi.verifyPayment);
router.get("/bookings/my-bookings", isApiLoggedIn, bookingsApi.getMyBookings);

// Host API Routes
router.get("/host/dashboard", isApiLoggedIn, hostApi.getDashboard);

module.exports = router;
