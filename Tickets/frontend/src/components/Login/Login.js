import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../AuthContext/AuthContext";
import './Login.css'


axios.defaults.withCredentials = true;



const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user ,status} = useAuth();
  const [error, setError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
   
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        username,
        password
      });

      const { accessToken } = response.data;

      // Save the access token and expiration time to local storage
      localStorage.setItem('accessToken', accessToken);
      window.location.reload();

    } catch (err) {
      setError('Invalid username or password');
    }
  };

  if (user&&status=='active' ) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-container">
      <h2>Login </h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label className="form-label">Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Login;
