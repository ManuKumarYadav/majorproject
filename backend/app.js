const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const cors = require("cors");
const compression = require("compression");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/user.js");
const apiRouter = require("./routes/api/index.js");

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    if (!dbUrl) {
        console.error("ATLASDB_URL not found in .env");
        return;
    }
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB Atlas");
}
main().catch(err => console.error("MongoDB Connection Error:", err));

// Enable CORS for React Vite Frontend
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:8080", "http://127.0.0.1:5173"],
    credentials: true
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.error("Error in Mongo Session store:", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Dual Login Strategy: Allows sign-in via Username OR Email (case-insensitive)
passport.use(new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (usernameOrEmail, password, done) => {
        try {
            const input = (usernameOrEmail || "").trim();
            if (!input) {
                return done(null, false, { message: "Please enter your username or email address." });
            }

            // Search by username or email case-insensitively
            const escapedInput = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const user = await User.findOne({
                $or: [
                    { username: new RegExp(`^${escapedInput}$`, 'i') },
                    { email: new RegExp(`^${escapedInput}$`, 'i') }
                ]
            });

            if (!user) {
                return done(null, false, { message: "No account found matching that username or email." });
            }

            // Verify password via passport-local-mongoose
            user.authenticate(password, (err, authenticatedUser, passwordErr) => {
                if (err) return done(err);
                if (!authenticatedUser) {
                    return done(null, false, { message: "Incorrect password. Please try again." });
                }
                return done(null, authenticatedUser);
            });
        } catch (err) {
            return done(err);
        }
    }
));

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists with this googleId
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                return done(null, user);
            }

            // Check if user exists with the same email
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            if (email) {
                user = await User.findOne({ email });
                if (user) {
                    user.googleId = profile.id;
                    if (!user.avatar || !user.avatar.url) {
                        user.avatar = {
                            url: profile.photos && profile.photos[0] ? profile.photos[0].value : "",
                            filename: "google_avatar"
                        };
                    }
                    if (!user.fullName && profile.displayName) {
                        user.fullName = profile.displayName;
                    }
                    await user.save();
                    return done(null, user);
                }
            }

            // Create new user for first-time Google sign-in
            let baseUsername = profile.displayName ? profile.displayName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() : "user";
            if (!baseUsername) baseUsername = "user";
            let username = baseUsername;
            let count = 1;
            while (await User.findOne({ username })) {
                username = `${baseUsername}${Math.floor(100 + Math.random() * 900)}`;
                count++;
                if (count > 20) break;
            }

            const newUser = new User({
                googleId: profile.id,
                email: email || `${profile.id}@gmail.com`,
                username: username,
                fullName: profile.displayName || "",
                avatar: {
                    url: profile.photos && profile.photos[0] ? profile.photos[0].value : "",
                    filename: "google_avatar"
                }
            });

            await newUser.save();
            return done(null, newUser);
        } catch (err) {
            return done(err, null);
        }
    }));
}

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    res.locals.currentPath = req.path;
    res.locals.isHostMode = req.path.startsWith("/host") || req.query.context === "host";
    res.locals.firebaseConfig = {
        apiKey: (process.env.FIREBASE_API_KEY || "").trim().replace(/^["']|["']$/g, ''),
        authDomain: (process.env.FIREBASE_AUTH_DOMAIN || "").trim().replace(/^["']|["']$/g, ''),
        projectId: (process.env.FIREBASE_PROJECT_ID || "").trim().replace(/^["']|["']$/g, ''),
        storageBucket: (process.env.FIREBASE_STORAGE_BUCKET || "").trim().replace(/^["']|["']$/g, ''),
        messagingSenderId: (process.env.FIREBASE_MESSAGING_SENDER_ID || "").trim().replace(/^["']|["']$/g, ''),
        appId: (process.env.FIREBASE_APP_ID || "").trim().replace(/^["']|["']$/g, ''),
        measurementId: (process.env.FIREBASE_MEASUREMENT_ID || "").trim().replace(/^["']|["']$/g, '')
    };
    next();
});

// app.get("/demouser", async (req,res)=>{
//     let fakeUser = new User({
//         email: "fakeuser@example.com",
//         username: "delta-student"
const fs = require("fs");

// REST API Routes for React SPA
app.use("/api", apiRouter);

// Fallback to React SPA for all frontend client-side routes
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, message: "API endpoint not found" });
    }
    const indexPath = path.resolve(__dirname, "..", "frontend", "dist", "index.html");
    if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }
    return res.status(404).json({ success: false, message: "Frontend is not deployed with this backend" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).json({ success: false, message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`StayAira API Server is running on port ${PORT}`);
});
