const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingsController = require("../middleware.js");
const { index, renderNewForm, showListings, createListings, renderEditForm, editListing, deleteListings } = require("../controllers/listings.js");

const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

//for index route
router.route("/")
    .get(wrapAsync(index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(createListings)
    );

//new route
router.get("/new", isLoggedIn, renderNewForm);


router.route("/:id")
    .get(wrapAsync(showListings))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(editListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(deleteListings)
    );

router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(renderEditForm)
);



module.exports = router;
