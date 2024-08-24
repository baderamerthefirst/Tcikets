import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a new context
const MessageContext = createContext();

// Define a provider component
export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  // Function to set the message and automatically clear it after 3 seconds
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  return (
    <MessageContext.Provider value={{ message, showMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

// Custom hook to use the message context
export const useMessage = () => useContext(MessageContext);
