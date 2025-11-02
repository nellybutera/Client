// src/api/auth.js

import axios from 'axios';

const API_URL = "http://localhost:3000/auth"; 

export const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, formData);
    // The backend returns user, access_token, refresh_token, etc.
    return response.data; 
  } catch (error) {
    // for catching specific backend errors (e.g., 409 Conflict)
    throw error.response ? error.response.data : new Error("Network error or server unavailable.");
  }
};

export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, formData);
    // The backend returns access_token, refresh_token, and role.
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error or server unavailable.");
  }
};