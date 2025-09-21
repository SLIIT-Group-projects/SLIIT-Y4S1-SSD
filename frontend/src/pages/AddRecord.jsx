// AddRecord.jsx

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react"; // Import useAuth to get token

function AddRecord() {
  const { patientId } = useParams(); // Get the patientId from the URL params
  const { getToken } = useAuth(); // Get token with useAuth hook
  const navigate = useNavigate(); // To navigate after successful submission

  const [records, setRecords] = useState("");
  const [prescription, setPrescription] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken(); // Get the token

      const response = await axios.post(
        "http://localhost:5000/record/add-record",
        {
          userId: patientId, // Rename 'patientId' to 'userId'
          records,
          prescription: prescription.split(", ").map((item) => item.trim()), // Convert to array
          specialNotes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token in the request header
          },
        }
      );
      alert("Record saved successfully!");
      navigate("/"); // Navigate back to AllPatients or another desired page
    } catch (err) {
      console.error("Error saving record:", err);
      setError(
        err.response
          ? err.response.data.error || err.response.data.message
          : "Error saving record"
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        Add Record for Patient {patientId}
      </h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Records</label>
          <textarea
            value={records}
            onChange={(e) => setRecords(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Prescription</label>
          <input
            type="text"
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
            placeholder="Comma-separated"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Special Notes</label>
          <textarea
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Record
        </button>
      </form>

      
    </div>
  );
}

export default AddRecord;
