const User = require("../../models/user");
const passport = require("passport");

module.exports.getCurrentUser = async (req, res) => {
    res.json({
        success: true,
        user: req.user ? {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            fullName: req.user.fullName,
            avatar: req.user.avatar,
            bio: req.user.bio,
            location: req.user.location,
            work: req.user.work,
            phone: req.user.phone
        } : null,
        firebaseConfig: {
            apiKey: (process.env.FIREBASE_API_KEY || "").trim().replace(/^[\"']|[\"']$/g, ''),
            authDomain: (process.env.FIREBASE_AUTH_DOMAIN || "").trim().replace(/^[\"']|[\"']$/g, ''),
            projectId: (process.env.FIREBASE_PROJECT_ID || "").trim().replace(/^[\"']|[\"']$/g, ''),
            storageBucket: (process.env.FIREBASE_STORAGE_BUCKET || "").trim().replace(/^[\"']|[\"']$/g, ''),
            messagingSenderId: (process.env.FIREBASE_MESSAGING_SENDER_ID || "").trim().replace(/^[\"']|[\"']$/g, ''),
            appId: (process.env.FIREBASE_APP_ID || "").trim().replace(/^[\"']|[\"']$/g, ''),
            measurementId: (process.env.FIREBASE_MEASUREMENT_ID || "").trim().replace(/^[\"']|[\"']$/g, '')
        },
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || ""
    });
};

module.exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ success: false, message: info ? info.message : "Invalid credentials" });
        }
        req.login(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            return res.json({
                success: true,
                message: `Welcome back, ${user.fullName || user.username}!`,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    avatar: user.avatar
                }
            });
        });
    })(req, res, next);
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        username = (username || "").trim();
        email = (email || "").trim().toLowerCase();
        password = (password || "").trim();

        if (!username || username.length < 3) {
            return res.status(400).json({ success: false, message: "Username must be at least 3 characters." });
        }
        if (!email || !email.includes("@")) {
            return res.status(400).json({ success: false, message: "Please provide a valid email address." });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: "An account with this email already exists. Please sign in instead." });
        }

        const newUser = new User({
            email,
            username,
            fullName: username.replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        });

        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            res.status(201).json({
                success: true,
                message: `Welcome to StayAira, ${registeredUser.username}!`,
                user: {
                    _id: registeredUser._id,
                    username: registeredUser.username,
                    email: registeredUser.email,
                    fullName: registeredUser.fullName
                }
            });
        });
    } catch (e) {
        res.status(400).json({ success: false, message: e.message || "Registration failed" });
    }
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ success: false, message: "Logout failed" });
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.json({ success: true, message: "Logged out successfully" });
        });
    });
};

module.exports.firebaseGoogleAuth = async (req, res) => {
    try {
        const { email, displayName, photoURL, uid } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required from Google account." });
        }

        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            if (!user.googleId) user.googleId = uid;
            if (!user.fullName && displayName) user.fullName = displayName;
            if ((!user.avatar || !user.avatar.url) && photoURL) {
                user.avatar = { url: photoURL, filename: "google_avatar" };
            }
            await user.save();
        } else {
            let baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
            if (!baseUsername || baseUsername.length < 3) baseUsername = "stayaira_user";
            let username = baseUsername;
            let count = 1;
            while (await User.findOne({ username })) {
                username = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;
                count++;
                if (count > 30) break;
            }

            user = new User({
                email: email.toLowerCase(),
                username,
                fullName: displayName || username,
                googleId: uid,
                avatar: photoURL ? { url: photoURL, filename: "google_avatar" } : undefined
            });

            await User.register(user, uid + "_stayaira_oauth_pwd");
        }

        req.login(user, (err) => {
            if (err) return res.status(500).json({ success: false, message: "Session login failed." });
            res.json({
                success: true,
                message: `Signed in as ${user.fullName || user.username}`,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    avatar: user.avatar
                }
            });
        });
    } catch (err) {
        console.error("API Firebase Google Auth Error:", err);
        res.status(500).json({ success: false, message: "Google authentication failed on server." });
    }
};

module.exports.checkEmailExists = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !email.includes("@")) {
            return res.json({ valid: false, message: "Please enter a valid email address." });
        }
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            return res.json({ valid: false, message: "No account found with that email address." });
        }
        return res.json({ valid: true });
    } catch (err) {
        return res.json({ valid: false, message: "Server error. Please try again." });
    }
};

module.exports.resetPasswordDirect = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        if (!email || !password || password.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters." });
        }
        if (password !== confirmPassword) {
            return res.json({ success: false, message: "Passwords do not match." });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            return res.json({ success: false, message: "Account not found." });
        }

        await new Promise((resolve, reject) => {
            user.setPassword(password, (err, updatedUser) => {
                if (err) return reject(err);
                user.hash = updatedUser.hash;
                user.salt = updatedUser.salt;
                resolve();
            });
        });

        user.markModified('hash');
        user.markModified('salt');
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.json({ success: true, message: "Password updated successfully!" });
    } catch (err) {
        console.error("API resetPasswordDirect error:", err);
        return res.json({ success: false, message: "Server error. Please try again." });
    }
};

module.exports.updateProfile = async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ success: false, message: "Please log in." });
        }
        const { fullName, bio, location, work, phone } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        if (fullName !== undefined) user.fullName = fullName;
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        if (work !== undefined) user.work = work;
        if (phone !== undefined) user.phone = phone;

        // If a new avatar was uploaded via multer + cloudinary
        if (req.file) {
            user.avatar = { url: req.file.path, filename: req.file.filename };
        }

        await user.save();

        // Refresh session user
        req.login(user, (err) => {
            if (err) return res.status(500).json({ success: false, message: "Session refresh failed." });
            return res.json({
                success: true,
                message: "Profile updated successfully!",
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    avatar: user.avatar,
                    bio: user.bio,
                    location: user.location,
                    work: user.work,
                    phone: user.phone,
                }
            });
        });
    } catch (err) {
        console.error("updateProfile error:", err);
        return res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
};
