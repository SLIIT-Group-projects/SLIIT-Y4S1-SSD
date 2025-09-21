import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../shared/SearchBar";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

function AllPatients() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch all users from the backend
    axios
      .get("http://localhost:5000/user/get-all-users")
      .then((res) => {
        setUsers(res.data.users); // Assuming backend returns { users: [...] }
        setFilteredUsers(res.data.users); // Initialize filteredUsers with all users
        setLoading(false);
      })
      .catch((err) => {
        alert(err.message); // Correct usage of alert
        setError(err.message);
        setLoading(false);
      });
  }, []); // Empty dependency array ensures this runs once on mount

  // Handler to perform search
  const handleSearch = (searchQuery) => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users); // If search query is empty, show all users
    } else {
      const filtered = users.filter((user) =>
        Object.values(user).some((field) =>
          field
            ? field.toString().toLowerCase().includes(searchQuery.toLowerCase())
            : false
        )
      );
      setFilteredUsers(filtered);
    }
  };

  if (loading) {
    return <p className="text-center text-lg text-gray-600">Loading patients...</p>; // Loading indicator
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">Error: {error}</p>; // Error message
  }

  return (
    <div className="medi-main-gradient">
      <div className="my-8 text-center font-bold text-3xl pt-5 text-gray-800">ALL PATIENTS</div>
      <SearchBar onSearch={handleSearch} /> {/* Pass handleSearch as a prop */}
      
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-8">
        <table className="w-full text-base text-left text-gray-800 mx-10">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">First Name</th>
              <th scope="col" className="px-6 py-3">Last Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="bg-white hover:bg-gray-50">
                  <td className="px-6 py-4">{user.firstName}</td>
                  <td className="px-6 py-4">{user.lastName}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/add-record/${user._id}`} // Pass patient ID in the URL
                      className="font-medium text-white bg-blue-500 hover:bg-blue-600 mx-2 rounded px-3 py-1"
                    >
                      Add Record
                    </Link>
                    <Link
                      to={`/view-record/${user._id}`} // Pass patient ID in the URL
                      className="font-medium text-white bg-green-500 hover:bg-green-600 mx-2 rounded px-3 py-1"
                    >
                      View Record
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-600">
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllPatients;
