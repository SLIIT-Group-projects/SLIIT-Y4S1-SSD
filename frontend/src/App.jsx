import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";
import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate for redirection
import SigninPage from "./components/SignIn";
import SignupPage from "./components/SignUp";
import UserProfilePage from "./components/UserProfile";
import SaveUserData from "./pages/testPage";
import UserDataDisplay from "./pages/UserDataDisplay";
import UserDetails from "./pages/AllUserDetails";
import HomePage from "./pages/HomePage";
import CreateBlogPage from "./pages/CreateBlogPage";
import AdminDoctorDashboard from "./pages/AdminDoctorDashboard";
import DoctorBlogs from "./pages/DoctorBlogs";
import BlogDetails from "./pages/BlogDetails";

// daham
import AppointmentForm from "./pages/AddAppointment";
import DoctorAppointments from "./pages/DoctorAppointment";
import PatientAppointments from "./pages/AllAppointmentPatient";
import AppNavBar from "./components/AppNavBar";
import DoctorsViews from "./pages/DoctorsViews";
import Footer from "./components/Footer";
import "../src/css/main.css"
import "../src/css/appointment.css"


//vihara
import UserLabTestsPage from "./pages/UserLabTestsPage";
import LabReportPage from "./pages/LabReportPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import Dashboard from "./pages/Dashboard";
import DoctorBlogUpdate from "./pages/DoctorBlogUpdate ";

//siluni
import AllPatients from "./pages/AllPatients";
import AddRecord from "./pages/AddRecord";
import AllRecords from "./pages/AllRecords";
import UserRecords from "./pages/userRecords";

export default function App() {
  return (
    <div>
      {/* Navigation bar */}
      <AppNavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signUp" element={<SignupPage />} />
        <Route path="/user-profile" element={<UserProfilePage />} />
        <Route path="/create-blog" element={<CreateBlogPage />} />
        <Route path="/get-blog/:id" element={<BlogDetails />} />
        <Route path="/get-doctor-blogs" element={<DoctorBlogs />} />
        <Route path="//update-blog/:id" element={<DoctorBlogUpdate />} />
        <Route path="/test" element={<SaveUserData />} />
        <Route path="/dashboard" element={<AdminDoctorDashboard />} />
        <Route path="/display-user-data" element={<UserDataDisplay />} />
        <Route path="/display-all-user-details" element={<UserDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* daham */}
        <Route path="/appointment/add" element={<AppointmentForm />} />
        <Route path="/appointment/doctor/" element={<DoctorAppointments />} />
        <Route path="/appointment/patient/" element={<PatientAppointments />} />
        <Route path="/appointment/doctor/all" element={<DoctorsViews />} />

        {/* vihara */}
        <Route path="/lab-tests" element={<UserLabTestsPage />} />
        <Route path="/lab-tests/:id" element={<LabReportPage />} />
        <Route path="/dashboard-labtest" element={<DoctorDashboard />} />

        {/* siluni */}
          <Route path="/AllPatients" element={<AllPatients />} />
          <Route path="/add-record/:patientId" element={<AddRecord />} />
          <Route path="/view-record/:patientId" element={<AllRecords/>} />
          <Route path="/user-records" element={<UserRecords/>} />
          
      </Routes>
    </div>
  );
}
