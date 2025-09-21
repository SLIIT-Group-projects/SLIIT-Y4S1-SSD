import React, { useState, useEffect } from "react";
import LabReportDetails from "../components/labReportDetails";
import DoctorComments from "../components/DoctorComments";
import { getLabReport, addDoctorComment } from "../services/labReportService";

function LabReportPage({ match }) {
  const [report, setReport] = useState(null);
  const [comment, setComment] = useState("");
  const [doctorName, setDoctorName] = useState("Dr. Smith");

  useEffect(() => {
    const fetchReport = async () => {
      const reportData = await getLabReport(match.params.id); // Fetch specific report by ID
      setReport(reportData);
    };

    fetchReport();
  }, [match.params.id]);

  const handleAddComment = async () => {
    try {
      const updatedReport = await addDoctorComment(report._id, {
        doctorName,
        comment,
      });
      setReport(updatedReport);
      setComment(""); // Clear comment input after submission
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {report && (
        <>
          <LabReportDetails report={report} />
          <DoctorComments comments={report.doctorComments} />

          {/* Add doctor comment (visible only for admins/doctors) */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Add Doctor Comment</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Add your comment here..."
            ></textarea>
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Add Comment
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default LabReportPage;
