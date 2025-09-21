import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  return (
    <Link to={`/get-blog/${blog._id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
        {/* Blog Image */}
        {blog.images.length > 0 && (
          <img
            src={`http://localhost:5000/${blog.images[0]}`} // Display the first image
            alt={blog.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-6">
          {/* Blog Title */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate">
            {blog.title}
          </h2>

          {/* Blog Introduction */}
          <p className="text-gray-700 mb-4 line-clamp-3">
            {blog.introduction.length > 100
              ? `${blog.introduction.substring(0, 100)}...`
              : blog.introduction}
          </p>

          {/* Read More Button */}
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300">
            Read More
          </button>
        </div>
      </div>
    </Link>
  );
};

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/blog/get-blogs"
        );
        setBlogs(response.data); // Assuming response.data contains an array of blog posts
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="my-8">
      <h1 className="text-3xl font-bold text-center mb-8">Latest Blog Posts</h1>
      <div className="grid mx-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
