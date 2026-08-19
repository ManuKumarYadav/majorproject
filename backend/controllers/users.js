const User = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        
        username = (username || "").trim();
        email = (email || "").trim().toLowerCase();
        password = (password || "").trim();

        if (!username || username.length < 3) {
            req.flash("error", "Username must be at least 3 characters long.");
            return res.redirect("/signup");
        }

        if (!email || !email.includes("@")) {
            req.flash("error", "Please provide a valid email address.");
            return res.redirect("/signup");
        }

        if (!password || password.length < 6) {
            req.flash("error", "Password must be at least 6 characters long.");
            return res.redirect("/signup");
        }

        // Check if an account with this email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            req.flash("error", "An account with this email address already exists. Please sign in instead.");
            return res.redirect("/login");
        }

        const newUser = new User({ 
            email, 
            username,
            fullName: username.replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        });

        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", `Welcome to StayAira, ${registeredUser.username}!`);
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message || "Registration failed. Please try again.");
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to StayAira!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
};

// ============================================
// FORGOT PASSWORD
// ============================================

module.exports.renderForgotForm = (req, res) => {
    res.render("users/forgot-password.ejs");
};

// INLINE STEP 1: Check if email exists in DB (JSON API)
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

// INLINE STEP 2: Directly set new password without token (JSON API)
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

        // setPassword() sets new salt+hash on the user object
        // We must await it properly and then save
        await new Promise((resolve, reject) => {
            user.setPassword(password, (err, updatedUser) => {
                if (err) return reject(err);
                // Copy new hash and salt back to user object
                user.hash = updatedUser.hash;
                user.salt = updatedUser.salt;
                resolve();
            });
        });

        // Mark hash and salt as modified so mongoose saves them
        user.markModified('hash');
        user.markModified('salt');

        // Clear any pending reset tokens
        user.resetPasswordToken   = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        console.log(`[resetPasswordDirect] Password updated for: ${email}`);
        return res.json({ success: true });
    } catch (err) {
        console.error("resetPasswordDirect error:", err);
        return res.json({ success: false, message: "Server error. Please try again." });
    }
};

module.exports.sendResetEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            req.flash("error", "No account found with that email address.");
            return res.redirect("/forgot-password");
        }

        // Generate secure token
        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${token}`;

        // Send email if EMAIL_USER and EMAIL_PASS are configured
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // SSL
                auth: {
                    user: process.env.EMAIL_USER.trim(),
                    pass: process.env.EMAIL_PASS.trim().replace(/\s+/g, ""), // strip spaces from App Password
                },
            });

            const mailOptions = {
                from: `"StayAira" <${process.env.EMAIL_USER.trim()}>`,
                to: user.email,
                subject: "StayAira — Reset Your Password",
                html: `
                    <div style="max-width: 520px; margin: 0 auto; font-family: 'Segoe UI', Arial, sans-serif; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0;">
                        <div style="background: linear-gradient(135deg, #E11D48 0%, #FB7185 100%); padding: 32px 28px; text-align: center;">
                            <h1 style="color: #FFFFFF; font-size: 1.5rem; margin: 0 0 6px 0;">🔐 Password Reset</h1>
                            <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem; margin: 0;">StayAira Account Recovery</p>
                        </div>
                        <div style="padding: 28px;">
                            <p style="color: #334155; line-height: 1.6; margin-bottom: 16px;">Hi <strong>${user.fullName || user.username}</strong>,</p>
                            <p style="color: #64748B; line-height: 1.6; margin-bottom: 24px;">We received a request to reset the password for your StayAira account. Click the button below to choose a new password:</p>
                            <div style="text-align: center; margin-bottom: 24px;">
                                <a href="${resetUrl}" style="display: inline-block; background: #E11D48; color: #FFFFFF; padding: 14px 36px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 1rem; box-shadow: 0 4px 14px rgba(225, 29, 72, 0.3);">Reset My Password</a>
                            </div>
                            <p style="color: #94A3B8; font-size: 0.85rem; line-height: 1.5;">This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.</p>
                            <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 20px 0;">
                            <p style="color: #94A3B8; font-size: 0.78rem; text-align: center;">If the button doesn't work, copy and paste this link:<br><a href="${resetUrl}" style="color: #E11D48; word-break: break-all;">${resetUrl}</a></p>
                        </div>
                    </div>
                `,
            };

            try {
                await transporter.sendMail(mailOptions);
                req.flash("success", "✅ A password reset link has been sent to your email address. Please check your inbox (and spam folder).");
            } catch (mailErr) {
                console.error("Email send error:", mailErr.message);
                // Fallback: show link in terminal but still tell user to check console
                console.log("\n=================================");
                console.log("🔑 PASSWORD RESET LINK (EMAIL FAILED - DEV FALLBACK):");
                console.log(resetUrl);
                console.log("Email error:", mailErr.message);
                console.log("=================================\n");
                req.flash("error", `Email sending failed: ${mailErr.message}. Check your Gmail App Password in .env`);
            }
        } else {
            console.log("\n=================================");
            console.log("🔑 PASSWORD RESET LINK (DEV MODE - No email configured):");
            console.log(resetUrl);
            console.log("=================================");
            console.log("👉 To enable real emails, add EMAIL_USER and EMAIL_PASS (Gmail App Password) to your .env file");
            console.log("=================================\n");
            req.flash("success", "⚠️ No email configured. Check your terminal/console for the reset link (DEV MODE).");
        }

        res.redirect("/forgot-password");
    } catch (err) {
        console.error("Forgot password error:", err);
        req.flash("error", "Something went wrong. Please try again later.");
        res.redirect("/forgot-password");
    }
};

// ============================================
// RESET PASSWORD
// ============================================

module.exports.renderResetForm = async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        req.flash("error", "Password reset link is invalid or has expired.");
        return res.redirect("/forgot-password");
    }

    res.render("users/reset-password.ejs", { token });
};

module.exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            req.flash("error", "Passwords do not match.");
            return res.redirect(`/reset-password/${token}`);
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            req.flash("error", "Password reset link is invalid or has expired.");
            return res.redirect("/forgot-password");
        }

        // passport-local-mongoose setPassword method
        await user.setPassword(password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Auto-login after reset
        req.login(user, (err) => {
            if (err) {
                req.flash("error", "Password reset successful, but auto-login failed. Please login manually.");
                return res.redirect("/login");
            }
            req.flash("success", "Your password has been reset successfully! You are now logged in.");
            res.redirect("/listings");
        });
    } catch (err) {
        console.error("Reset password error:", err);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/forgot-password");
    }
};

// ============================================
// GOOGLE OAUTH CALLBACK
// ============================================

module.exports.googleCallback = (req, res) => {
    req.flash("success", `Welcome back, ${req.user.fullName || req.user.username}! Signed in with Google.`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// ============================================
// FIREBASE GOOGLE AUTH (CLIENT-SIDE POPUP HANDLER)
// ============================================

module.exports.firebaseGoogleAuth = async (req, res) => {
    try {
        const { email, displayName, photoURL, uid } = req.body;

        if (!email && !uid) {
            return res.status(400).json({ success: false, message: "Missing email or user ID from Firebase." });
        }

        // 1. Search for existing user by googleId/uid
        let user = null;
        if (uid) {
            user = await User.findOne({ googleId: uid });
        }

        // 2. If not found by googleId, check by email
        if (!user && email) {
            user = await User.findOne({ email });
            if (user) {
                user.googleId = uid;
                if (!user.avatar || !user.avatar.url) {
                    user.avatar = {
                        url: photoURL || "",
                        filename: "firebase_google_avatar"
                    };
                }
                if (!user.fullName && displayName) {
                    user.fullName = displayName;
                }
                await user.save();
            }
        }

        // 3. If new user, create account
        if (!user) {
            let baseUsername = (displayName || email.split("@")[0] || "user")
                .replace(/[^a-zA-Z0-9]/g, "")
                .toLowerCase();
            if (!baseUsername) baseUsername = "user";
            let username = baseUsername;
            let count = 1;
            while (await User.findOne({ username })) {
                username = `${baseUsername}${Math.floor(100 + Math.random() * 900)}`;
                count++;
                if (count > 20) break;
            }

            user = new User({
                googleId: uid,
                email: email || `${uid}@gmail.com`,
                username: username,
                fullName: displayName || "",
                avatar: {
                    url: photoURL || "",
                    filename: "firebase_google_avatar"
                }
            });
            await user.save();
        }

        // 4. Establish Passport session
        req.login(user, (err) => {
            if (err) {
                console.error("Firebase Login session error:", err);
                return res.status(500).json({ success: false, message: "Session creation failed." });
            }
            req.flash("success", `Welcome back, ${user.fullName || user.username}! Signed in with Google.`);
            const redirectUrl = req.session.redirectUrl || "/listings";
            delete req.session.redirectUrl;
            return res.json({ success: true, redirectUrl });
        });
    } catch (err) {
        console.error("Firebase Google Auth Error:", err);
        return res.status(500).json({ success: false, message: err.message || "Authentication failed." });
    }
};


