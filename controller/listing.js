const { isLoggedIn } = require("../middleware.js");
const Listing = require("../models/listing");
let ExpressError = require("../utils/ExpressError.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listing/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("./listing/new.ejs")
};

module.exports.createNewListing = async (req,res)=>{
    const response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();

    console.log(req.body)
    let listing = req.body.listing;
    let url = req.file.path;
    let filename = req.file.filename
    let newListing = new Listing(listing);
    newListing.image = {url,filename}
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
    newListing.clicks = 0;
    await newListing.save()
    .then(()=>{console.log("Data saved")});
    req.flash("successMsg","Listing added successfully");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let oneList = await Listing.findById(id);
    if(!oneList){
        req.flash("errorMsg","Listing you are looking for is not found");
        return res.redirect("/listings");
    }
    let originalImageUrl = oneList.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_200,w_270")
    res.render("./listing/edit.ejs",{oneList , originalImageUrl});
};

module.exports.editListing = async (req,res)=>{
    const response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();

    let {id} = req.params;
    let update = req.body.listing;
    if(!update){
        throw new ExpressError(400,"Bad request");
    }
    let updatedListing = await Listing.findByIdAndUpdate(id,update);
    updatedListing.geometry = response.body.features[0].geometry;
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url,filename};
        updatedListing.save()
        }
    req.flash("successMsg","Listing updated successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("successMsg","Listing deleted successfully");
    return res.redirect("/listings");
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    let oneList = await Listing.findById(id).populate({path : "review", populate :{ path : "author"}}).populate({path : "owner"});
    if(!oneList){
        req.flash("errorMsg","Listing you are looking for is not found");
        return res.redirect("/listings");
    }
    if(res.locals.currUser){if(!oneList.clicks){
        oneList.clicks = 1;
    }
    else{
        oneList.clicks++
    }
    oneList.save();}
    res.render("./listing/show.ejs",{oneList})
};

module.exports.searchListings = async(req,res)=>{
    let place = (req.query.place);
    const places = await Listing.find({country : place});
    res.render("./listing/search.ejs",{places})
};

module.exports.trendingListing = async(req,res)=>{
    let orderd = req.session.orderd;
    if(! orderd == []){
    let listings = [...orderd];
    res.render("./listing/trending.ejs",{listings})
}
    else{
        res.redirect("/listings")
    }
};