import React, {useState, useEffect} from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  // All the blogs
  const [blogs, setBlogs] = useState([]);
  // Fields for creating new blogs
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");
  // Represents the username/password form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // For the actual user data that gets returned on login
  const [user, setUser] = useState(null);
  // Notifcation messages shown to user
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({username, password});
      // Save user to local storage
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      // Save user to state
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
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

  const handleBlogSubmit = async (event) => {
    event.preventDefault();
    console.log("Creating new blog with title ", newTitle);
    try {
      const newBlog = await blogService.create({
        title: newTitle,
        author: newAuthor,
        url: newUrl,
      });
      setBlogs(blogs.concat(newBlog));
      showMessage(
        `A new blog ${newTitle} by ${newAuthor} has been created`,
        "success"
      );
    } catch (exception) {
      showMessage("Failed to create blog", "error");
    }
    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };

  // Login form field change handlers
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Create new blog form field change handlers
  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value);
  };
  const handleUrlChange = (event) => {
    setNewUrl(event.target.value);
  };

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />
      {!user ? (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
        />
      ) : (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <CreateBlogForm
            handleSubmit={handleBlogSubmit}
            title={newTitle}
            author={newAuthor}
            url={newUrl}
            handleTitleChange={handleTitleChange}
            handleAuthorChange={handleAuthorChange}
            handleUrlChange={handleUrlChange}
          />
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
