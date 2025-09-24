import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

// Create a secure API client that automatically includes Clerk tokens
const createSecureApiClient = () => {
  const { getToken } = useAuth();

  const apiClient = axios.create();

  // Add request interceptor to include Clerk token
  apiClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return apiClient;
};

export const getLabReport = async (id, getToken) => {
  const token = await getToken();
  const response = await axios.get(`/api/reports/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addDoctorComment = async (reportId, commentData, getToken) => {
  const token = await getToken();
  const response = await axios.post(
    `/api/reports/${reportId}/comment`,
    commentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
