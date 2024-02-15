const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utilis/wrapAsync.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js")
const reviewController=require("../controller/review.js");
// reviews
//post
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.post))
    //delete
    router.delete("/:revID",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.delete))


    module.exports=router;