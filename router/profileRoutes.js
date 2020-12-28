const express = require('express');
const router = express.Router();

// auth check
const authCheck  = (req, res, next ) => {
    if(!req.user){
        // if user is not logged in
        res.redirect("/auth/google");
    }else{
        // if logged in
        next();
    };
};


router.get("/", authCheck , (req, res)=> {
    // res.render("profile", {user : req.user});
    res.render("index",{user : req.user})
    console.log(req.user);
})


module.exports = router;