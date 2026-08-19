const Review = require("../../models/review");
const Listing = require("../../models/listing");

module.exports.createReview = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });

        const reviewData = req.body.review || req.body;
        const newReview = new Review(reviewData);
        newReview.author = req.user._id;

        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();

        const populatedReview = await Review.findById(newReview._id).populate("author", "username fullName avatar");
        res.status(201).json({ success: true, message: "Review added successfully!", review: populatedReview });
    } catch (err) {
        console.error("API createReview error:", err);
        res.status(400).json({ success: false, message: err.message || "Failed to create review" });
    }
};

module.exports.destroyReview = async (req, res) => {
    try {
        const { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        res.json({ success: true, message: "Review deleted successfully!" });
    } catch (err) {
        console.error("API destroyReview error:", err);
        res.status(500).json({ success: false, message: "Failed to delete review" });
    }
};
