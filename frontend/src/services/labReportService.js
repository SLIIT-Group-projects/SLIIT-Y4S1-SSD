import axios from "axios";

export const getLabReport = async (id) => {
  const response = await axios.get(`/api/reports/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const addDoctorComment = async (reportId, commentData) => {
  const response = await axios.post(
    `/api/reports/${reportId}/comment`,
    commentData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};
