import React, { createContext, useState, useEffect } from "react";
import { makeRequest } from "../axios";

export interface User {
  id?: number;
  username: string;
  password: string;
  profileImg?: string;
  name?: string;
}

interface AuthContextData {
  user: User | null;
  logIn(user: User): void;
  logOut(): void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  async function logIn(inputs: User) {
    await makeRequest
      .post("/auth/login", inputs, {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => console.log(error));
  }

  async function logOut() {
    await makeRequest.post("/auth/logout");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        logIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
