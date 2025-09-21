import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react"; // Import useAuth to get token
import { Link } from "react-router-dom";

function UserDataDisplay() {
  const { user } = useUser(); // Get the current user
  const { getToken } = useAuth(); // Get token with useAuth hook

  const [userData, setUserData] = useState(null); // State to hold user data
  const [error, setError] = useState(null); // State to hold error message

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const clerkUserId = user.id; // Retrieve Clerk user ID

        try {
          const token = await getToken();
          console.log("token - ",token)

          const response = await axios.get(
            "http://localhost:5000/user/get-user-data",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Attach the token in the request header
              },
            }
          );

          setUserData(response.data); // Store the fetched user data
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError(error.response?.data?.message || "Error fetching user data");
        }
      }
    };

    fetchUserData();
  }, [user, getToken]);

  // Render loading state or error message
  if (!userData && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>User Data</h1>
      <p>
        <strong>First Name:</strong> {userData.firstName}
      </p>
      <p>
        <strong>Last Name:</strong> {userData.lastName}
      </p>
      <p>
        <strong>Email:</strong> {userData.email}
      </p>
      <p>
        <strong>Favorite Color:</strong> {userData.additionalData}{" "}
        {/* Assuming additionalData holds the favorite color */}
      </p>
      <Link to="/display-all-user-details">
        <button className="bg-blue-400 p-4 m-3">get all users details</button>
      </Link>
    </div>
  );
}

export default UserDataDisplay;
