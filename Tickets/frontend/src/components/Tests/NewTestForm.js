import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";
import { useMessage } from "../MessageContext/MessageContext";
import "./NewTestForm.css";
import { encode64 } from "../Encoder/Enc";
import { accessToken } from "../AccessToken/AccessToken";

const NewTestForm = ({ toggleVisibility, request_Id }) => {
  const { user_id } = useAuth();
  const { showMessage } = useMessage();

  const [formData, setFormData] = useState({
    requestId: request_Id,
    testerId: user_id,
    testDate: "",
    testResults: "",
    testingGroup: "",
    testDetails: "",
    file: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const encodedFileName = encode64(file.name);

    setFormData({
      ...formData,
      file: new File([file], encodedFileName, { type: file.type }),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/tests/newt`,
        formData,
        {
          withCredentials: true,

          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      toggleVisibility();
      window.location.reload();
      showMessage(response.data.message);
    } catch (error) {
      showMessage("Error submitting test");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="new-test-form-container">
      <button className="close-button" onClick={toggleVisibility}>
        Close
      </button>
      <h2>Add New Test</h2>
      <form
        className="new-test-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <input
          type="number"
          name="requestId"
          value={formData.requestId}
          onChange={handleChange}
          hidden
        />
        <input
          type="number"
          name="testerId"
          value={formData.testerId}
          onChange={handleChange}
          hidden
        />

        <label htmlFor="testDate">Test Date:</label>
        <input
          type="datetime-local"
          id="testDate"
          name="testDate"
          value={formData.testDate}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="testResults">Test Results:</label>
        <input
          type="text"
          id="testResults"
          name="testResults"
          value={formData.testResults}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="testingGroup">Testing Group:</label>
        <input
          type="text"
          id="testingGroup"
          name="testingGroup"
          value={formData.testingGroup}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="testDetails">Test Details:</label>
        <textarea
          id="testDetails"
          name="testDetails"
          rows="4"
          cols="50"
          value={formData.testDetails}
          onChange={handleChange}
          required
        ></textarea>
        <br />

        <label htmlFor="file">Upload File:</label>
        <input
          type="file"
          id="file"
          name="file"
          accept=".pdf, .doc, .docx, .zip, .rar"
          onChange={handleFileChange}
        />
        <br />

        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewTestForm;
