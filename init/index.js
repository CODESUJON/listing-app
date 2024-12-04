const mongoose=require("mongoose");
const indata=require("./data.js");
const Listings=require("../models/listing.js");

const mongo_url="mongodb://127.0.0.1:27017/booking";


main()
.then(() =>{
    console.log("connected to db");
})
.catch((err) =>{
console.log(err);
});
async function main() {
    await mongoose.connect(mongo_url);
    
}

const initDB = async () =>{
    await Listings.deleteMany({});
    indata.data=indata.data.map((obj)=>({...obj,owner:"66ebdfd7c8c2203330c63221",

    }));
    await Listings.insertMany(indata.data);
    console.log("data is inserted");
};

initDB();