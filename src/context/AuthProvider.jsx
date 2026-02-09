import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { loginRequest } from "../api/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const userData = await loginRequest(username.trim(), password.trim());
      setUser(userData);
      return true;
    } catch {
      alert("Username və ya password səhvdir");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

return (
  <AuthContext.Provider value={{ user, setUser, login, logout }}>
    {children}
  </AuthContext.Provider>
);

}
