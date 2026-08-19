const Listing = require("../../models/listing");
const Booking = require("../../models/booking");

module.exports.getDashboard = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

        const myListings = await Listing.find({ owner: req.user._id }).populate("reviews");
        const listingIds = myListings.map(l => l._id);

        const myBookings = await Booking.find({ listing: { $in: listingIds } }).populate("listing").populate("user", "username fullName email").sort({ createdAt: -1 });

        const totalEarnings = myBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
        const totalGuests = myBookings.reduce((sum, b) => sum + (b.guests || 1), 0);
        
        let totalRating = 0;
        let reviewCount = 0;
        myListings.forEach(l => {
            if (l.reviews && l.reviews.length > 0) {
                l.reviews.forEach(r => {
                    totalRating += (r.rating || 5);
                    reviewCount++;
                });
            }
        });
        const averageRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : "5.0";

        res.json({
            success: true,
            stats: {
                totalListings: myListings.length,
                totalBookings: myBookings.length,
                totalEarnings,
                totalGuests,
                averageRating,
                reviewCount
            },
            listings: myListings,
            bookings: myBookings
        });
    } catch (err) {
        console.error("API getDashboard error:", err);
        res.status(500).json({ success: false, message: "Failed to load host dashboard data" });
    }
};
