import React, { useState } from "react";
import axios from "axios";
import { useMessage } from "../MessageContext/MessageContext";
import { useAuth } from "../AuthContext/AuthContext";
import "./NewContact.css";
import { encode64 } from "../Encoder/Enc";
import { accessToken } from "../AccessToken/AccessToken";

const NewContact = ({ requestId, toggleVisibility }) => {
  const { user_id } = useAuth();
  const { showMessage } = useMessage();

  const [formData, setFormData] = useState({
    userId: user_id,
    requestId: requestId,
    contactDate: "",
    contactDetails: "",
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
        `${process.env.REACT_APP_API_URL}/contacts/newc`,
        formData,
        {
          withCredentials: true,

          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      window.location.reload();
      showMessage(response.data.message);
    } catch (error) {
      showMessage("Error submitting contact");
    }
  };

  const handleClose = () => {
    toggleVisibility();
  };

  return (
    <div className="new-contact-container">
      <button className="close-button" onClick={handleClose}>
        Close
      </button>
      <h2>Add Contact</h2>
      <form
        className="new-contact-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <input type="hidden" name="requestId" value={requestId} />

        <label className="form-label" htmlFor="contactDate">
          Contact Date:
        </label>
        <input
          className="form-input"
          type="datetime-local"
          id="contactDate"
          name="contactDate"
          required
          onChange={handleChange}
        />
        <br />

        <label className="form-label" htmlFor="contactDetails">
          Contact Details:
        </label>
        <textarea
          className="form-textarea"
          id="contactDetails"
          name="contactDetails"
          rows="4"
          cols="50"
          required
          onChange={handleChange}
        ></textarea>
        <br />

        <label className="form-label" htmlFor="file">
          Upload File:
        </label>
        <input
          className="form-file"
          type="file"
          id="file"
          name="file"
          accept=".pdf, .doc, .docx, .zip, .rar"
          required
          onChange={handleFileChange}
        />
        <br />

        <button className="new-contact-submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewContact;
