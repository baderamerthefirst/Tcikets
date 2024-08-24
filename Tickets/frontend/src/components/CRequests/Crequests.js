import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataGride from './DataGride';
import NewRequest from './NewRequest';
import { accessToken } from '../AccessToken/AccessToken';

const CRequests = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);



  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const toggleNewRequestForm = () => {
    setShowNewRequestForm(!showNewRequestForm);
  };


  const fetchData = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/requests/all`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
        const transformedData = response.data.cRequests.map(row => ({
        id: row[0],
        title: row[1],
        createdBy: row[2],
        requestedBy: row[3],
        createdAt: row[4],
        typeofRequest: row[5],
        status: row[6],
        updatedAt: row[7],
       
        requestDetails : row[9]
      }));
      setData(transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  return (
    <div className='request-table-container'>
      {/* add the filters in here  */}
      <h2>All Requests </h2>
      <button className='refresh-button' onClick={()=>{window.location.reload()}}>Refresh</button>
      <DataGride data={data} />
      {/* <DataTable data={data} /> */}
      <button className="add-new-request-button" onClick={toggleNewRequestForm}>
        Add New Request
      </button>
     

      {showNewRequestForm && <NewRequest onClose={toggleNewRequestForm} />}
    </div>
  );
};

export default CRequests;
