import React, { useState, useEffect } from "react";
import axios from "axios";
import TestsTable from "./TestsTable.js"; // Make sure the path matches your file structure
import { accessToken } from "../AccessToken/AccessToken.js";

const TestsFetcher = ({ request_id }) => {
  const [testsData, setTestsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/tests/all/${request_id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            }
          }
        );
        setTestsData(response.data.tests);
      } catch (error) {
        console.error("Error fetching tests data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div>
      <h1>Tests</h1>

      <TestsTable data={testsData} request_id={request_id} />
    </div>
  );
};

export default TestsFetcher;
