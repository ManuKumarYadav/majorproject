const Razorpay = require("razorpay");
const crypto = require("crypto");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

// Initialize Razorpay instance
const getRazorpayInstance = () => {
    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";
    return new Razorpay({
        key_id,
        key_secret,
    });
};

// 1. Create Razorpay Order
module.exports.createOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { checkIn, checkOut, guests } = req.body || {};

        if (!req.user) {
            return res.status(401).json({ success: false, message: "Please log in to make a reservation." });
        }

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found." });
        }

        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        if (!key_id || !key_secret || key_id.includes("your_razorpay")) {
            return res.status(400).json({
                success: false,
                message: "Please add your Razorpay Key ID and Secret in the .env file to enable payments."
            });
        }

        // Calculate nights
        const startDate = checkIn ? new Date(checkIn) : new Date();
        const endDate = checkOut ? new Date(checkOut) : new Date(Date.now() + 86400000 * 2);
        const diffTime = Math.abs(endDate - startDate);
        let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (isNaN(nights) || nights < 1) nights = 1;

        // Minimal Pricing Breakdown
        const basePrice = listing.price || 0;
        const baseTotal = basePrice * nights;
        const cleaningFee = Math.max(50, Math.round(baseTotal * 0.03)); // minimal 3% or ₹50
        const serviceFee = Math.max(30, Math.round(baseTotal * 0.02));  // minimal 2% or ₹30
        const gst = Math.round((baseTotal + cleaningFee + serviceFee) * 0.18);
        const totalAmount = baseTotal + cleaningFee + serviceFee + gst;

        const razorpay = getRazorpayInstance();

        // Create Razorpay Order (amount in paise)
        const options = {
            amount: Math.round(totalAmount * 100), // in paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}_${listing._id.toString().slice(-4)}`,
            notes: {
                listingId: listing._id.toString(),
                listingTitle: listing.title,
                userId: req.user._id.toString(),
                nights: nights.toString(),
            }
        };

        const order = await razorpay.orders.create(options);

        // Pre-save pending booking
        const newBooking = new Booking({
            listing: listing._id,
            user: req.user._id,
            checkIn: startDate,
            checkOut: endDate,
            guests: Number(guests) || 1,
            nights,
            totalAmount,
            razorpayOrderId: order.id,
            status: "pending",
        });
        await newBooking.save();

        return res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
            bookingId: newBooking._id,
            listingTitle: listing.title,
            user: {
                name: req.user.username,
                email: req.user.email || "guest@stayaira.com",
            }
        });

    } catch (error) {
        console.error("Razorpay Order Creation Error:", error);
        const errMsg = error.error?.description || error.description || error.message || "Failed to initiate payment.";
        return res.status(500).json({
            success: false,
            message: errMsg,
        });
    }
};

// 2. Verify Payment Signature & Confirm Booking
module.exports.verifyPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingId
        } = req.body;

        const key_secret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";

        // Generate HMAC signature verification
        const generatedSignature = crypto
            .createHmac("sha256", key_secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature === razorpay_signature) {
            // Update booking status
            const booking = await Booking.findById(bookingId).populate("listing").populate("user");
            if (booking) {
                booking.razorpayPaymentId = razorpay_payment_id;
                booking.razorpaySignature = razorpay_signature;
                booking.status = "confirmed";
                await booking.save();
            }

            req.flash("success", "🎉 Payment successful! Your reservation is confirmed.");
            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                redirectUrl: `/listings/${id}/booking-success/${bookingId}`,
            });
        } else {
            // If signatures do not match
            await Booking.findByIdAndUpdate(bookingId, { status: "failed" });
            return res.status(400).json({
                success: false,
                message: "Payment verification failed. Invalid signature.",
            });
        }

    } catch (error) {
        console.error("Razorpay Verification Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Payment verification error.",
        });
    }
};

// 3. Render Booking Confirmation Screen
module.exports.renderBookingSuccess = async (req, res) => {
    const { id, bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate("listing").populate("user");
    if (!booking) {
        req.flash("error", "Booking record not found.");
        return res.redirect(`/listings/${id}`);
    }
    res.render("listings/booking-success.ejs", { booking });
};
