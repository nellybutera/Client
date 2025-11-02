import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../api/auth"; 

export const AuthContext = createContext();

// Define a key for tokens
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_DATA_KEY = "userData";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage
    const saved = localStorage.getItem(USER_DATA_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  
  // api functions
  
const handleAuthSuccess = (responseData) => {
    // 1. Store Tokens
    localStorage.setItem(ACCESS_TOKEN_KEY, responseData.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, responseData.refresh_token);
    
    // 2. Extract and Store User Data
    let userData = {};
    if (responseData.user) {
        // This runs if the response is from /register and includes the full user object
        userData = {
            id: responseData.user.id,
            accountNumber: responseData.user.accountNumber,
            firstName: responseData.user.firstName,
            middleName: responseData.user.middleName,
            lastName: responseData.user.lastName,
            email: responseData.user.email,
            role: responseData.role,
            balance: responseData.user.balance,
        };
    } else {
        // This runs if the response is from /login (may need a separate /users/profile call)
        // For now, we only store tokens and role, then navigate.
        userData = { role: responseData.role, email: formData.email }; // Passing email for display
    }

    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    setUser(userData);
    navigate("/dashboard");
  };

  const register = async (formData) => {
    try {
      const data = await registerUser(formData);
      handleAuthSuccess(data);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error; // Re-throw the error for the component to display
    }
  };
cd
  const login = async (formData) => {
    try {
      const data = await loginUser(formData);
      handleAuthSuccess(data, formData);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    // 3. Clear ALL Auth Data
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    setUser(null);
    navigate("/");
  };
  
  const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

  return (
    <AuthContext.Provider value={{ user, register, login, logout, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};