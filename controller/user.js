const User=require("../models/user.js");
module.exports.formofSignup=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup=async(req,res,next)=>{
    try{
        let{username,email,password}=req.body;
        let data= new User({username,email});
         const regUser=await User.register(data,password);
         req.logIn(regUser,(er)=>{
            if(er){
             return next(er);
            }
            req.flash("success","welcome to wanderlust");
            res.redirect("/listings")
         }); 
    }catch(er){
        req.flash("error",er.message);
        res.redirect("/signup")
    }
}

module.exports.formOfLogin=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.submitlog=async(req,res)=>{
    req.flash("success","welcome to wanderlust")
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl);
    }
   res.redirect("/listings");
}

module.exports.logout=(req,res,next)=>{
    req.logOut((er)=>{
        if(er){
           return next(er);
        }else{
            req.flash("success","you are log out");
            res.redirect("/listings");
        }
    })
    }