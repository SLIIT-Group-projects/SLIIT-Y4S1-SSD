import React from "react";

function LabReportDetails({ report }) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold">Report Details</h2>
      <p>Report ID: {report.reportID}</p>
      <p>Uploaded: {new Date(report.uploadDate).toLocaleDateString()}</p>
      <p>File Size: {(report.fileSize / (1024 * 1024)).toFixed(2)} MB</p>
      <a
        href={`/${report.fileUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Download PDF
      </a>
    </div>
  );
}

export default LabReportDetails;
