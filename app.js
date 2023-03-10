const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");

require('dotenv').config()

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set('strictQuery', true);

mongoose.connect(process.env.ATLAS_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
})

const Blog = mongoose.model("Blog", blogSchema);

app.get("/", (req, res) => {
  Blog.find({}, (err, foundBlogs) => {
    res.render("home", {
      homeSC: homeStartingContent,
      posts: foundBlogs
      });
  });
});


app.get("/about", (req, res) => {
  res.render("about", {
    aboutC: aboutContent,
  })
})


app.get("/contact", (req, res) => {
  res.render("contact", {
    contactC: contactContent,
  })
})

app.get("/compose", (req, res) => {
  res.render("compose")
})


app.get("/blogs/:blogId", (req, res) => {
  const requestedPostId = req.params.blogId;

  Blog.findOne({_id: requestedPostId}, (err, blog) => {
    res.render("post", {
      postT: blog.title,
      postB: blog.content,
    })
  })
});


app.post("/compose", (req, res) => {
  const newPostTitle = req.body.postTitle;
  const newPostBody = req.body.postArea;
  const newBlog = new Blog ({
    title: newPostTitle,
    content: newPostBody,
  });
  newBlog.save((err) => {
    if (!err) {
      res.redirect("/");
    }
  });
});


app.listen(process.env.PORT || 3000, () => {
  console.log("Server started.");
});
