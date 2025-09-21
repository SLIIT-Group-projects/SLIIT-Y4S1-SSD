import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

function UserRecords() {
  const { getToken } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `http://localhost:5000/record/user-records`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRecords(response.data.records);
        setLoading(false);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-lg text-gray-600">Loading records...</p>
    );
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">Error: {error}</p>;
  }

  return (
    <div className="medi-main-gradient ">
      <div className="my-12 mx-6 md:mx-16 lg:mx-24">
        <h2 className="text-center font-extrabold text-4xl pt-5 text-gray-900 mb-8">
          Your Medical Records
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
                  Doctor Name
                </th>{" "}
                {/* New column */}
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
                      {record.doctorId?.name}
                    </td>{" "}
                    {/* Display doctor name */}
                    <td className="px-6 py-4 border-b border-gray-200">
                      {new Date(record.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center px-6 py-4 text-gray-500"
                  >
                    No records found for this user.
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

export default UserRecords;
