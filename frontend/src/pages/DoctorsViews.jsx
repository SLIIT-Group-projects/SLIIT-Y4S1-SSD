import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const DoctorViews = () => {
  const { getToken } = useAuth(); // Get the Clerk token
  const [doctors, setDoctors] = useState([]); // State to hold doctors
  const [filteredDoctors, setFilteredDoctors] = useState([]); // State for filtered doctors
  const [error, setError] = useState(null); // State for error handling
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  // Default profile image URL
  const defaultProfileImage =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = await getToken(); // Retrieve the token for authorization
        console.log("token - ", token);

        const response = await axios.get(
          "http://localhost:5000/doctor/all-doctors",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the headers
            },
          }
        );

        setDoctors(response.data); // Set doctors in state
        setFilteredDoctors(response.data); // Initialize filtered doctors
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to fetch doctors."); // Set error if fetching fails
      }
    };

    fetchDoctors(); // Call the fetch function
  }, [getToken]);

  // Update filtered doctors based on search term
  useEffect(() => {
    const filtered = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>; // Display error message if there is an error
  }

  return (
    <div className="medi-main-gradient appo-all-main">
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-extrabold mb-4 medi-text-100 text-center pt-6 pb-4">
          Our Doctors
        </h2>
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search doctors by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
            >
              <div className=" mb-4">
                <img
                  src={defaultProfileImage}
                  alt={`${doctor.name}'s profile`}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <div className="absolute top-0 right-0 bg-green-500 text-white text-sm rounded-bl-lg px-2 py-1">
                  Available
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{doctor.name}</h3>
              <p className="text-gray-700 mb-1">Experience: {doctor.experience} years</p>
              <p className="text-gray-700 mb-1">Bio: {doctor.bio}</p>
              <p className="text-gray-700 mb-1">
                Email:{" "}
                <a href={`mailto:${doctor.email}`} className="text-blue-500">
                  {doctor.email}
                </a>
              </p>
              <p className="text-gray-700 mb-1">
                Availability: {doctor.day.join(", ")}
              </p>
              <p className="text-gray-700">Slots: {doctor.slot.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorViews;
