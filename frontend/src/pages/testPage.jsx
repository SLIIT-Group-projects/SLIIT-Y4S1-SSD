import React, { useState } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react"; // Import useAuth to get token

function SaveUserData() {
  const { user } = useUser(); // Get the current user
  const { getToken } = useAuth(); // Get token with useAuth hook

  // State to store the user's input for additional data
  const [favoriteColor, setFavoriteColor] = useState("");

  // console.log(user.primaryEmailAddress.emailAddress);

  const saveUserData = async () => {
    if (user) {
      const firstName = user.firstName || "";
      const lastName = user.lastName || "";
      const additionalData = favoriteColor; // Use favoriteColor directly as a string
      const clerkUserId = user.id; // Retrieve Clerk user ID
      const email = user.primaryEmailAddress.emailAddress;

      try {
        const token = await getToken();

        console.log("Saving user data:", {
          clerkUserId,
          email,
          firstName,
          lastName,
          additionalData,
        });

        const response = await axios.post(
          "http://localhost:5000/user/save-user-data",
          {
            clerkUserId, // Include the Clerk user ID
            email,
            firstName,
            lastName,
            additionalData, // Send additionalData as a string
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach the token in the request header
            },
          }
        );
        console.log("User data saved:", response.data);
      } catch (error) {
        console.error(
          "Error saving user data:",
          error.response?.data || error.message
        );
      }
    } else {
      console.warn("No user found");
    }
  };

  return (
    <div>
      <h1>Welcome, {user ? user.firstName : "User"}!</h1>

      {/* Input field to collect the favorite color */}
      <input
        type="text"
        placeholder="Enter your favorite color"
        value={favoriteColor}
        onChange={(e) => setFavoriteColor(e.target.value)} // Update state on change
      />

      <button onClick={saveUserData}>Save User Data</button>
    </div>
  );
}

export default SaveUserData;
