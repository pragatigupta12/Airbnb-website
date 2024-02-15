const Review=require("../models/review.js");
const Listing=require("../models/listing.js")
module.exports.post=async(req,res)=>{
    let listing=await Listing.findById(req.params.id)
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","data was saved")
    res.redirect(`/listings/${req.params.id}`)
    }

    module.exports.delete=async(req,res)=>{
        let{id,revID}=req.params;
        await Listing.findByIdAndUpdate(id,{$pull: {reviews:revID}})
        await Review.findByIdAndDelete(revID);
        req.flash("success","data was deleted")
        res.redirect(`/listings/${id}`);
        }