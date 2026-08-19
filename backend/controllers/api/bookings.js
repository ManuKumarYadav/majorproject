const Booking = require("../../models/booking");
const Listing = require("../../models/listing");
const crypto = require("crypto");
let Razorpay;
try { Razorpay = require("razorpay"); } catch (e) {}

let razorpay = null;
if (Razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
}

module.exports.createOrder = async (req, res) => {
    try {
        const { listingId, checkIn, checkOut, guests, totalNights, totalAmount } = req.body;
        const listing = await Listing.findById(listingId);
        if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });

        const amountInPaise = Math.round(Number(totalAmount) * 100);

        if (razorpay) {
            const options = {
                amount: amountInPaise,
                currency: "INR",
                receipt: `rcpt_${Date.now()}_stayaira`,
                notes: { listingId, listingTitle: listing.title, guestName: req.user ? req.user.username : "Guest" }
            };
            const order = await razorpay.orders.create(options);
            return res.json({
                success: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                keyId: process.env.RAZORPAY_KEY_ID
            });
        } else {
            // Mock order for demo if keys not configured
            return res.json({
                success: true,
                orderId: `mock_order_${Date.now()}`,
                amount: amountInPaise,
                currency: "INR",
                keyId: "rzp_test_mock"
            });
        }
    } catch (err) {
        console.error("API createOrder error:", err);
        res.status(500).json({ success: false, message: err.message || "Failed to create payment order" });
    }
};

module.exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            listingId,
            checkIn,
            checkOut,
            guests,
            totalNights,
            totalAmount,
            guestDetails
        } = req.body;

        const listing = await Listing.findById(listingId);
        if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });

        // Signature check if live keys
        if (razorpay && razorpay_signature) {
            const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
            hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
            const generatedSignature = hmac.digest("hex");
            if (generatedSignature !== razorpay_signature) {
                return res.status(400).json({ success: false, message: "Payment verification failed. Invalid cryptographic signature." });
            }
        }

        const newBooking = new Booking({
            listing: listingId,
            user: req.user ? req.user._id : undefined,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            guests: Number(guests) || 1,
            totalNights: Number(totalNights) || 1,
            totalAmount: Number(totalAmount),
            paymentStatus: "paid",
            paymentId: razorpay_payment_id || `pay_${Date.now()}`,
            orderId: razorpay_order_id || `ord_${Date.now()}`,
            guestName: guestDetails && guestDetails.name ? guestDetails.name : (req.user ? req.user.fullName || req.user.username : "Valued Traveler"),
            guestEmail: guestDetails && guestDetails.email ? guestDetails.email : (req.user ? req.user.email : "guest@stayaira.in"),
            guestPhone: guestDetails && guestDetails.phone ? guestDetails.phone : (req.user ? req.user.phone : "+91 9876543210")
        });

        await newBooking.save();
        const populatedBooking = await Booking.findById(newBooking._id).populate("listing");

        res.status(201).json({ success: true, message: "Booking confirmed successfully!", booking: populatedBooking });
    } catch (err) {
        console.error("API verifyPayment error:", err);
        res.status(500).json({ success: false, message: err.message || "Failed to confirm booking" });
    }
};

module.exports.getMyBookings = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
        const bookings = await Booking.find({ user: req.user._id }).populate("listing").sort({ createdAt: -1 });
        res.json({ success: true, count: bookings.length, bookings });
    } catch (err) {
        console.error("API getMyBookings error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
};
