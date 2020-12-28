const express = require('express');
const router = express.Router();
// const blogRouter = require("./blog-router");




router.get('/',(req, res)=>{
    // res.send('hello world')
    res.render('index', {
        user : req.user
    })
})




// view route 
// router.get("/:slug", async(req,res)=>{
//     let blog = await Blog.findOne({slug : req.params.slug});
//     if(blog){
//         // console.log(blog);
//         res.render("blog", { 
//           blog : blog ,
//           user : req.user
//         });
//     }else{
//         res.redirect("/");
//     }
// })


// router.get('/blog',(req, res)=>{
//     res.render('blog',{
//         user : req.user
//     });
// })

// router.get("/blog", blogRouter);


module.exports = router;