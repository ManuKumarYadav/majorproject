const express = require("express");
const router = express.Router();
const hostController = require("../controllers/host.js");
const { isLoggedIn } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Host Dashboard & Profile
router.get("/host/dashboard", isLoggedIn, wrapAsync(hostController.renderHostDashboard));
router.get("/users/profile", isLoggedIn, wrapAsync(hostController.renderHostDashboard));
router.post("/users/profile", isLoggedIn, upload.single("avatar"), wrapAsync(hostController.updateProfile));

// Guest Trips
router.get("/trips", isLoggedIn, wrapAsync(hostController.renderTrips));

module.exports = router;
