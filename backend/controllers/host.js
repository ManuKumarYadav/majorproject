const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Review = require("../models/review");

module.exports.renderHostDashboard = async (req, res) => {
    const activeTab = req.query.tab || "about";
    const user = await User.findById(req.user._id);

    // 1. Fetch listings owned by host
    const myListings = await Listing.find({ owner: req.user._id }).populate("reviews");
    const listingIds = myListings.map(l => l._id);

    // 2. Fetch reservations received on host's listings
    const hostReservations = await Booking.find({ listing: { $in: listingIds } })
        .populate("listing")
        .populate("user")
        .sort({ createdAt: -1 });

    // 3. Fetch past trips booked by this user (as guest)
    const myTrips = await Booking.find({ user: req.user._id })
        .populate("listing")
        .sort({ createdAt: -1 });

    // 4. Calculate KPIs and metrics
    const totalEarnings = hostReservations
        .filter(b => b.status === "confirmed")
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const totalReservations = hostReservations.length;
    const confirmedReservations = hostReservations.filter(b => b.status === "confirmed").length;
    const activeListingsCount = myListings.length;

    // 5. Reviews written by this user
    const reviewsWritten = await Review.find({ author: req.user._id });

    res.render("host/dashboard.ejs", {
        user,
        activeTab,
        myListings,
        hostReservations,
        myTrips,
        totalEarnings,
        totalReservations,
        confirmedReservations,
        activeListingsCount,
        reviewsWritten,
        isHostMode: true
    });
};

module.exports.updateProfile = async (req, res) => {
    try {
        const { fullName, bio, location, work, phone, languages } = req.body;
        const updateData = {
            fullName,
            bio,
            location,
            work,
            phone,
            languages
        };

        if (req.file) {
            updateData.avatar = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        await User.findByIdAndUpdate(req.user._id, updateData);
        req.flash("success", "Profile and photo updated successfully!");
        res.redirect("/host/dashboard?tab=about");
    } catch (err) {
        req.flash("error", "Failed to update profile: " + err.message);
        res.redirect("/host/dashboard?tab=about");
    }
};

module.exports.renderTrips = async (req, res) => {
    res.redirect("/host/dashboard?tab=trips");
};
