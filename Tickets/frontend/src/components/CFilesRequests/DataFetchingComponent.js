import React, { useEffect, useState } from "react";
import axios from "axios";
import FileRequestsTable from "./FileRequestsTable";
import { accessToken } from "../AccessToken/AccessToken";

const DataFetchingComponent = () => {
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/fileRequests/all`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setRowData(
          response.data.cFileRequests.map((row) => ({
            request_id: row[0],
            request_name: row[1],
            username: row[2],
            date_created: row[3],
            type_of_request: row[4],
            status: row[5],
            last_modified_date: row[6],
            request_details: row[7],
            file_path: row[8],
          }))
        );
      } catch (error) {
        setError("Failed to fetch data. Please try again.");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <FileRequestsTable rowData={rowData} error={error} />
    </div>
  );
};

export default DataFetchingComponent;
