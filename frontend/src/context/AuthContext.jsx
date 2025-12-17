import React, { createContext } from 'react';

export const authDataContext = createContext();

function AuthContext({ children }) {
  const serverUrl = "http://localhost:4000";

  return (
    <authDataContext.Provider value={{ serverUrl }}>
      {children}
    </authDataContext.Provider>
  );
}

export default AuthContext;

