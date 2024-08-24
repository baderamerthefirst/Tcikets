import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContactTable from './ContactTable';
import { accessToken } from '../AccessToken/AccessToken';


const Contacts = ({ request_id }) => {
  // State to store contacts
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // Make a GET request to fetch contacts from the backend
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/contacts/all/${request_id}`,{
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });
        // Update the contacts state with the fetched data
        setContacts(response.data.contacts);
        // console.log(contacts);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    // Call the fetchContacts function when the component mounts
    fetchContacts();
  }, []); 
  
  return (
    <div className='contact-container'>
      <h1>Contacts</h1>
      <ContactTable data={contacts} request_id={request_id} />
    </div>
  );
};

export default Contacts;
