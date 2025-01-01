import axios from 'axios';

// Define the base URL for the API
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',  // Your base URL here
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

