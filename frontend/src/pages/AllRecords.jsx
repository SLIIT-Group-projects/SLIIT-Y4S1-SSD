import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // To get the patientId from URL

function AllRecords() {
  const { patientId } = useParams(); // Get patient ID from the URL
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all records for the specific patient
    axios
      .get(`http://localhost:5000/record/get-records/${patientId}`) // Assuming backend route exists
      .then((res) => {
        setRecords(res.data.records);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.message);
        setError(err.message);
        setLoading(false);
      });
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading records...</p>
      </div>
    ); // Loading state
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    ); // Error state
  }

  return (
    <div className="medi-main-gradient ">
      <div className=" my-12 mx-6 md:mx-16 lg:mx-24">
        <h2 className="text-center font-extrabold text-4xl pt-5 text-gray-900 mb-8">
          Patient Records
        </h2>
        <div className="relative overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left font-semibold tracking-wide"
                >
                  Record Details
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left font-semibold tracking-wide"
                >
                  Prescription
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left font-semibold tracking-wide"
                >
                  Special Notes
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left font-semibold tracking-wide"
                >
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {records.length > 0 ? (
                records.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b border-gray-200">
                      {record.records}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      {record.prescription.join(", ")}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      {record.specialNotes}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      {new Date(record.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center px-6 py-4 text-gray-500"
                  >
                    No records found for this patient.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AllRecords;
