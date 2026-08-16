const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
title: {
    type: String,
    required:true,
},
description: String,
image: {
    type: String,
    default:
         "https://www.pexels.com/photo/brown-wooden-dock-414612/",
    set: (v) =>
        v==="" 
    ? "https://www.pexels.com/photo/brown-wooden-dock-414612/" : v,
},
price:Number,
location:String,
country:String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
