const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const {blogs3} = require("./blogsTestData");
const helper = require("./test_utils");

beforeEach(async () => {
  // Clear database
  await Blog.deleteMany({});
  // Initialize saving of all blog posts of the test data
  const blogObjects = blogs3.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  // Wait for all save operations to finish
  await Promise.all(promiseArray);
});

// Testing data fetching
test("Blogs are returned as JSON", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});
test("All blog posts are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(blogs3.length);
});
test("Specific blog post is among the returned posts", async () => {
  const response = await api.get("/api/blogs");
  const posts = response.body.map((post) => post.title);
  expect(posts).toContain("First class tests");
});

test("All blog posts have an id defined", async () => {
  const response = await api.get("/api/blogs");
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

// Testing data posting
test("A valid blog can be added correctly", async () => {
  // Find all users, and use first one as connected user
  const users = await helper.usersInDb();
  const newBlog = {
    title: "Creating a Jenkins CI/CD pipeline",
    author: "Christopher Gustafson",
    url: "https://christophergustafson.medium.com/creating-a-jenkins-ci-cd-pipeline-45bf747643b5",
    likes: 2,
    userId: users[0].id,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const content = response.body.map((blog) => blog.title);

  expect(response.body).toHaveLength(blogs3.length + 1);
  expect(content).toContain("Creating a Jenkins CI/CD pipeline");
});

test("An invalid blog entry that is added is responded with as 400 Bad Request", async () => {
  const newBlog = {
    author: "Christopher Gustafson",
    likes: 2,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
}, 100000);

test("A blog that is added without likes field will have default likes = 0", async () => {
  const users = await helper.usersInDb();
  const newBlog = {
    title: "Creating a Jenkins CI/CD pipeline, no likes",
    author: "Christopher Gustafson",
    url: "https://christophergustafson.medium.com/creating-a-jenkins-ci-cd-pipeline-45bf747643b5",
    userId: users[0].id,
  };
  const blogResponse = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  response.body.forEach((blog) => {
    if (blog.title.includes("no likes")) {
      expect(blog.likes).toBe(0);
    }
  });
});

// Deleting data entries
test("A blog should be deletable", async () => {
  const initialBlogs = await api.get("/api/blogs");
  await api.delete(`/api/blogs/${initialBlogs.body[1].id}`);

  const newBlogs = await api.get("/api/blogs");
  expect(newBlogs.body).toHaveLength(initialBlogs.body.length - 1);
  newBlogs.body.forEach((blog) => {
    expect(blog.title).not.toBe(initialBlogs.body[1].title);
  });
});

// Updating data entries
test("A field in a blog should be updatable", async () => {
  const initialBlogs = await api.get("/api/blogs");
  const newBlog = {
    likes: 48,
  };
  await api.put(`/api/blogs/${initialBlogs.body[1].id}`).send(newBlog);

  const newBlogs = await api.get("/api/blogs");
  expect(newBlogs.body).toHaveLength(initialBlogs.body.length);
  expect(newBlogs.body[1].likes).toBe(newBlog.likes);
});

afterAll(() => {
  mongoose.connection.close();
});
