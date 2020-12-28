const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('./config/passport.setup');
const authRouter = require('./router/authRoutes');
const profileRoutes = require('./router/profileRoutes');
const BlogModel = require("./model/blog-model");
const blogRouter = require("./router/blogRouter.js");
const methodOverride = require("method-override");
const multer= require('multer');
const path = require("path");
const keys = require('./config/keys');


// calling back router
const indexRouter = require('./router/index')

// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
},
()=>{
    console.log("Database is connected");
});

// Setting up cookie-session
app.use(
    cookieSession({
        maxAge : 24 * 60 * 60 * 1000,
        keys : [keys.session.cookieKey]
    })
);

// initialize passport.
app.use(passport.initialize());
app.use(passport.session());


// set up static file
app.use(express.static(path.join(__dirname , "/public"))); 
// set view engine 
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended : false}));
app.use(methodOverride("_method"));





// auth route and profile route bringing in here.
app.use('/auth', authRouter);
app.use('/profile', profileRoutes);
// use  blog section
app.use('/blog', blogRouter);

// main route....
app.use('/', indexRouter);

// app.get("/:slug", async(req,res)=>{
//     let blog = await Blog.findOne({slug : req.params.slug});
//     // const user = req.user;
//     if(blog){
//         console.log(blog);
//         res.render("show", {
//             blog : blog , 
//             user : req.user}
//             );
//     }else{
//         res.redirect("/");
//     }
// })


const port  = 3000;
app.listen(port, ()=>{
    console.log('server is started on port ' + port);
})