const User = require("../models/user");
let ExpressError = require("../utils/ExpressError");

module.exports.renderNewUserForm = (req,res)=>{
    res.render("./user/signup.ejs");
}

module.exports.saveUser = async(req,res,next)=>{
    try{let {username,email,password} = req.body;
    const user = new User({username,email});
    let registerdUser = await User.register(user,password);
    req.login(registerdUser,(err)=>{
        if(err){
                return next(err)
            }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
        })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("./user/login.ejs");
}

module.exports.loginUser = async(req,res)=>{
    const redirectUrl = res.locals.redirectUrl || '/listings';
    req.flash("success","Welcome back to Wanderlust")
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logedout successfully");
        res.redirect("/listings")
    });
}