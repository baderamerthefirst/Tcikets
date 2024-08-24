// TopBar.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "./TopBar.css";

import { removeAccessToken } from "../AccessToken/AccessToken";

const TopBar = () => {
  const { user, user_id, role, logout } = useAuth();

  const handleLogout = async () => {
    logout();
  };

  return (
    <div id="topBar">
      <h2>
        Welcome {user}
        {/* (User ID: {user_id}  , Role : {role}) */}
      </h2>
      <ul id="topBar_tabs">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/Setting">Setting</Link>
        </li>
        <li>
          {" "}
          <a href="" onClick={handleLogout}>
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
};

export default TopBar;
