import React, { useState } from "react";
import axios from "axios";
import "./fileRequest.css";
import { useAuth } from "../AuthContext/AuthContext";
import { encode64 } from "../Encoder/Enc";
import { accessToken } from "../AccessToken/AccessToken";

const NewFileRequest = () => {
  const { user_id, role } = useAuth();
  const statusOptions = ["Pending", "Resolved", "Rejected"];
  const [formData, setFormData] = useState({
    requestName: "",
    requestType: "",
    user_id: user_id,
    requestDetails: "",
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
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const encodedFileName = encode64(file.name);
    // console.log(encodedFileName,file.name);
    // console.log(encodeURIComponent(file.name));
    // console.log(decodeURIComponent(encodeURIComponent(file.name)));

    setFormData({
      ...formData,
      file: new File([file], encodedFileName, { type: file.type }), // Encode the filename and create a new File object
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("requestName", formData.requestName);
    formDataToSend.append("requestType", formData.requestType);
    formDataToSend.append("user_id", formData.user_id);
    formDataToSend.append("requestDetails", formData.requestDetails);
    formDataToSend.append("file", formData.file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/fileRequests/newr`,
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
        userId: "",
        requestDetails: "",
        file: null,
      });
      setError("");
    } catch (error) {
      setError("Failed to create request. Please try again.");
      console.error("Error creating request:", error);
    }
    window.location.reload();
  };

  return (
    <div className="fr-container">
      <h2>Create New File Request</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          name="requestName"
          value={formData.requestName}
          onChange={handleChange}
          required
        />

        <label>Request Type:</label>
        <input
          type="text"
          name="requestType"
          value={formData.requestType}
          onChange={handleChange}
          required
        />

        {/* <label>User ID:</label> */}

        <label>Request Details:</label>
        <textarea
          name="requestDetails"
          value={formData.requestDetails}
          onChange={handleChange}
        />

        {role === "DBA" && (
          <>
            <label>Upload File:</label>
            <input type="file" onChange={handleFileChange} />
          </>
        )}
        <button type="submit">Submit</button>
      </form>
      {error && <div>{error}</div>}
      {success && <div>{success}</div>}
    </div>
  );
};

export default NewFileRequest;
