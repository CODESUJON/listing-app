if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter=require("./routes/listings.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const dbUrl=process.env.ATLASDB_URL;

//session store cloud
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

//session 
const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave: false, 
    saveUninitialized:true,
    cookie: {
        expires:Date.now() + 7* 24 * 60 *60 *1000,
        maxAge:7* 24 * 60 *60 *1000,
        httpOnly: true,
    },
};





main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    });
async function main() {
    await mongoose.connect(dbUrl);

}



//index app 
// app.get("/", (req, res) => {
//     res.send("hi i am");
// });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) =>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

//for demouser
// app.use("/demouser", async (req,res)=>{
//     let fakeUser=new User({
//         email:"sujon@123",
//         username: "sujon123",
//     });

//     let registerUser=await User.register(fakeUser, "hello");
//     res.send(registerUser);
// })


//all route
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);



// app.get("/testListing", async (req,res) =>{
//  let sampleListing=new Listing({
//     title: "My New villa",
//     description: "By the beach",
//     price: 1200,
//     location: "goa",
//     country:"India",
//  });
//  await sampleListing.save();
//  console.log("sample was saved");
//  res.send("successful testing");
// })

//error middileware all work
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found!"));
});

// Error-handling middleware
app.use((err, req, res, next) => { // Include `next` as a parameter
    const { statusCode = 500, message = "Something went wrong!" } = err; // Default status code 500
    res.status(statusCode).render("error.ejs", { message });
});

//server start
app.listen(8080, () => {
    console.log("this is port");
});

