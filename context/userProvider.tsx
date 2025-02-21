import React, { useState, useContext, createContext, useEffect } from "react";
import { checkUserSession } from "@/lib/auth";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<boolean>(false);
  const [user, setUserId] = useState<string>("");
  const [userData, setUserData] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState<boolean>(false);

  useEffect(() => {
    setSessionLoading(true);
    checkUserSession()
      .then((data) => {
        if (data) {
          setToken(true);
          setUserId(data.userId);
        } else {
          setToken(false);
          setUserId("");
        }
      })
      .catch((error) => {
        setToken(false);
        setUserId("");
      }).finally(() => setSessionLoading(false));
  }, []);

  useEffect(() => {
    if(!user || !token) return
    getUserData().then((data) => {
      if (data) {
        setUserData(data.user);
      } else {
        throw new Error("Internal server error! User not found");
      }
    }).catch((error) => {
      setUserData(null);
    });

  }, [user, token]);

  return (
    <UserContext.Provider
      value={{ token, user, setToken, setUserId, userData, setUserData, sessionLoading }}
    >
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

async function getUserData() {
  try {
    const response = await fetch(`/api/users/get-user/`, {
      method: "GET",
    });
    const data = await response.json();
    if (!response.ok) {
      return null;
    }
    return data;
  } catch (error) {
    return null;
  }
}