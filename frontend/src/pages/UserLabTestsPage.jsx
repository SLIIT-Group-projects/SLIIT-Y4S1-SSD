import React, { useState, useEffect } from "react";
import axios from "axios";

function UserLabTestsPage() {
  const [labTests, setLabTests] = useState([]);
  const [clerkUserId, setClerkUserId] = useState(null);

  //const clerkUserId = localStorage.getItem("clerkUserId"); // Assuming this is stored in localStorage

  useEffect(() => {
    const storedClerkUserId = localStorage.getItem("clerkUserId");

    if (!storedClerkUserId) {
      console.error("clerkUserId is null. Unable to fetch lab reports.");
      return;
    }

    setClerkUserId(storedClerkUserId);

    // if (!clerkUserId) {
    //   console.error("clerkUserId is null. Unable to fetch lab reports.");
    //   return;
    // }
    console.log("clerkUserId:", clerkUserId); // Debugging log

    const fetchLabTests = async () => {
      try {
        // const response = await axios.get(
        //   "http://localhost:5000/api/reports/user",
        //   {
        //     // headers: {
        //     //   Authorization: `Bearer ${localStorage.getItem("token")}`,
        //     // },
        //     params: {
        //       clerkUserId: clerkUserId, // Pass clerkUserId as a query parameter
        //     },
        //   }
        // );
        const response = await axios.get(
          `http://localhost:5000/api/reports/user?clerkUserId=${storedClerkUserId}`
        );
        console.log("Fetched lab reports:", response.data); // Log fetched data
        // Ensure the response is an array
        const data = Array.isArray(response.data) ? response.data : [];
        setLabTests(response.data);
      } catch (error) {
        console.error("Error fetching lab tests:", error);
        setLabTests([]); // Set to an empty array in case of error
      }
    };

    fetchLabTests();
  }, [clerkUserId]);

  if (!clerkUserId) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-xl font-bold">Your Lab Tests</h2>
        <p>No clerkUserId found. Please log in to view your lab tests.</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold text-blue-700 mb-8">Your Lab Tests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(labTests) && labTests.length > 0 ? (
          labTests.map((test) => (
            <div
              key={test._id}
              className="bg-white shadow rounded-lg p-4 shadow-blue-700"
            >
              <h3 className="font-bold">{test.reportID}</h3>
              <p>{new Date(test.uploadDate).toLocaleString()}</p>
              <a
                //href={`/${test.fileUrl}`}
                href={`http://localhost:5000/${test.fileUrl}`}
                download
                className="text-blue-500 underline"
              >
                Download Report
              </a>
              {test.doctorComments && test.doctorComments.length > 0 && (
                <div>
                  <h4 className="font-bold mt-2">Doctor Comments:</h4>
                  {test.doctorComments.map((comment, index) => (
                    <p key={index}>{comment.comment}</p>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No lab reports available.</p>
        )}
      </div>
    </div>
  );
}

export default UserLabTestsPage;
