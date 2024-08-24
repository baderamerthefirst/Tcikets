import React from 'react';
import axios from 'axios';
import './FileDownloadButton2.css';
import { accessToken } from '../AccessToken/AccessToken';

const FileDownloadButton2 = ({ request_id }) => {
  const handleDownload = async () => {
    console.log(request_id);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/download/2`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          request_id,
        },
        responseType: 'blob',
      });
      

      
      const contentDisposition = response.headers['content-disposition']; // Access the headers directly

      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);
      const filename = matches && matches[1] ? decodeURI(matches[1].replace(/['"]/g, '')).split('\\').pop() : 'download'; // Decode the filename
      // const filenames=(decodeURI(matches)).split("/").pop();
      // const fileName = filePath.split("/").pop();
      // console.log( decodeURI(matches[1].replace(/['"]/g, '')).split('\\').pop());
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="download-button-container2">
      <button onClick={handleDownload} className="download-button">
        Download
      </button>
    </div>
  );
};

export default FileDownloadButton2;
