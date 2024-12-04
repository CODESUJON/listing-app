const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { singup, renderSingup, renderLogin, login, logout } = require("../controllers/users.js");


router.route("/singup")
    .get(renderSingup)
    .post(wrapAsync(singup));

router.route("/login")
    .get(renderLogin)
    .post(
        saveRedirectUrl,
        passport.authenticate("local",
            {
                failureRedirect: "/login",
                failureFlash: true,
            }),
        login
    );


router.get("/logout", logout);

module.exports = router;
