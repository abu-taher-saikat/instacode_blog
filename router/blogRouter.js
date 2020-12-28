const express = require('express');
const router = express.Router();
const Blog = require("./../model/blog-model");
const User = require("./../model/user-model");
const multer = require("multer");

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



// define storage for the iamge
const storage = multer.diskStorage({
  // destination for files
  destination: function (req, file, callback) {
    callback(null, "./public/uploads/images");
  },

  // add back to extension
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
// uploads parameter for multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
});

// router.get("/new", (req, res) => {
//   res.render("newBlog");
// });

// get blog page[get:/blog/]
router.get("/", async (req, res)=>{
    const blogs = await Blog.find().sort({timecreated : "asc"});

    res.render("blog",{blogs : blogs, user : req.user});
    // res.render("blog", { 
    //     blog : blog , 
    //     user : req.user
    // });
    console.log(blogs);
    // console.log(blogs.title[0]);
})


// get blog creating page..[get:/blog/new]
router.get("/new",(req, res)=> {
    res.render("newBlog");
})


// Route that handle post
// [post:/blog/]
router.post("/",authCheck , upload.single("image"), async(req, res)=>{
    // console.log(req);

    let blog = new Blog({
        title : req.body.title,
        author : req.body.author,
        description : req.body.description,
        img : req.file.filename
    })

    console.log(blog);
    try{
        await blog.save();
        console.log(blog.id);
        // res.redirect(`blog/${blog.slug}`);
        res.redirect(`blog/${blog.slug}`);
    }catch(err){
        console.log(err);
    }
})

// edit blog route part 1
// router.get("/edit/:id", async(req, res)=>{
//   let blog = await Blog.findById(req.params.id);
//   console.log("hi the blog id ", blog.img);
//   res.render("editblog", {blog: blog, user : req.user});
// })
router.get("/edit/:id", authCheck, async (req, res) => {
  let blog = await Blog.findById(req.params.id);
  res.render("editblog", { blog: blog, user: req.user });
});

// edit blog route part 2
router.put("/:id", authCheck , async (req, res) => {
  req.blog = await Blog.findById(req.params.id);
  let blog = req.blog;
  blog.title = req.body.title;
  blog.author = req.body.author;
  blog.description = req.body.description;

  try {
    blog = await blog.save();
    res.redirect(`${blog.slug}`);
  } catch (err) {
    console.log(err);
    res.render(`blog/edit/${blog.id}`, { blog: blog });
  }
});
// router.put("/:id", async (req, res)=>{
//   req.blog = await Blog.findById(req.params.id);
//   let blog = req.blog;
//   blog.title = req.body.title;
//   blog.author = req.body.author;
//   blog.description = req.body.description;

//   try{
//     blog = await blog.save();
//     req.redirect(`${blog.slug}`);
//   }catch(err){
//     res.render(`blog/edit/${blog.id}`, {blog : blog });
//   }
// })

// view blog posts with slug
// blog/:slug
router.get("/:slug", authCheck, async(req,res)=>{
    let blog = await Blog.findOne({slug : req.params.slug});
    let user = req.user;
    if(blog){
        // console.log(blog);
        res.render("show", {
            blog : blog , 
            user : req.user}
            );
        // console.log(user);
    }else{
        res.redirect("/");
    }
})


// delete blog route
router.delete("/:id",authCheck, async(req, res)=>{
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect("/blog");
})


module.exports = router;