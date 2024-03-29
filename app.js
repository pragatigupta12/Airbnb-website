// notepad mai important name se folder hai jiske andar mongoAtlas  ka username aur password likha hai 



if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}
const express=require("express");
const app=express();
const port=8080;
const mongoose=require("mongoose");
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({extended:true}));
const methodOverride = require('method-override');
app.use(methodOverride('_method'))
const ejsMate=require("ejs-mate")
app.engine("ejs",ejsMate)
const ExpressError=require("./utilis/ExpressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")

main().then(()=>{
    console.log("DB connected")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/major_project');
}
const sessionOption={
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:Date.now()+7*24*60*60*1000,
    httpOnly:true
  }
}
app.get("/",(req,res)=>{
  res.send("root routes");
})
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)

app.all("*",(req,res,next)=>{
  next (new ExpressError(404,"page not found"))
})
app.use((err,req,res,next)=>{
  let{status=500,message="something went wrong"}=err;
  res.status(status).render("error.ejs",{message})
})
app.listen(port,()=>{
    console.log(`app is listening on port`);
})