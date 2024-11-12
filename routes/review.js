const express = require("express");
const router = express.Router({mergeParams : true});
let Review = require('../models/review.js');
const Listing = require("../models/listing");
var methodOverride = require('method-override');
let wrapAsync = require("../utils/wrapAsync.js");
let ExpressError = require("../utils/ExpressError.js");
const { reviewSchemaCheck, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controller/review.js")


//Review
//Post Review

router.post("/",isLoggedIn,reviewSchemaCheck,wrapAsync(reviewController.newReview));

//Delete Review

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;