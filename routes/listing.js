const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utilis/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js")
const listingController=require("../controller/listing.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.create))

    //new
    router.get("/new",isLoggedIn,(listingController.new))

router.route("/:id")
.patch(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.update))
.get(wrapAsync(listingController.show))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.delete))

    //edit
    router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.edit))
   

    module.exports=router;