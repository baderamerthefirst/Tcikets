import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Changed import to useHistory

import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <h2>Welcome to the Home Page!</h2>

      <div className="wrap">
        <button
          onClick={() => {
            navigate("/Requests");
          }}
          className="button"
        >
          System Requests
        </button>{" "}
        {/* Fixed onClick */}
      {/* </div>
      <div className="wrap"> */}
        <button
          onClick={() => {
            navigate("/FilesRequests");
          }}
          className="button"
        >
          Files Requests
        </button>{" "}
        {/* Fixed onClick */}
      </div>
    </div>
  );
};

export default Home;
