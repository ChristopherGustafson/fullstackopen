const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {userExtractor} = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });
  const createdBlog = await newBlog.save();
  user.blogs = user.blogs.concat(createdBlog._id);
  await user.save();

  response.status(201).json(createdBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog.user.toString() === request.user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } else {
    response.status(401).json({error: "Unauthorized"});
  }
});

blogsRouter.put("/:id", async (request, response) => {
  // Set the new blog fields to the request body, where the updated fields should be, newBlog will thus contain only the fields the should be updated
  const newBlog = request.body;
  const result = await Blog.findByIdAndUpdate(request.params.id, newBlog, {
    new: true,
    runValidators: true,
    context: "query",
  });
  response.json(result);
});

module.exports = blogsRouter;
