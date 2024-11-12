const { ref, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");

let userSchema = mongoose.Schema({
    title :{
        type : String,
        required : true
    },
    description :{
        type : String,
        required : true
    },
    image : {
        url : String,
        filename : String
    },
    price :{
        type : Number,
        required : true
    },
    clicks : {
        type : Number,
      },
    location :{
        type : String,
        required : true
    },
    country :{
        type : String,
        required : true
    },
    review : [{
        type : Schema.Types.ObjectId,
        ref : "Review"
    }],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    geometry :{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
});

userSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.review}})
    }
});

let Listing = mongoose.model("Listing",userSchema);

module.exports = Listing;