import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://intx.onrender.com"; 

const apiClient = axios.create({
  baseURL: API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
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

export default apiClient;
