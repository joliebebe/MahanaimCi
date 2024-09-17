import React, { createContext, useState, useContext } from 'react';

export const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState ({
    nom: '',
    prenom: '',
    email: '',
    sexe: '',
    telephone: '',
    password: '',
    photo: '',
    login: '',
    accessToken: '', 
   //new_password:'',
    confirm_password:'',
  });
  const [token, setToken] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};
