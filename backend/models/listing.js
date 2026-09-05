const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    image: {
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
        },
        filename: String,
    },
    price: {
        type: Number,
        default: 5000,
    },
    location: {
        type: String,
        default: "Goa",
    },
    country: {
        type: String,
        default: "India",
    },
    category: {
        type: String,
        default: "Luxury Villas",
    },
    propertyType: {
        type: String,
        default: "Villa",
    },
    roomsCount: {
        type: String,
        default: "3-4 Rooms",
    },
    contactPhone: {
        type: String,
        default: "7352966256",
    },
    isApproved: {
        type: Boolean,
        default: true,
    },
    status: {
        type: String,
        enum: ["active", "pending", "draft"],
        default: "active",
    },
    coordinates: {
        lat: Number,
        lng: Number,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
