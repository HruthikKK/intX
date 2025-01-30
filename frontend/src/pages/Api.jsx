import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://intx.onrender.com"; 

export const apiClient = axios.create({
  baseURL: API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiFetch = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    console.log("Making request to:", url);  // Log the URL for debugging
  
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
  
    return response.json();
  };
  
