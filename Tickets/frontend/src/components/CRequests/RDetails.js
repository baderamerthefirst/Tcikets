import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./RDetails.css";
import Contacts from "../Contacts/Contacts";
import FileDownloadButton from "../FileDownloadButton/FileDownloadButton ";
import NewContact from "../Contacts/NewContact ";
import TestFormContainer from "../Tests/TestFormContainer";
import TestsFetcher from "../Tests/TestsFetcher";
import { accessToken } from "../AccessToken/AccessToken";
import { useAuth } from "../AuthContext/AuthContext";
const RDetails = () => {
  const { role, user } = useAuth();

  const { id } = useParams();
  const [request, setRequest] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [updatedRequest, setUpdatedRequest] = useState(null);
  const [refresh, setRefresh] = useState(1);

  const [isVisible, setIsVisible] = useState(false);

  const statusOptions = [
    "Pending",
    "Program Received",
    "Internal Test",
    "UAT",
    "Resolved",
    "Rejected",
  ];

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/requests/${id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setRequest(response.data.details);
        const ddd = response.data.details;
        setUpdatedRequest(response.data.details);
        setUpdatedRequest((prevState) => ({
          ...prevState,
          id: ddd[0],
          title: ddd[1],
          createdBy: ddd[2],
          requestedBy: ddd[3],
          createdAt: ddd[4],
          category: ddd[5],
          status: ddd[6],
          updatedAt: ddd[7],
          stage: ddd[8],
          requestdetails: request[9],
        }));
      } catch (error) {
        console.error("Error fetching request details:", error);
      }
    };

    fetchRequestDetails();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/requests/update`,
        updatedRequest,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setRequest(updatedRequest);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/requests/delete/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedRequest({ ...updatedRequest, [name]: value });
  };

  if (!request) {
    return <div>Loading...</div>;
  }

  return (
    <div key={refresh} className="request-details-container">
      <h1>Request Details</h1>
      <div className="input-group">
        <label className="label">ID:</label>
        <input
          type="text"
          defaultValue={request[0]}
          readOnly
          className="input"
        />
      </div>
      <div>
        <label className="label">Title:</label>
        <input
          type="text"
          name="title"
          defaultValue={updatedRequest ? updatedRequest[1] : request[1]}
          onChange={handleChange}
          readOnly
          className="input"
        />
      </div>
      <div>
        <label className="label">Created By:</label>
        <input
          type="text"
          name="createdBy"
          defaultValue={updatedRequest ? updatedRequest[2] : request[2]}
          onChange={handleChange}
          readOnly
          className="input"
        />
      </div>
      <div>
        <label className="label">Requested By:</label>
        <input
          type="text"
          name="requestedBy"
          defaultValue={updatedRequest ? updatedRequest[3] : request[3]}
          onChange={handleChange}
          readOnly={!isEditing}
          className="input"
        />
      </div>
      <div>
        <label className="label">Created At:</label>
        <input
          type="text"
          name="createdAt"
          defaultValue={updatedRequest ? updatedRequest[4] : request[3]}
          onChange={handleChange}
          readOnly
          className="input"
        />
      </div>
      <div>
        <label className="label">Type of Request:</label>

        <select
          name="category"
          onChange={handleChange}
          disabled={!isEditing}
          className="input"
        >
          <option
            value={updatedRequest ? updatedRequest[5] : request[4]}
            hidden
          >
            {updatedRequest ? updatedRequest[5] : request[4]}
          </option>

          <option value="EGABI">EGABI</option>
          <option value="internal">Internal</option>
        </select>
      </div>

      {/* <div>
        <label className="label">Status:</label>
        <input
          type="text"
          name="status"
          defaultValue={updatedRequest ? updatedRequest[6] : request[5]}
          onChange={handleChange}
          readOnly={!isEditing}
          className="input"
        />
      </div> */}

      <div>
        <label className="label">Status:</label>

        <select
          name="status"
          onChange={handleChange}
          disabled={!isEditing}
          className="input"
        >
          <option
            value={updatedRequest ? updatedRequest[6] : request[5]}
            hidden
          >
            {updatedRequest ? updatedRequest[6] : request[5]}
          </option>

          {statusOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Last Updated:</label>
        <input
          type="text"
          name="updatedAt"
          defaultValue={updatedRequest ? updatedRequest[7] : request[6]}
          onChange={handleChange}
          readOnly
          className="input"
        />
      </div>
      <div className="sos">
        <label className="label">Details:</label>
        <textarea
          type="text"
          name="requestdetails"
          defaultValue={updatedRequest ? updatedRequest[9] : request[7]}
          onChange={handleChange}
          readOnly={!isEditing}
          className="input"
          id="tt"
        />
      </div>
      <div className="button-group">
        <div>
          {(role==='DBA'  || user===request[2]) &&<button
            onClick={() => {
              if (role==='DBA'  || user===request[2]) 
             { setIsEditing(!isEditing);
              if (isEditing) {
                setRefresh(refresh + 1);
                setUpdatedRequest(request);
                setUpdatedRequest((prevState) => ({
                  ...prevState,
                  id: request[0],
                  title: request[1],
                  createdBy: request[2],
                  requestedBy: request[3],
                  createdAt: request[4],
                  category: request[5],
                  status: request[6],
                  updatedAt: request[7],
                  stage: request[8],
                  requestdetails: request[9],
                }));}
              }
            }}
            className="button update-button"
          >
            {isEditing ? "Cancel" : "Update"}
          </button>}
          {isEditing && (
            <button onClick={handleUpdate} className="button save-button">
              Save Changes
            </button>
          )}
        </div>
        <FileDownloadButton request_id={request[0]} stage={request[8]} />
        {/* <button onClick={handleDelete} className="button delete-button">
          Delete
        </button> */}
      </div>
      <Contacts request_id={id} />
      <button
        className="add-new-button"
        onClick={() => {
          setIsVisible(true);
        }}
      >
        {" "}
        Add New Contact
      </button>
      {isVisible && (
        <NewContact
          toggleVisibility={() => {
            setIsVisible(false);
          }}
          requestId={id}
        />
      )}
      <TestsFetcher request_id={id} />
      <TestFormContainer request_Id={id} />
    </div>
  );
};

export default RDetails;
