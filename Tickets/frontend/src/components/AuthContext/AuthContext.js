import { createContext, useContext, useState } from 'react';
import { removeAccessToken } from '../AccessToken/AccessToken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [user_id, setUser_id] = useState(null);
  const [role, setRole] = useState(null);
  const [status, setStatus] = useState(null);


  const setLoggedUser = (username, user_id, role,status) => {

    setUser(username);
    setUser_id(user_id);
    setRole(role);
    setStatus(status);
  };

  const logout = () => {
    setUser(null);
    setUser_id(null);
    setRole(null);
    setStatus(null);
    removeAccessToken();


  };

  return (
    <AuthContext.Provider value={{ user, user_id, role,status, logout, setLoggedUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
