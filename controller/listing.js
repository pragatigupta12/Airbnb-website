const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken });
module.exports.index=async(req,res)=>{
    let listings=await Listing.find({});
    res.render("listings/index.ejs",{listings})
    }

module.exports.new=(req,res)=>{
     res.render("listings/new.ejs")
      }

      module.exports.edit=async(req,res)=>{
        let {id}=req.params;
        let listing=await Listing.findById(id);
        if(!listing){
          req.flash("error","data doe'nt exist");
          res.redirect(`/listings`);
        }
      let originalimageURL=listing.image.url;
      originalimageURL=originalimageURL.replace("/upload","/upload/h_300,w_250")
        res.render("listings/edit.ejs",{listing,originalimageURL})
      }
   module.exports.update=async(req,res)=>{
        let {id}=req.params;
     let listing=await Listing.findByIdAndUpdate(id,({...req.body.listing}));
     if( typeof req.file !=="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename}
      await listing.save()
     }
   
       req.flash("success","data updated")
       res.redirect(`/listings/${id}`);
      }

      module.exports.show=async(req,res)=>{
        let {id}=req.params;
      let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner")
      if(!listing){
        req.flash("error","data doe'nt exist");
        res.redirect(`/listings`);
      }else{
        res.render("listings/show.ejs",{listing});
      }  }

      module.exports.create=async(req,res,next)=>{
 let response =await geocodingClient.forwardGeocode({
          query: req.body.listing.location,
          limit: 1
        })
          .send()

        let url=req.file.path;
        let filename=req.file.filename;
      
        // let listing=req.body.listing;
        let newlisting= new Listing(req.body.listing);
        newlisting.image={url,filename}
        newlisting.owner=req.user._id;
        newlisting.geometry=response.body.features[0].geometry;
      let savedListing=  await newlisting.save();
      console.log(savedListing)
        console.log("data was saved");
        req.flash("success","data was saved")
        res.redirect("/listings");
    }

    module.exports.delete=async(req,res)=>{
        let{id}=req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success","data was deleted")
        console.log("deleted");
        res.redirect("/listings");
        }