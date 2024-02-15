const ExpressError=require("./utilis/ExpressError.js");
const {listingSchema}=require("./schema.js")
const {reviewSchema}=require("./schema.js")
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
module.exports.isLoggedIn=(req,res,next)=>{
  // console.log(req.user);
    if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl
        req.flash("error","please log in first");
     return res.redirect("/login")
      }else{
        next()
      }
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl
  }
  next();
}

module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let  listing= await Listing.findById(id);
     if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","you are not the owner of the route")
    return  res.redirect(`/listings/${id}`);
     }
     next();
}
module.exports.validateListing=(req,res,next)=>{
  let {error}= listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",")
   throw new ExpressError(400,errMsg)
  }else{
next()
  }
}
module.exports.validateReview=(req,res,next)=>{
  let {error}= reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",")
   throw new ExpressError(400,errMsg)
  }else{
next()
  }}

  module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,revID}=req.params;
    let review= await Review.findById(revID);
       if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of the review")
      return  res.redirect(`/listings/${id}`);
       }
       next();
  }