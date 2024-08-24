import React, { useState } from 'react';
import NewTestForm from './NewTestForm'; // Make sure to import the correct path

const TestFormContainer = ({ request_Id }) => {
    const [testVisibility, setTestVisibility] = useState(false);

    const toggleTestVisibility = () => {
        setTestVisibility(!testVisibility);
    };

    return (
        <div>
            
            <button className="add-new-button" onClick={toggleTestVisibility}>Add New Test</button>
            {testVisibility && (
                <NewTestForm
                    toggleVisibility={toggleTestVisibility}
                    request_Id={request_Id}
                />
            )}
        </div>
    );
};

export default TestFormContainer;
