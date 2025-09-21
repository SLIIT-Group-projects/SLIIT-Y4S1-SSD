// BlogDetail.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BlogDetails = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/blog/get-blog/${id}`
        );
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!blog) return <div>Blog not found.</div>;

  return (
    <div className="medi-main-gradient pt-1">
    <div className="container mx-auto my-12 p-8 bg-white rounded-lg shadow-lg max-w-4xl">
      <h1 className="text-5xl text-center font-extrabold mb-6 text-blue-900">
        {blog.title}
      </h1>
      <p className="text-lg text-gray-500 leading-relaxed mb-6">
        {blog.introduction}
      </p>

      {/* Blog Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {blog.images.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={`http://localhost:5000/${image}`}
              alt={`Blog Image ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
            <span className="text-sm text-gray-400 absolute bottom-2 left-2">
              Image {index + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Symptoms Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-3 text-blue-800">Symptoms</h2>
        <p className="text-md text-gray-700 leading-relaxed">{blog.symptoms}</p>
      </section>

      {/* Causes Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-3 text-blue-800">Causes</h2>
        <p className="text-md text-gray-700 leading-relaxed">{blog.causes}</p>
      </section>

      {/* Prevention Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-3 text-blue-800">Prevention</h2>
        <p className="text-md text-gray-700 leading-relaxed">
          {blog.prevention}
        </p>
      </section>

      {/* Treatment Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-3 text-blue-800">Treatment</h2>
        <p className="text-md text-gray-700 leading-relaxed">
          {blog.treatment}
        </p>
      </section>

      {/* Conditional Sections */}
      {blog.caseStudy && (
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-3 text-blue-800">Case Study</h2>
          <p className="text-md text-gray-700 leading-relaxed">
            {blog.caseStudy}
          </p>
        </section>
      )}

      {blog.references && (
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-3 text-blue-800">References</h2>
          <ul className="list-disc list-inside text-md text-gray-700">
            {blog.references.split("\n").map((reference, index) => (
              <li key={index}>{reference}</li>
            ))}
          </ul>
        </section>
      )}

      {blog.relatedLinks && (
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-3 text-blue-800">
            Related Links
          </h2>
          <ul className="list-disc list-inside text-md text-blue-600">
            {blog.relatedLinks.split("\n").map((link, index) => (
              <li key={index}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {blog.disclaimer && (
        <section className="mb-8 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-3 text-red-600">
            Disclaimer
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {blog.disclaimer}
          </p>
        </section>
      )}
    </div>
    </div>
  );
};

export default BlogDetails;
