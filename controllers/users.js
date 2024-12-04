const User = require("../models/user.js");


module.exports.renderSingup=(req,res)=>{
    res.render("users/singup.ejs");
};


module.exports.singup=async(req,res) =>{
    try{
        let {username, email, password}=req.body;
    const newUser =new User({email,username});
    const registerUser=await User.register(newUser, password);
    req.login(registerUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "welcome to wanderlust!");
        res.redirect("/listings");

    });
    }catch(e){
        req.flash("error", e.message)
        res.redirect("/singup");
    }
    
};

module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async (req,res)=>{
    req.flash("success", "welcome back to wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

};

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};