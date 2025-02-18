import axios from 'axios';

const api = axios.create({
  baseURL: "/api",
  timeout: 10000, // 10 seconds timeout
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Default error structure
    let standardizedError = {
      message: 'An unknown error occurred.',
      status: null,
      errors: null,
      data: null,
    };

    // Check if the error has a response (server responded with a status outside the 2xx range)
    if (error.response) {
      standardizedError = {
        message: error.response.data?.message || 'An error occurred while processing your request.',
        status: error.response.status,
        errors: error.response.data?.errors || null,
        data: error.response.data || null,
      };
      console.error(`API Error [${standardizedError.status}]:`, standardizedError.message);
    }
    // Request was made but no response was received
    else if (error.request) {
      standardizedError.message = 'No response received from the server.';
      console.error('No response received:', error.request);
    }
    // Something else happened while setting up the request
    else {
      standardizedError.message = error.message;
      console.error('Error setting up request:', error.message);
    }
    
    // Reject with the standardized error object
    return Promise.reject(standardizedError);
  }
);

export default api;
