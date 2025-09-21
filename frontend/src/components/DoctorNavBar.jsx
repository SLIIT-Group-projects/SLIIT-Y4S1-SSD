// DoctorNavBar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import DoctorDashboardComps from "./DoctorDashboardComps";

const DoctorNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
        </div>
        <nav className="mt-10">
          <ul>
            <li className="px-6 py-3 hover:bg-gray-700">
              <Link to="/">Home</Link>
            </li>
            <li className="px-6 py-3 hover:bg-gray-700">
              <Link to="/appointment/doctor/">Appointments</Link>
            </li>
            <li className="px-6 py-3 hover:bg-gray-700">
              <Link to="/dashboard-labtest">Lab Reports</Link>
            </li>
            <li className="px-6 py-3 hover:bg-gray-700">
              <Link to="/AllPatients">Medical Records</Link>
            </li>
            <li className="px-6 py-3 hover:bg-gray-700">
              <Link to="/get-doctor-blogs">Blogs</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-screen bg-gray-100 lg:ml-64">
        {" "}
        {/* Added margin here */}
        <div className="flex items-center justify-between p-4 bg-white shadow-md lg:hidden">
          <button onClick={toggleSidebar} className="text-gray-800">
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
          <h2 className="text-xl font-semibold">Doctor Dashboard</h2>
        </div>
        {/* Use the DashboardContent component here */}
        <DoctorDashboardComps />
      </div>
    </div>
  );
};

export default DoctorNavBar;
