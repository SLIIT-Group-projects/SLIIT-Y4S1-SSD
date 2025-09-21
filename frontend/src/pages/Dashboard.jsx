// src/UserProfile.js
import React from "react";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useUser();

  return (
    <>
      <div className="">
        <button className="bg-blue-500 p-3 text-white font-bold m-4 rounded-md">
          <Link to="/create-blog">Create Blogs</Link>{" "}
        </button>
        <button className="bg-blue-500 p-3 text-white font-bold m-4 rounded-md">
          <Link to="/appointment/doctor/">Manage Appointments</Link>{" "}
        </button>
        <button className="bg-blue-500 p-3 text-white font-bold m-4 rounded-md">
          <Link to="">Add Records</Link>{" "}
        </button>
        <button className="bg-blue-500 p-3 text-white font-bold m-4 rounded-md">
          <Link to="/dashboard-labtest">LAB Test</Link>{" "}
        </button>
      </div>
    </>
  );
};
export default Dashboard;
