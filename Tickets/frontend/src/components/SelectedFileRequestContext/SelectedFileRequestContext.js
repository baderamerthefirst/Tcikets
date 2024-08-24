import React, { createContext, useContext, useState } from 'react';
const SelectedFileRequestContext = createContext();


export const SelectedFileRequestProvider = ({ children }) => {
  const [requestName, setRequestName] = useState("");
  const [requestType, setRequestType] = useState("");
  const [requestId, setRequestId] = useState("");
  const [requestDetails, setRequestDetails] = useState("");
  const [status, setStatus] = useState("");
  const [requester, setRequester] = useState("");

  const setAll = (id,name, type,  details, status,requester) => {
    setRequestName(name);//--request_id, request_name, type_of_request,  request_details ,status
    setRequestType(type);
    setRequestId(id);
    setRequestDetails(details);
    setStatus(status);
    setRequester(requester);
  };

  return (
    <SelectedFileRequestContext.Provider value={{
      requestName, requestType, requestId, requestDetails, status, requester,setAll,
      setRequestName,
      setRequestType,
      setRequestId,
      setRequestDetails,
      setStatus

    }}>
      {children}
    </SelectedFileRequestContext.Provider>
  );
};

export const useSelectedFileRequestContext = () => {
  return useContext(SelectedFileRequestContext);
};
