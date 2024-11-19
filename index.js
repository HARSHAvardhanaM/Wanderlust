if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
let app = express();
let path = require("path");
var methodOverride = require('method-override');
let ejsmate = require("ejs-mate");
let ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});

store.on("error",()=>{
    console.log("Error in mongo-session")
});

const  sessionInfo = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 *60 * 1000,
        httpOnly : true,
    }
};

app.use(session(sessionInfo));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(express.json())
app.use(methodOverride('_method'));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public/css")));
app.use(express.static(path.join(__dirname,"/public/js")));

const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

let port = 3000;

async function main(next,req,res){
    await mongoose.connect(dbUrl);
};

main()
.then(()=>{console.log("DB connected sucessfully")})
.catch((err)=>{console.log(err);});

app.get("/",(req,res)=>{
    res.render("./listing/model.ejs");
});

// app.get("/fakeUser",async (req,res)=>{
//     const fakeUser = new User({
//         email : "asdf@gmail.com",
//         username : "asdf"
//     });

//     let user = await User.register(fakeUser,"asdfpass");
//     res.send(user);
// })

app.use("/listings/:id/review",reviewsRoute);
app.use("/listings",listingsRoute);
app.use("/",userRoute);


app.listen(port,(req,res)=>{
    console.log("Listening on pot number : ",port)
});

app.all("*",(req,res,next)=>{
    throw new ExpressError(404,"Page not found");
});

//Error MiddleWare

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"} = err;
    res.status(status).render("./listing/error.ejs",{message});
})

