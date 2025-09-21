import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function DoctorDashboard() {
  const [reportID, setReportID] = useState("");
  const [clerkUserId, setClerkUserId] = useState("");
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");
  const [doctorName, setDoctorName] = useState("Dr. Vihara Manjaree");
  const [reports, setReports] = useState([]);
  const [editReportId, setEditReportId] = useState(null); // For update
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/reports/all-reports"
        );
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle Delete
  const handleDelete = async (id, reportID) => {
    Swal.fire({
      title: `Are you sure you want to delete Report ID: ${reportID}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/reports/${id}`);
          setReports(reports.filter((report) => report._id !== id));
          Swal.fire("Deleted!", "The lab report has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Error deleting lab report.", "error");
        }
      }
    });
  };

  // Handle Edit - Load the report data into the form
  const handleEdit = (report) => {
    setEditReportId(report._id);
    setReportID(report.reportID);
    setClerkUserId(report.clerkUserId);
    setComment(report.doctorComments[0]?.comment || "");
    //setOldFileUrl(report.fileUrl); // Store the old file URL for viewing
    setFile(null);
    document.getElementById("uploadModal").style.display = "block";
  };
  // Handle Submit (Create or Update)
  const handleSubmit = async () => {
    if (!reportID || !clerkUserId || !comment) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill out all fields and upload a file!",
      });
      return;
    }

    const formData = new FormData();
    formData.append("reportID", reportID);
    formData.append("clerkUserId", clerkUserId);
    formData.append("comment", comment);
    formData.append("doctorName", doctorName);
    // Only append the file if a new file was selected
    if (file) {
      formData.append("report", file);
    }

    try {
      // Determine whether it's a create or update operation
      const url = editReportId
        ? `http://localhost:5000/api/reports/${editReportId}` // Update URL
        : "http://localhost:5000/api/reports/upload"; // Create URL
      const method = editReportId ? "put" : "post"; // HTTP method

      // Make API request
      await axios[method](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // if (editReportId) {
      //   // Update
      //   await axios.put(
      //     `http://localhost:5000/api/reports/${editReportId}`,
      //     formData
      //   );
      //   Swal.fire("Updated!", "The lab report has been updated.", "success");
      // } else {
      //   //Create
      //   await axios.post("http://localhost:5000/api/reports/upload", formData, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //       // Authorization: `Bearer ${localStorage.getItem("token")}`, // Corrected header
      //     },
      //   });
      Swal.fire({
        icon: "success",
        title: editReportId ? "Updated!" : "Uploaded!",
        text: "Lab report uploaded successfully!",
      });

      // Clear the form after successful submission
      setReportID("");
      setClerkUserId("");
      setComment("");
      setFile(null);
      setEditReportId(null); // Exit edit mode
      //setOldFileUrl(""); // Clear old file URL
      document.getElementById("uploadModal").style.display = "none"; // Close modal

      // Use navigate to refresh the page after submission
      navigate(0); // Reloads the current page
    } catch (error) {
      console.error("Error uploading lab report:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to upload lab report.",
      });
    }
  };
  // Handle View (Open PDF in a new tab)
  const handleView = (fileUrl) => {
    window.open(`http://localhost:5000/${fileUrl}`, "_blank");
  };
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold text-blue-700">Doctor Dashboard</h2>
      <div className="mt-4">
        <button
          onClick={() =>
            (document.getElementById("uploadModal").style.display = "block")
          }
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Upload Lab Report
        </button>
      </div>
      {/* Modal for uploading a lab report */}
      <div id="uploadModal" style={{ display: "none" }}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">
              {editReportId ? "Update Lab Report" : "Upload Lab Report"}
            </h3>
            <input
              type="text"
              placeholder="Report ID"
              value={reportID}
              onChange={(e) => setReportID(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              placeholder="Clerk User ID"
              value={clerkUserId}
              onChange={(e) => setClerkUserId(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <textarea
              placeholder="Doctor Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />

            {/* Show the existing PDF file if it's in edit mode */}
            {editReportId && (
              <div className="mb-4">
                <p className="text-blue-600">Previously Uploaded Report:</p>
                <a
                  href={`http://localhost:5000/${
                    reports.find((r) => r._id === editReportId)?.fileUrl
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Current PDF
                </a>
              </div>
            )}
            <input
              type="file"
              onChange={handleFileChange}
              className="mb-4 p-2"
            />
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              {editReportId ? "Update" : "Submit"}
            </button>
            <button
              onClick={() =>
                (document.getElementById("uploadModal").style.display = "none")
              }
              className="ml-2 bg-red-500 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>{" "}
      {/* Table showing uploaded lab reports */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-blue-500">
          All Uploaded Lab Reports
        </h2>
        <table className="min-w-full bg-white mt-4">
          <thead>
            <tr>
              <th className="py-2 px-4">Report ID</th>
              <th className="py-2 px-4">Patient Name</th>
              <th className="py-2 px-4">Patient Email</th>
              <th className="py-2 px-4">Clerk User ID</th>
              <th className="py-2 px-4">Upload Date</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report._id}>
                  <td className="py-2 px-4">{report.reportID}</td>
                  <td className="py-2 px-4">
                    {report.userId?.firstName || "N/A"}{" "}
                    {report.userId?.lastName || "N/A"}
                  </td>
                  <td className="py-2 px-4">{report.userId?.email || "N/A"}</td>
                  <td className="py-2 px-4">{report.userId?.clerkUserId}</td>
                  <td className="py-2 px-4">
                    {new Date(report.uploadDate).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleView(report.fileUrl)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(report)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(report._id, report.reportID)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default DoctorDashboard;
