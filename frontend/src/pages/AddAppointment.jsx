import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AppointmentForm = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    clerkUserId: "",
    patient_name: "",
    patient_email: "",
    age: "",
    doctor_name: "",
    doc_id: "",
    day: "",
    slot: "",
    appointment_date: "",
    note: "",
    current_date: new Date().toISOString().split("T")[0],
    status: "Pending",
  });
  const [doctors, setDoctors] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        clerkUserId: user.id,
        patient_name: user.fullName || "",
        patient_email: user.primaryEmailAddress?.emailAddress || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/doctor/all-doctors"
        );
        setDoctors(response.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Prevent negative values for the age field
    if (name === "age" && value < 0) {
      return; // Do not update state if age is negative
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleDoctorChange = (e) => {
    const selectedDoctorId = e.target.value;
    const selectedDoctor = doctors.find(
      (doc) => doc.clerkUserId === selectedDoctorId
    );

    setFormData({
      ...formData,
      doctor_name: selectedDoctor?.name || "",
      doc_id: selectedDoctorId,
      day: "",
      slot: "",
    });

    setAvailableDays(selectedDoctor?.day || []);
    setAvailableSlots(selectedDoctor?.slot || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const response = await axios.post(
        "http://localhost:5000/appointment/create-appointment",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Appointment created successfully:", response.data);
      alert("Appointment created successfully");

      // Navigate to the desired URL after successful booking
      navigate("/appointment/patient/");
    } catch (err) {
      console.error("Error creating appointment:", err);
    }
  };

  return (
    <div className="medi-main-gradient pt-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg"
      >
        <div className="text-3xl font-bold medi-text-100 pb-3 text-center my-6">
          Book Your Appointment
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Patient Name</label>
          <input
            type="text"
            name="patient_name"
            value={formData.patient_name}
            onChange={handleInputChange}
            className="w-full p-2 border-2 border-blue-500 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Patient Email</label>
          <input
            type="email"
            name="patient_email"
            value={formData.patient_email}
            onChange={handleInputChange}
            className="w-full p-2 border-2 border-blue-500 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            min="0"
            value={formData.age}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "-" && e.preventDefault()} // Prevent typing "-"
            className="w-full p-2 border-2 border-blue-500 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Doctor Name</label>
          <select
            name="doctor_name"
            value={formData.doc_id}
            onChange={handleDoctorChange}
            className="w-full p-2 border-2 border-blue-500 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.clerkUserId} value={doctor.clerkUserId}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Day</label>
          <select
            name="day"
            value={formData.day}
            onChange={handleInputChange}
            className="w-full p-2 border-2 border-blue-500 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!availableDays.length}
          >
            <option value="">Select Day</option>
            {availableDays.map((day, index) => (
              <option key={index} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Slot</label>
          <select
            name="slot"
            value={formData.slot}
            onChange={handleInputChange}
            className="w-full p-2 border-2 border-blue-500 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!availableSlots.length}
          >
            <option value="">Select Slot</option>
            {availableSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Appointment Date</label>
          <input
            type="date"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={handleInputChange}
            min={formData.current_date} // Disable previous dates
            className="w-full p-2 border-2 border-blue-500 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Note</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            className="w-full p-2 border-2 border-blue-500 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any additional notes"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-6 py-2 text-white madi-bg-primary-100 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Book Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
