import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const AppointmentsTable = () => {
  const { getToken, userId } = useAuth(); // Assuming userId gives you the current doctor's ID
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          "http://localhost:5000/appointment/get-doctor-appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              doc_id: userId, // Pass the current doctor's ID
            },
          }
        );

        if (
          response.data.appointments &&
          response.data.appointments.length > 0
        ) {
          setAppointments(response.data.appointments);
        } else {
          setAppointments([]); // Set appointments to an empty array if no data found
          setError("No appointments available.");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("No Upcoming appointments.");
      }
    };

    fetchAppointments();
  }, [getToken, userId]); // Include userId in dependency array

  const handleApprove = async (appointmentId) => {
    try {
      const token = await getToken();
      await axios.put(
        `http://localhost:5000/appointment/appointment-update/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Appointment approved.");
      // Reload the page after the appointment is approved
      window.location.reload();
    } catch (err) {
      console.error("Error approving appointment:", err);
      alert("Failed to approve appointment.");
    }
  };

  return (
    <div className="medi-main-gradient">
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-extrabold medi-text-100 mb-4 text-center pt-4 pb-3">
          Doctor's Appointments
        </h2>
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
        {appointments.length > 0 ? (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="madi-bg-primary-100 text-white uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Patient Name</th>
                <th className="py-3 px-6 text-left">Doctor Name</th>
                <th className="py-3 px-6 text-left">Slot</th>
                <th className="py-3 px-6 text-left">Age</th>
                <th className="py-3 px-6 text-left">Note</th>
                <th className="py-3 px-6 text-left">Appointment Date</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {appointments.map((appointment) => (
                <tr
                  key={appointment._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {appointment.patient_name}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {appointment.doctor_name}
                  </td>
                  <td className="py-3 px-6 text-left">{appointment.slot}</td>
                  <td className="py-3 px-6 text-left">{appointment.age}</td>
                  <td className="py-3 px-6 text-left">{appointment.note}</td>
                  <td className="py-3 px-6 text-left">
                    {new Date(appointment.appointment_date).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-left">{appointment.status}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleApprove(appointment._id)}
                      className="madi-bg-primary medi-text-100 font-bold px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !error && (
            <div className="text-gray-600 text-center mt-4">
              No appointments found.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AppointmentsTable;
