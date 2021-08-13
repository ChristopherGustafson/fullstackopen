import React, {useState, useEffect, useRef} from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";

const App = () => {
  // All the blogs
  const [blogs, setBlogs] = useState([]);

  // For the actual user data that gets returned on login
  const [user, setUser] = useState(null);
  // Notification messages shown to user
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem("loggedInUser");
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const showMessage = (message, type) => {
    if (type === "success") {
      setSuccessMessage(message);
      setInterval(() => {
        setSuccessMessage(null);
      }, 5000);
    } else if (type === "error") {
      setErrorMessage(message);
      setInterval(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogin = async ({username, password}) => {
    try {
      const user = await loginService.login({username, password});
      console.log(user);
      // Save user to local storage
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      // Save user to state
      blogService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      showMessage("Wrong credentials", "error");
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    console.log("Logging out");
    // Remove user from local storage
    window.localStorage.removeItem("loggedInUser");
    // Remove user from state
    setUser(null);
  };

  const handleBlogSubmit = async (newBlog) => {
    // Hide blog form
    blogFormRef.current.toggleVisibility();
    console.log("Creating new blog with title ", newBlog.title);
    try {
      const blog = await blogService.create({
        title: newBlog.title,
        author: newBlog.author,
        url: newBlog.url,
      });
      setBlogs(blogs.concat(blog));
      showMessage(
        `A new blog ${blog.title} by ${blog.author} has been created`,
        "success"
      );
    } catch (exception) {
      showMessage("Failed to create blog", "error");
    }
  };

  const handleBlogDelete = async (blogId) => {
    try {
      await blogService.remove(blogId);
      showMessage("Blog successfully removed", "success");
      setBlogs(blogs.filter((b) => b.id !== blogId));
    } catch (exception) {
      showMessage("Unauthorized", "error");
    }
  };

  const handleBlogLike = async (blog) => {
    try {
      const likedBlog = await blogService.like(blog);
      // Replace the liked blog in the state with the new liked blog info
      setBlogs(
        blogs.map((b) =>
          b.id === likedBlog.id ? {...b, likes: b.likes + 1} : b
        )
      );
    } catch (exception) {
      showMessage("Failed to like blog", "error");
    }
  };

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />
      {!user ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
            <CreateBlogForm handleBlogSubmit={handleBlogSubmit} />
          </Togglable>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                handleDelete={handleBlogDelete}
                handleLike={handleBlogLike}
                isDeletable={
                  blog.user ? blog.user.username === user.username : false
                }
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
