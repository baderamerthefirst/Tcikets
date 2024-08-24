import React, { useState } from "react";
import axios from "axios";
import "./CreateUser.css"; // Import the CSS file
import { useAuth } from "../AuthContext/AuthContext";
import { accessToken } from "../AccessToken/AccessToken";

const CreateUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role1, setRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { role } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess(null);

      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/register`,
        {
          username,
          password,
          role: role1,
        }
        ,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
      );
      // Handle success, perhaps redirect or show a success message
      console.log("User created successfully:", response.data);
      setSuccess("User created successfully");
      // Reset form fields after successful creation
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setRole("");
      setError(null);
    } catch (err) {
      // Handle error
      console.error("Error creating user:", err);
      setError("Failed to create user. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div className="create-user-container">
      <h2>Create User</h2>
      <form onSubmit={handleSubmit} className="create-user-form">
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select
            value={role1}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="user">User</option>
            {role == "DBA" && <option value="DBA">DBA</option>}
          </select>
        </div>
        <button type="submit" className="submit-button">
          Create User
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default CreateUser;
