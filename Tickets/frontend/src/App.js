import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import Home from "./components/Home/Home.js";
import Profile from "./components/Profile/Profile.js";
import TopBar from "./components/TopBar/TopBar";
import Login from "./components/Login/Login";
import "./App.css";
import { useAuth } from "./components/AuthContext/AuthContext.js";
import RDetails from "./components/CRequests/RDetails.js";
import Setting from "./components/Setting/Setting.js";
import { useMessage } from "./components/MessageContext/MessageContext.js";
import CRequests from "./components/CRequests/Crequests.js";
import CFilesRequests from "./components/CFilesRequests/CFilesRequests.js";
import { accessToken } from "./components/AccessToken/AccessToken.js";

function App() {
  axios.defaults.withCredentials = true;
  const { message } = useMessage();
  const { user, logout, setLoggedUser, status } = useAuth();
  const [loading, setLoading] = useState(true); // Add loading state

  const checkLoginStatus = useCallback(async () => {
    try {
      // const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setLoading(false); // Update loading state
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/logi`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.data.username) {
        console.log(response.data.data);
        setLoggedUser(
          response.data.data.username,
          response.data.data.user_id,
          response.data.data.role,
          response.data.data.status
        );
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      logout()
    } finally {
      setLoading(false); // Update loading state
    }
  }, [logout, setLoggedUser]);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  // Render loading state while checking login status
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <RouteChangeLogger checkLoginStatus={checkLoginStatus} />
      <div>
        {user && status === "active" && <TopBar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            index
            element={
              user && status === "active" ? <Home /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/profile"
            element={
              user && status === "active" ? (
                <Profile />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/Rdetails/:id"
            element={
              user && status === "active" ? (
                <RDetails />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/Setting"
            element={
              user && status === "active" ? (
                <Setting />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/Requests"
            element={
              user && status === "active" ? (
                <CRequests />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/FilesRequests"
            element={
              user && status === "active" ? (
                <CFilesRequests />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>

        {message && <div className="notification message ">{message}</div>}
      </div>
    </Router>
  );
}

function RouteChangeLogger({ checkLoginStatus }) {
  const location = useLocation();

  useEffect(() => {
    console.log(window.location.href);
    checkLoginStatus();
  }, [location, checkLoginStatus]);

  return null;
}

export default App;
