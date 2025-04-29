import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const testSQLInjection = async (target, credentials) => {
  try {
    const response = await api.post('/sqlinjection/test', {
      target,
      ...credentials
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'SQL Injection test failed');
  }
};

export const testBruteForce = async (target, credentials, wordlist) => {
  try {
    const response = await api.post('/bruteforce/test', {
      target,
      ...credentials,
      wordlist
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Brute Force test failed');
  }
};

export const checkPermissions = async (target, credentials) => {
  try {
    const response = await api.post('/enumerate', {
      target,
      ...credentials
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Permission check failed');
  }
};

export const generateReport = async (scanResults) => {
  try {
    const response = await api.post('/reports/generate', {
      scanResults
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Report generation failed');
  }
};

export const getScanHistory = async () => {
  try {
    const response = await api.get('/scans/history');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch scan history');
  }
};
export const getReportById = async (id) => {
  try {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch report');
  }
};

export const downloadReport = async (id) => {
  try {
    const response = await api.get(`/reports/download/${id}`, {
      responseType: 'blob'
    });
    
    // Create a blob from the PDF stream
    const file = new Blob([response.data], { type: 'application/pdf' });
    
    // Create a URL for the blob
    const fileURL = URL.createObjectURL(file);
    
    // Create a temporary anchor element to trigger the download
    const tempLink = document.createElement('a');
    tempLink.href = fileURL;
    tempLink.setAttribute('download', `report-${id}.pdf`);
    tempLink.click();
    
    // Clean up
    URL.revokeObjectURL(fileURL);
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to download report');
  }
};
export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/auth/login', {
      username,
      password
    });

    // Save the token to localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export default api;
