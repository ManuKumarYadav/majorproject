const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    googleId: {
        type: String,
        default: null,
    },
    fullName: {
        type: String,
        default: ""
    },
    avatar: {
        url: String,
        filename: String,
    },
    bio: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    work: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    languages: {
        type: String,
        default: "English, Hindi"
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);