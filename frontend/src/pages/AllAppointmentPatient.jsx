import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const PatientAppointments = () => {
  const { getToken } = useAuth(); // Get the Clerk token
  const [appointments, setAppointments] = useState([]); // State to hold appointments
  const [error, setError] = useState(null); // State for error handling
  const [message, setMessage] = useState(null); // State for success or error messages

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = await getToken(); // Retrieve the token for authorization

        const response = await axios.get(
          "http://localhost:5000/appointment/get-patient-appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the headers
            },
          }
        );

        setAppointments(response.data.appointments); // Set appointments in state
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("No appointments."); // Set error if fetching fails
      }
    };

    fetchAppointments(); // Call the fetch function
  }, [getToken]);

  const handleDelete = async (appointmentId) => {
    // Ask for confirmation before proceeding with deletion
    const confirmDelete = window.confirm("Are you sure you want to cancel this appointment?");
    
    if (!confirmDelete) {
      return; // Exit the function if the user cancels
    }

    try {
      const token = await getToken(); // Retrieve the token for authorization

      // Make a delete request to the backend
      const response = await axios.delete(
        `http://localhost:5000/appointment/delete-appointment/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the headers
          },
        }
      );

      // If the deletion is successful, filter out the deleted appointment
      setAppointments((prevAppointments) =>
        prevAppointments.filter(
          (appointment) => appointment._id !== appointmentId
        )
      );

      // Display success message
      setMessage(response.data.message);
    } catch (err) {
      console.error("Error deleting appointment:", err);
      setError(err.response?.data?.message || "Failed to delete appointment."); // Set error message if deletion fails
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>; // Display error message if there is an error
  }

  return (
    <div className="medi-main-gradient appo-all-main">
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-extrabold mb-4 medi-text-100 text-center pt-6 pb-4">
          Your Appointments
        </h2>
        {message && (
          <p className="text-green-500 text-center mb-4">{message}</p>
        )}{" "}
        {/* Display success message */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="madi-bg-primary-100 text-white uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Patient Name</th>
                <th className="py-3 px-6 text-left">Doctor Name</th>
                <th className="py-3 px-6 text-left">Appointment Date</th>
                <th className="py-3 px-6 text-left">Slot</th>
                <th className="py-3 px-6 text-left">Age</th>
                <th className="py-3 px-6 text-left">Note</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {appointments.map((appointment) => (
                <tr
                  key={appointment._id}
                  className="border-b border-gray-200 hover:bg-gray-100 mb-4 gap-4"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {appointment.patient_name}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {appointment.doctor_name}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {new Date(appointment.appointment_date).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-left">{appointment.slot}</td>
                  <td className="py-3 px-6 text-left">
                    {appointment.age}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {appointment.note}
                  </td>
                  <td className="py-3 px-6 text-left">{appointment.status}</td>
                  <td className="py-3 px-6 text-center">
                    {appointment.status !== "Completed" && (
                      <button
                        onClick={() => handleDelete(appointment._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;
