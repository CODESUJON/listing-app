const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const listingSchema=new Schema({
    title: {
        type:String,
        required: true,
    },
    description: String,

    image:{
        url:String,
        filename:String,
    } ,
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type:Schema.Types.ObjectId,
        ref:"Review",
    },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

//listing delete and also all reviews delete middleware
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

//end

const Listing=mongoose.model("Listing", listingSchema);

module.exports=Listing;

// image:{
    //     type:String,
    //     default:"https://images.unsplash.com/photos/brown-wooden-framed-white-padded-chair-in-between-green-indoor-leaf-plants-inside-bedroom-psrloDbaZc8",
    //     set: (v) => v==="" ? "https://unsplash.com/photos/brown-wooden-framed-white-padded-chair-in-between-green-indoor-leaf-plants-inside-bedroom-psrloDbaZc8":v,
    // } ,