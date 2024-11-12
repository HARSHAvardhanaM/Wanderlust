const Listing = require("./models/listing");
const Review = require("./models/review")
const {reviewSchema,listingSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError")


module.exports.listingSchemaCheck = (req,res,next) =>{
    let { error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(" ");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


module.exports.reviewSchemaCheck = (req,res,next)=> {
    let { error }  = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(" ");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be loggedIn to access this feature");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You donot have permission to make changes");
        return res.redirect(`/listings/${id}`) ;
    }
    next()
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorised");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.updateTrend = async(req,res,next) => { 
    let max = 0 ;
    let orderd = [];
    let allListings = await Listing.find({});
    for(listing of allListings){
        if(listing.clicks){
            if(listing.clicks > max){
                orderd.push(listing);
            }
        }
    }
    orderd.sort((a,b)=>b.clicks - a.clicks);
    req.session.orderd = orderd;
    next();
};