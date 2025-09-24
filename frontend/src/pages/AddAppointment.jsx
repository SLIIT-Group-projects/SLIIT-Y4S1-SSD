import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const MAX_APPTS_PER_WINDOW = 10;      // server limiter
const WINDOW_LABEL = "30 minutes";   //  limiter window

const AppointmentForm = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill patient info from Clerk user
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        clerkUserId: user.id,
        patient_name: user.fullName || "",
        patient_email: user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [user]);

  // Load doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/doctor/all-doctors"
        );
        setDoctors(response.data || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Prevent negative values for the age field
    if (name === "age") {
      const num = Number(value);
      if (Number.isNaN(num) || num < 0) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDoctorChange = (e) => {
    const selectedDoctorId = e.target.value;
    const selectedDoctor = doctors.find(
      (doc) => doc.clerkUserId === selectedDoctorId
    );

    setFormData((prev) => ({
      ...prev,
      doctor_name: selectedDoctor?.name || "",
      doc_id: selectedDoctorId,
      day: "",
      slot: "",
    }));

    setAvailableDays(selectedDoctor?.day || []);
    setAvailableSlots(selectedDoctor?.slot || []);
  };

  // Optional: parse retry-after / ratelimit-reset for nicer UX
  const getWaitSecondsFromHeaders = (headers = {}) => {
    if (!headers) return null;
    // axios lowercases response header keys
    const retryAfter = parseInt(headers["retry-after"], 10);
    if (!Number.isNaN(retryAfter)) return retryAfter;

    const rlReset = parseInt(headers["ratelimit-reset"], 10);
    if (!Number.isNaN(rlReset)) {
      // Some libs send seconds-until-reset; some send a unix epoch. Handle both.
      if (rlReset > 1e10) {
        return Math.max(0, Math.round(rlReset - Date.now() / 1000));
      }
      return rlReset;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = await getToken();

      const response = await axios.post(
        "http://localhost:5000/appointment/create-appointment",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Appointment created successfully:", response.data);
      alert("Appointment created successfully");
      navigate("/appointment/patient/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 429) {
          const wait = getWaitSecondsFromHeaders(err.response?.headers);
          const waitText =
            wait != null ? ` Please try again in about ${wait} seconds.` : "";
          alert(
            `Maximum appointments allowed is ${MAX_APPTS_PER_WINDOW} per ${WINDOW_LABEL}.${waitText}`
          );
          setIsSubmitting(false);
          return;
        }

        if (status === 401) {
          alert("You need to sign in to book an appointment.");
          setIsSubmitting(false);
          return;
        }

        if (status === 400) {
          alert(err.response?.data?.message || "Invalid data. Please check the form.");
          setIsSubmitting(false);
          return;
        }

        if (status >= 500) {
          alert("Server error. Please try again shortly.");
          setIsSubmitting(false);
          return;
        }
      }

      console.error("Error creating appointment:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      // keep disabled only if we navigated; otherwise re-enable
      setIsSubmitting(false);
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
            onKeyDown={(e) => e.key === "-" && e.preventDefault()}
            className="w-full p-2 border-2 border-blue-500 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter age"
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
            min={formData.current_date}
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
            disabled={isSubmitting}
            className={`w-full px-6 py-2 text-white madi-bg-primary-100 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isSubmitting ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Booking..." : "Book Appointment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
