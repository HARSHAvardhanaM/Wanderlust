const Listing = require("../models/listing");
const Review = require("../models/review");
let ExpressError = require("../utils/ExpressError.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.newReview = async (req,res)=>{
    
    let {id} = req.params;
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    let listing = await Listing.findById(id);
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("Review saved");
    req.flash("successMsg","Review saved successfully");
    res.redirect(`/listings/${id}`)
};

module.exports.deleteReview = async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {review : reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash("successMsg","Review deleted successfully");
    res.redirect(`/listings/${id}`);
}