const Listing = require("../../models/listing");

module.exports.index = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, sort } = req.query;
        let query = {};

        if (category && category !== "All" && category !== "Trending") {
            query.category = { $regex: new RegExp(category, "i") };
        }

        if (search && search.trim() !== "") {
            const regex = new RegExp(search.trim(), "i");
            query.$or = [
                { title: regex },
                { location: regex },
                { country: regex },
                { category: regex }
            ];
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let listingsQuery = Listing.find(query).populate("owner", "username fullName email avatar");

        if (sort === "price_asc") listingsQuery = listingsQuery.sort({ price: 1 });
        else if (sort === "price_desc") listingsQuery = listingsQuery.sort({ price: -1 });
        else if (sort === "newest") listingsQuery = listingsQuery.sort({ _id: -1 });

        const listings = await listingsQuery.exec();
        res.json({ success: true, count: listings.length, listings });
    } catch (err) {
        console.error("API listings index error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch listings" });
    }
};

module.exports.showListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: { path: "author", select: "username fullName avatar createdAt" }
            })
            .populate("owner", "username fullName email avatar bio work location phone createdAt");

        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }

        res.json({ success: true, listing });
    } catch (err) {
        console.error("API showListing error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch listing details" });
    }
};

module.exports.createListing = async (req, res) => {
    try {
        let url = req.file ? req.file.path : (req.body.listing && req.body.listing.image ? req.body.listing.image.url : (req.body.image || ""));
        let filename = req.file ? req.file.filename : "listingimage";

        let listingData = req.body.listing || req.body;
        if (typeof listingData === "string") listingData = JSON.parse(listingData);

        const newListing = new Listing(listingData);
        newListing.owner = req.user._id;
        
        if (url) {
            newListing.image = { url, filename };
        }

        await newListing.save();
        const savedListing = await Listing.findById(newListing._id).populate("owner", "username fullName email avatar");

        res.status(201).json({ success: true, message: "Listing created successfully!", listing: savedListing });
    } catch (err) {
        console.error("API createListing error:", err);
        res.status(400).json({ success: false, message: err.message || "Failed to create listing" });
    }
};

module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        let listingData = req.body.listing || req.body;
        if (typeof listingData === "string") listingData = JSON.parse(listingData);

        let listing = await Listing.findByIdAndUpdate(id, { ...listingData }, { new: true });

        if (req.file) {
            listing.image = { url: req.file.path, filename: req.file.filename };
            await listing.save();
        }

        const updatedListing = await Listing.findById(id).populate("owner", "username fullName email avatar");
        res.json({ success: true, message: "Listing updated successfully!", listing: updatedListing });
    } catch (err) {
        console.error("API updateListing error:", err);
        res.status(400).json({ success: false, message: err.message || "Failed to update listing" });
    }
};

module.exports.destroyListing = async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.json({ success: true, message: "Listing deleted successfully!" });
    } catch (err) {
        console.error("API destroyListing error:", err);
        res.status(500).json({ success: false, message: "Failed to delete listing" });
    }
};
