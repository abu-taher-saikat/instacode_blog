const express = require('express');
const router = express.Router();
const passport = require("passport");

// Auth login
// router.get("/login",(req, res)=>{
//     res.render("login",{ user : req.user });
//     // res.render("index");
// })


// Auth logout
router.get("/logout",(req,res)=>{
//    handle with passport
    req.logOut();
    res.redirect("/");
});

// Auth with google
router.get("/google", passport.authenticate("google",{
    scope: ["profile"],
})
);

// callback route for google to redirect to
router.get("/google/redirect", passport.authenticate("google"), (req, res)=> {
    res.redirect("/profile");
    // res.redirect("/");
})


module.exports = router;