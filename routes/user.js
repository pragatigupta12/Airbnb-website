const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utilis/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userModel=require("../controller/user.js");
router.route("/signup")
.get(userModel.formofSignup)
.post(wrapAsync(userModel.signup));

router.route("/login")
.get(userModel.formOfLogin)
.post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login',failureFlash:true })
,wrapAsync(userModel.submitlog))

router.get("/logout",userModel.logout)

module.exports=router;