let {data} = require("./data.js");
let mongoose = require("mongoose");
let Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

main()
.then(()=>{console.log("DB connected sucessfully")})
.catch((err)=>{console.log(err)})

const init = async()=>{
    await Listing.deleteMany({});
    data = data.map((obj) => ({...obj,owner : '6729ed4f0e68318071e21e58' }));
    Listing.insertMany(data)
    .then(()=>{console.log("Data inserted successfully")})
}

init()
