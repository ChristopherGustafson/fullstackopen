import React, {useState} from "react";

const LoginForm = ({handleLogin}) => {
  // Represents the username/password form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Login form field change handlers
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const login = (event) => {
    event.preventDefault();

    handleLogin({username, password});
    setUsername("");
    setPassword("");
  };
  return (
    <div>
      <h2>Log In</h2>
      <form onSubmit={login}>
        <div>
          username
          <input
            id="username-input"
            type="text"
            value={username}
            name="Username"
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            id="password-input"
            type="password"
            value={password}
            name="Password"
            onChange={handlePasswordChange}
          />
        </div>
        <button id="login-button" type="submit">
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
