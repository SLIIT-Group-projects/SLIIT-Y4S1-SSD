import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react"; // Import the useUser hook
import axios from "axios"; // Assuming you're using axios for API calls

export default function UserDetails() {
  const { user } = useUser(); // Get the logged-in user's details
  const [allUsers, setAllUsers] = useState([]); // State to hold all users
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    // Check if the logged-in user's role is "doctor"
    console.log(user.publicMetadata.role);
    if (user && user.publicMetadata.role === "doctor") {
      // Fetch all users if the role is "doctor"
      axios
        .get("http://localhost:5000/user/all-users") // Assuming you have an API endpoint to get all users
        .then((response) => {
          setAllUsers(response.data); // Set the data in state
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If not a doctor, show message
  if (user.publicMetadata.role !== "doctor") {
    return <div>You do not have permission to view this information.</div>;
  }

  return (
    <div>
      <h1>All Users Details</h1>
      {allUsers.length > 0 ? (
        <ul>
          {allUsers.map((user, index) => (
            <li key={index}>
              <p>Name: {user.firstName}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.additionalData}</p>
              {/* Add more details as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}
