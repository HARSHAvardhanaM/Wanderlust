const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
var methodOverride = require('method-override');
let wrapAsync = require("../utils/wrapAsync.js");
let ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {isLoggedIn, isOwner, listingSchemaCheck} = require("../middleware.js");
const passport = require("passport");
const multer = require("multer");
const {storage} =require("../cloudinaryConfig.js")
const upload = multer({storage})
const listingController = require("../controller/listing.js");
const {updateTrend} = require("../middleware.js");

router.route("/")
.get(updateTrend,wrapAsync(listingController.index))
.post(updateTrend,isLoggedIn,upload.single("listing[image]"),listingSchemaCheck,wrapAsync(listingController.createNewListing));

// new route
router.get("/new",updateTrend,isLoggedIn,listingController.renderNewForm);

router.get("/search",listingController.searchListings)

router.get("/trending",listingController.trendingListing)

router.route("/:id")
.patch(updateTrend,upload.single("listing[image]"),wrapAsync(listingController.editListing))
.delete(updateTrend,isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))
.get(updateTrend,wrapAsync(listingController.showListing))


// edit route

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;