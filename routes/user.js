const express = require("express");
const router = express.Router({mergeParams : true});
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controller/user")

router.route("/signup")
.get( userController.renderNewUserForm)
.post( wrapAsync(userController.saveUser));

router.route("/login")
.get( userController.renderLoginForm)
.post( saveRedirectUrl,
    passport.authenticate("local",{failureRedirect : "/login" , failureFlash : true}),
    userController.loginUser);

router.get("/logout",userController.logout);

router.post("/:userid/savelikes",async(req,res)=>{
    const {userid} = req.params;
    const {liked} = req.body
    let user = await User.findById(userid);
    user.liked=[];
    if(liked[0]){
        user.liked = liked.map((like)=>like);  
    }
    await user.save()
})

module.exports = router;