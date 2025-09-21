// src/UserProfile.js
import React, { useEffect } from "react";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import Navbar from "./NavBar";
import AppNavBar from "./AppNavBar";
import { Link } from "react-router-dom";
import { FaFlask } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";
import { FaClipboard } from "react-icons/fa";

const UserProfilePage = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      // Store clerkUserId in localStorage when the user accesses their profile
      localStorage.setItem("clerkUserId", user.id);
    }
  }, [user]);

  return (
    <>
      <div className="flex flex-col items-center bg-gray-100 min-h-screen p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-4">User Profile</h1>
          <div className="flex justify-center mb-4">
            <img
              src={user?.imageUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500 cursor-pointer transition-transform transform hover:scale-105"
            />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-600">
              {user?.primaryEmailAddress.emailAddress}
            </p>
          </div>
          <div className="border p-2 m-4 rounded-xl text-center justify-center">
            <div className="flex gap-6 m-4">
              <Link
                to="/appointment/patient/"
                className="flex items-center space-x-2 text-lg cursor-pointer"
              >
                <FaCalendarCheck className="text-blue-500" />
                <div>My Apointments</div>
              </Link>
            </div>

            <div className="flex gap-6 m-4">
              <Link
                to="/user-records"
                className="flex items-center space-x-2 text-lg cursor-pointer"
              >
                <FaClipboard className="text-blue-500" />
                <div>My Records</div>
              </Link>
            </div>
            <div className="flex gap-6 m-4">
              {/* Link to the /lab-tests page */}
              <Link
                to="/lab-tests"
                className="flex items-center space-x-2 text-lg cursor-pointer"
              >
                <FaFlask className="text-blue-500" />{" "}
                {/* Using react-icons FaFlask */}
                <div>Lab Tests</div>
              </Link>
            </div>
          </div>

          <div className="mt-4">
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
              <SignOutButton />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
