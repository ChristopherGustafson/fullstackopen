import React, {useState, useEffect} from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  // Represents the username/password form fiekds
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // For the actual user data that gets returned on login
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem("loggedInUser");
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({username, password});
      // Save user to local storage
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      // Save user to state
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      window.alert("Wrong credentials");
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

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div>
      <h2>Blogs</h2>
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
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
