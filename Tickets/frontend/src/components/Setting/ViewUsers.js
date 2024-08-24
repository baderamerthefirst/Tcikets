import React, { useEffect, useState } from "react";
import axios from "axios";
import UserTable from "./UserTable";
import './ViewUser.css'; // Import the CSS file
import { accessToken } from "../AccessToken/AccessToken";


const ViewUsers = () => {
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`,{
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      setUserData(response.data);
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="users-container">
      <UserTable rowData={userData} error={error} refreshData={fetchData} />
    </div>
  );
};

export default ViewUsers;
