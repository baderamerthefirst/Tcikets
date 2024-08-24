import React, { useState } from 'react';
import axios from 'axios';
import { useMessage } from '../MessageContext/MessageContext';
import { useAuth } from '../AuthContext/AuthContext';
import './NewRequest.css'
import { encode64, decode64 } from '../Encoder/Enc.js';
import { accessToken } from '../AccessToken/AccessToken.js';
const NewRequest = ({ onClose }) => {
  const { user_id } = useAuth();
  const [formData, setFormData] = useState({
    requestName: '',
    requestType: 'EGABI',
    requesterName: '',
    file: null,
    user_id: user_id,
    requestDetails: ''
  });
  const { showMessage } = useMessage();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // console.log(formData);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // const encodedFileName = encodeURIComponent(file.name);


    var encodedFileName = encode64(file.name)
    console.log(encodedFileName);
    console.log(decode64(encodedFileName));
    // console.log(encodedFileName,file.name);
    // console.log(encodeURIComponent(file.name));
    // console.log(decodeURIComponent(encodeURIComponent(file.name)));

    setFormData({
      ...formData,
      file: new File([file], encodedFileName, { type: file.type }) // Encode the filename and create a new File object
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/requests/newr`, formData, {
        
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        
      });
      console.log(response);///
      handleClose();
      window.location.reload();

      showMessage(response.data.message);
    } catch (error) {
      showMessage('Error submitting request');
    }
  };

  const handleClose = () => {
    // showMessage(null);
    onClose();
  };

  return (
    <div className="new-request-container">
      <button id='close-button' onClick={handleClose}>Close</button>

      <form onSubmit={handleSubmit}>
        <label htmlFor="requestName">Title:</label>
        <input type="text" id="requestName" name="requestName" value={formData.requestName} onChange={handleChange} required /><br />

        <label htmlFor="requestType">Type of Request:</label>
        <select id="requestType" name="requestType" onChange={handleChange} required>
          <option value="EGABI" >EGABI</option>
          <option value="internal" >Internal</option>
        </select><br />




        <label htmlFor="requestDetails">Request Details:</label>
        <textarea className="requestDetails" id="requestDetails" name="requestDetails" rows="4" cols="50" required onChange={handleChange}></textarea><br />





        <label htmlFor="requesterName">Requester's Name:</label>
        <input type="text" id="requesterName" name="requesterName" value={formData.requesterName} onChange={handleChange} required /><br />

        <label htmlFor="file">Upload File:</label>
        <input type="file" id="file" name="file" onChange={handleFileChange} accept=".pdf, .doc, .docx , .zip ,.rar" required /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NewRequest;
