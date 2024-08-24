import React, { useState } from "react";
import axios from "axios";
import "./fileRequest.css";
import { useSelectedFileRequestContext } from "../SelectedFileRequestContext/SelectedFileRequestContext";
import { useAuth } from "../AuthContext/AuthContext";
import { encode64 } from "../Encoder/Enc";
import { accessToken } from "../AccessToken/AccessToken";

const UpdateFileRequest = () => {
  const { role } = useAuth();
  const {
    requestName,
    requestType,
    requestId,
    requestDetails,
    status,
    setRequestName,
    setRequestType,
    setRequestId,
    setRequestDetails,
    setStatus,
    setAll,
  } = useSelectedFileRequestContext();

  const [formData, setFormData] = useState({
    requestName: requestName,
    requestType: requestType,
    requestId: requestId,
    requestDetails: requestDetails,
    status: status,
    file: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    switch (name) {
      case "requestName":
        setRequestName(value);
        break;
      case "requestType":
        setRequestType(value);
        break;
      case "requestId":
        setRequestId(value);
        break;
      case "requestDetails":
        setRequestDetails(value);
        break;
      case "status":
        setStatus(value);
        break;
      default:
        break;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const encodedFileName = encode64(file.name);
    setStatus('Resolved');


    setFormData({
      ...formData,
      status:'Resolved'
      ,
      file: new File([file], encodedFileName, { type: file.type }), // Encode the filename and create a new File object
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("requestName", formData.requestName);
    formDataToSend.append("requestType", formData.requestType);
    formDataToSend.append("requestId", formData.requestId);
    formDataToSend.append("requestDetails", formData.requestDetails);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("file", formData.file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/fileRequests/update`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setSuccess("Request created successfully");
      setFormData({
        requestName: "",
        requestType: "",
        requestId: "",
        requestDetails: "",
        status: "",
        file: null,
      });
      setAll(null, null, null, null, null, null);
      setError("");
      window.location.reload();
    } catch (error) {
      setError("Failed to create request. Please try again.");
      console.error("Error creating request:", error);
    }
  };

  return (
    <div className="fr-container">
      <button
        className="close-button"
        onClick={() => {
          setAll(null, null, null, null, null, null);
        }}
      >
        Close
      </button>

      <h2>Update File Request</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          name="requestName"
          value={requestName}
          onChange={handleChange}
          required
        />

        <label>Request Type:</label>
        <input
          type="text"
          name="requestType"
          value={requestType}
          onChange={handleChange}
          required
        />

        <div>
          <label>Status:</label>
          <select
            name="status"
            onChange={handleChange}
            value={status}
            className="input"
            required
          >
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <label>Request Details:</label>
        <textarea
          name="requestDetails"
          value={requestDetails}
          onChange={handleChange}
          required
        />

        {role == "DBA" && (
          <>
            <label>Upload File:</label>
            <input type="file" onChange={handleFileChange} />
          </>
        )}
        <button type="submit">Update</button>
      </form>
      {error && <div>{error}</div>}
      {success && <div>{success}</div>}
    </div>
  );
};

export default UpdateFileRequest;
