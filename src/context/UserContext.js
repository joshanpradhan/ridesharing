import React, { createContext, useState } from "react";
export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [jwt, setJwt] = useState();
  const [rideHistory, setRideHistory] = useState();
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        jwt,
        setJwt,
        rideHistory,
        setRideHistory,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
