import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TodoList from "./ToDoList";
import DoctorCalendar from "./DoctorCalendar";

const Badge = ({ count, onClick }) => {
  return (
    <div
      className="bg-blue-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      {count}
    </div>
  );
};

const DoctorDashboardComps = () => {
  const { user } = useUser();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [blogCount, setBlogCount] = useState(0);
  const [targetBlogCount, setTargetBlogCount] = useState(0);

  useEffect(() => {
    const fetchAppointmentCount = async () => {
      if (!user || !user.id) {
        setError("User not authenticated.");
        return;
      }

      try {
        const token = await getToken();
        const response = await axios.get(
          "http://localhost:5000/appointment/get-doctor-appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointmentCount(response.data.appointments.length);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("No appointments today.");
      }
    };

    if (isSignedIn) {
      fetchAppointmentCount();
    }
  }, [user, isSignedIn, getToken]);

  useEffect(() => {
    const fetchBlogCount = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          "http://localhost:5000/blog/blog-count",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTargetBlogCount(response.data);
      } catch (error) {
        console.error("Error fetching blog count:", error);
      }
    };

    fetchBlogCount();
  }, [getToken]);

  useEffect(() => {
    let count = 0;
    const incrementBlogCount = setInterval(() => {
      if (count < targetBlogCount) {
        count += 1;
        setBlogCount(count);
      } else {
        clearInterval(incrementBlogCount);
      }
    }, 50);
  }, [targetBlogCount]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>User not authenticated.</div>;
  }

  return (
    <div className="p-8 grid grid-cols-6 gap-4">
      <div className="border flex border-gray-400 p-4 col-span-3 row-span-2 rounded-md bg-blue-400">
        <div className="flex-shrink-0 mx-5 my-11">
          <img
            src={user?.imageUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500 cursor-pointer"
          />
        </div>
        <div className="mx-4 my-10 text-white">
          <h1 className="text-2xl font-bold ">
            Dr. {user?.firstName} {user?.lastName}
          </h1>
          <p className="">Specialist in Cardiology</p>
          <p className="mt-2 text-black">
            <strong>Experience:</strong> 10+ years
          </p>
          <p className="text-black">
            <strong>Contact:</strong> {user?.emailAddresses[0]?.emailAddress}
          </p>
          <p className="text-black">
            <strong>Location:</strong> Sydney, Australia
          </p>
        </div>
      </div>

      <div className="border border-gray-400 p-4 col-span-1 row-span-1">
        <h2 className="text-xl font-bold">Patient Records</h2>
        <p className="mt-4">Manage patient details and history.</p>
      </div>

      <div className="border border-gray-400 p-4 col-span-1 row-span-1">
        <h2 className="text-xl font-bold">Appointments</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="mt-2">
            Today's Appointments:
            <Badge count={appointmentCount} onClick={() => navigate("/appointment/doctor")} />
          </div>
        )}
      </div>

      <div className="border border-gray-400 p-4 col-span-1 row-span-1">
        <h2 className="text-xl font-bold text-center">Blogs Count</h2>
        <p className="mt-4 text-4xl text-center">{blogCount}</p>
      </div>

      <div className="border border-gray-400 p-4 col-span-3 row-span-1">
        <h2 className="text-xl font-bold">Messages</h2>
        <p className="mt-4">Patient messages and inquiries.</p>
      </div>

      <div className="col-span-3 row-span-1">
        <DoctorCalendar />
      </div>

      <div className="border border-gray-400 p-4 col-span-1 row-span-2">
        <h2 className="text-xl font-bold">Prescriptions</h2>
        <p className="mt-4">Review and update prescriptions.</p>
      </div>

      <div className="border border-gray-400 p-4 col-span-2 row-span-1">
        <h2 className="text-xl font-bold">Settings</h2>
        <p className="mt-4">Customize dashboard preferences.</p>
      </div>

      <div className="col-span-2 row-span-2">
        <TodoList />
      </div>
    </div>
  );
};

export default DoctorDashboardComps;