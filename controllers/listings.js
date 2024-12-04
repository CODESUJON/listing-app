const Listing = require("../models/listing.js");


module.exports.index=async (req, res) => {
    const allList = await Listing.find({});
    res.render("listings/index", { allList }); // Correct path
};


module.exports.renderNewForm=(req, res) => {   
    res.render("listings/new");
};

module.exports.showListings=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show", { listing });
};


module.exports.createListings=async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;

    //let {title,description,image,price,country,location}=req.body;
    const listingNew = new Listing(req.body.listing)
    listingNew.owner=req.user._id;
    listingNew.image={url,filename};
    await listingNew.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");

};


module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
};


module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    
    req.flash("success", "Listing Updateed!");
    res.redirect(`/listings/${id}`);
};



module.exports.deleteListings=async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleteed!");
    res.redirect("/listings");
};