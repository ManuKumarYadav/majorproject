const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/bookings");

// Create Razorpay Order
router.post("/create-order", isLoggedIn, wrapAsync(bookingController.createOrder));

// Verify Payment
router.post("/verify-payment", isLoggedIn, wrapAsync(bookingController.verifyPayment));

// Booking Success Page
router.get("/booking-success/:bookingId", isLoggedIn, wrapAsync(bookingController.renderBookingSuccess));

module.exports = router;
