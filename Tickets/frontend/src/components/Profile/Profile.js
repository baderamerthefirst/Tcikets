import React from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, user_id, role,status } = useAuth();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>User Profile</h2>
      </div>
      <div className="user-info">
        <p className="user-id">userId: {user_id}</p>
        <p className="username">Username: {user}</p>
        <p className="role">Role: {role}</p>
        <p className="status">status: {status}</p>
      </div>
    </div>
  );
};

export default Profile;
