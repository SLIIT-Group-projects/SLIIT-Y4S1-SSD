import React, { useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react"; // Import useAuth for getting the token
import Navbar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import AppNavBar from "../components/AppNavBar";
import Footer from "../components/Footer";
import axios from "axios";
import BlogSection from "../components/BlogCard";
import ValueSection from "../components/ValueSection";
import DoctorsViews from "../pages/DoctorsViews";

const HomePage = () => {
  const { user } = useUser(); // Get the current logged-in user
  const { getToken } = useAuth(); // Get the authentication token

  useEffect(() => {
    const saveUserToDatabase = async () => {
      if (user) {
        try {
          // Store clerkUserId in localStorage when the user logs in
          localStorage.setItem("clerkUserId", user.id);

          // Get the token from Clerk
          const token = await getToken();

          // Send user details along with the token to your Express API
          const response = await axios.post(
            "http://localhost:5000/user/save-user",
            {
              clerkUserId: user.id, // Clerk user ID
              email: user.primaryEmailAddress?.emailAddress, // User email
              firstName: user.firstName,
              lastName: user.lastName,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include the token in the headers
              },
            }
          );

          console.log(response.data.message); // Log the response from the server
        } catch (error) {
          console.error("Error saving user:", error);
        }
      }
    };

    saveUserToDatabase(); // Call the function when the component mounts
  }, [user, getToken]); // Make sure to include getToken in the dependency array

  return (
    <div>
      <HeroSection />
      <BlogSection />
      <ValueSection />
      <DoctorsViews />
      <Footer />
    </div>
  );
};

export default HomePage;
