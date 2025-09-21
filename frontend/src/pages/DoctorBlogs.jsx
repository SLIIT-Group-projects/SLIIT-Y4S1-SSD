import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react"; // Import Clerk's useAuth
import { Link } from "react-router-dom";

const DoctorBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const { getToken } = useAuth(); // Destructure getToken to get the token

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Get the auth token from Clerk
        const token = await getToken();
        console.log(token);

        // Make the API call with the token in the headers
        const res = await axios.get(
          "http://localhost:5000/blog/get-doctor-blogs",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in Authorization header
            },
          }
        );

        setBlogs(res.data); // Update blogs state with fetched blogs
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, [getToken]);

  // Function to handle blog deletion
  const handleDelete = async (id) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) return; // Exit if the user clicked "Cancel"

    try {
      const token = await getToken(); // Get the auth token
      await axios.delete(`http://localhost:5000/blog/delete-blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      });
      // Remove the deleted blog from the state
      setBlogs(blogs.filter((blog) => blog._id !== id));
      alert("Blog deleted successfully.");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog.");
    }
  };

  return (
    <div className=" medi-main-gradient">
      <div className="p-8 min-h-screen">
        <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
          Your Blogs
        </h1>

        <Link to="/create-blog">
          <button className="my-3 flex rounded gap-2 text-white  p-2 bg-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Create Blog
          </button>
        </Link>

        {/* Display blogs in a grid of cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Blog Image */}
                {blog.images.length > 0 && (
                  <img
                    src={`http://localhost:5000/${blog.images[0]}`} // Display the first image
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                {/* Blog Details */}
                <div className="p-6">
                  {/* Blog Title */}
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3 truncate">
                    {blog.title}
                  </h2>

                  {/* Blog Introduction (a preview of the first 100 characters) */}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {blog.introduction.length > 100
                      ? `${blog.introduction.substring(0, 100)}...`
                      : blog.introduction}
                  </p>

                  {/* Call to Action */}
                  {blog.callToAction && (
                    <p className="text-blue-600 font-medium mt-4">
                      {blog.callToAction}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Link to={`/update-blog/${blog._id}`}>
                      <button className="flex gap-2 mt-4 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                        Edit Blog
                      </button>
                    </Link>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(blog._id)} // Call handleDelete with the blog ID
                      className="mt-4 flex gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No blogs found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorBlogs;
