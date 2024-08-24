import React, { useState } from 'react';
import DataFetchingComponent from './DataFetchingComponent';
import NewFileRequest from './NewFileRequest';
import UpdateFileRequest from './UpdateFileRequest';
import { useSelectedFileRequestContext } from '../SelectedFileRequestContext/SelectedFileRequestContext';
import { useAuth } from '../AuthContext/AuthContext';

const CFilesRequests = () => {
    const {role,user} = useAuth();
    const { requestId, requester
       } = useSelectedFileRequestContext();
    const [showNewFileRequestForm, setShowNewFileRequestForm] = useState(false);
    const toggleNewFileRequestForm = () => {
      setShowNewFileRequestForm(!showNewFileRequestForm);
    };

  return (
    <div className='request-table-container'>
      <button className='refresh-button' onClick={()=>{window.location.reload()}}>Refresh</button>
      <DataFetchingComponent />
      <button className="add-new-request-button" onClick={toggleNewFileRequestForm}>
        Add New File Request
      </button>
      {showNewFileRequestForm && <NewFileRequest onClose={toggleNewFileRequestForm} />}
      {/* sadasd
      {requester}
      {user}
      {role} */}
      {(requester===user || role !='user')&&requestId&&<UpdateFileRequest/>}
    </div>
  );
};

export default CFilesRequests;
