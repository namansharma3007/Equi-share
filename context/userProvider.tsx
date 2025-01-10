import React, { useState, useContext, createContext, useEffect } from "react";
import { checkUserSession } from "@/lib/auth";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<boolean>(false);
  const [user, setUserId] = useState<string>("");


  useEffect(() => {
    Promise.resolve(checkUserSession()).then((data) => {
      if (data) {
        setToken(true);
        setUserId(data.decoded.userId);
      } else {
        setToken(false);
        setUserId("");
      }
    }).catch((error) => {
      setToken(false);
      setUserId("");
      console.log("Error checking user session:", error);
    });
  }, []);



  return (
    <UserContext.Provider value={{ token, user, setToken, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};