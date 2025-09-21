import React, { useState } from "react";
import axios from "axios";

function AdminUploadPage() {
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState("");
  const [reportID, setReportID] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("report", file);
    formData.append("reportID", reportID);
    formData.append("userId", userId);

    try {
      await axios.post("/api/reports/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Report uploaded successfully!");
    } catch (error) {
      console.error("Error uploading report:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold">Upload Lab Report</h2>
      <input
        type="text"
        placeholder="Report ID"
        value={reportID}
        onChange={(e) => setReportID(e.target.value)}
      />
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Upload
      </button>
    </div>
  );
}

export default AdminUploadPage;
