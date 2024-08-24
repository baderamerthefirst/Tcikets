import React from "react";
import { useAuth } from "../AuthContext/AuthContext";
import CreateUser from "./CreateUser.js";
import ViewUsers from "./ViewUsers.js";
import ResetPasswordForm from "./ResetPasswordForm.js";
// import Users from './Users.js';
import "./Setting.css"; // Assuming you have a CSS file for styling

const Setting = () => {
  const { role } = useAuth();

  return (
    <div className='setting-container'>
      {/* {role !== "Admin" && (
        <p style={{ padding: 20 }}>
          Oops! This area is for admins only. Looks like you took a wrong turn.
          Maybe you should go some where else 😄
        </p>
      )} */}

      

      {role != "user" && <ViewUsers />}
      {role != "user" && <CreateUser />}
      <ResetPasswordForm/>
      {/* {role === 'Admin' && <ViewUsers />} */}
    </div>
  );
};

export default Setting;
