import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";

const DoctorBlogUpdate = () => {
  const { id } = useParams(); // Get the blog ID from the URL parameters
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // State to hold form data
  const [formData, setFormData] = useState({
    title: "",
    introduction: "",
    symptoms: "",
    causes: "",
    prevention: "",
    treatment: "",
    caseStudy: "",
    callToAction: "",
    references: "",
    relatedLinks: "",
    disclaimer: "",
  });

  // State to hold uploaded images and videos
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `http://localhost:5000/blog/get-blog/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFormData(response.data); // Set the form data with the fetched blog
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [getToken, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "images") {
      setImages(files);
    } else {
      setVideos(files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (let key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    for (let i = 0; i < images.length; i++) {
      formDataToSend.append("images", images[i]);
    }

    for (let i = 0; i < videos.length; i++) {
      formDataToSend.append("videos", videos[i]);
    }

    try {
      const token = await getToken();
      await axios.put(
        `http://localhost:5000/blog/update-blog/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Blog updated successfully");
      navigate("/get-doctor-blogs"); // Redirect after successful update
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  return (
    <div className="medi-main-gradient pt-6">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Update Your Blog
      </h2>

      {/* Blog Title */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold">Blog Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter the blog title"
          required
        />
      </div>

      {/* Introduction */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold">
          Introduction
        </label>
        <textarea
          name="introduction"
          value={formData.introduction}
          onChange={handleInputChange}
          className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief introduction to the topic"
          rows={3}
          required
        />
      </div>

      {/* Symptoms */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold">Symptoms</label>
        <textarea
          name="symptoms"
          value={formData.symptoms}
          onChange={handleInputChange}
          className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="List the symptoms"
          rows={3}
        />
      </div>

      {/* Causes */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold">Causes</label>
        <textarea
          name="causes"
          value={formData.causes}
          onChange={handleInputChange}
          className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="List the causes"
          rows={3}
        />
      </div>

      {/* Prevention */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold">Prevention</label>
        <textarea
          name="prevention"
          value={formData.prevention}
          onChange={handleInputChange}
          className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="List prevention methods"
          rows={3}
        />
      </div>

      {/* Treatment */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold">Treatment</label>
        <textarea
          name="treatment"
          value={formData.treatment}
          onChange={handleInputChange}
          className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the treatment options"
          rows={3}
        />
      </div>

      {/* Case Study */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold">Case Study</label>
        <textarea
          name="caseStudy"
          value={formData.caseStudy}
          onChange={handleInputChange}
          className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe a relevant case study"
          rows={3}
        />
      </div>

      {/* Call to Action */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold">
          Call to Action
        </label>
        <textarea
          name="callToAction"
          value={formData.callToAction}
          onChange={handleInputChange}
          className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Include a call to action"
          rows={3}
        />
      </div>

      {/* References */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold">References</label>
        <textarea
          name="references"
          value={formData.references}
          onChange={handleInputChange}
          className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="List your references"
          rows={3}
        />
      </div>

      {/* Related Links */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold">
          Related Links
        </label>
        <textarea
          name="relatedLinks"
          value={formData.relatedLinks}
          onChange={handleInputChange}
          className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="List any related links"
          rows={3}
        />
      </div>

      {/* Disclaimer */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold">Disclaimer</label>
        <textarea
          name="disclaimer"
          value={formData.disclaimer}
          onChange={handleInputChange}
          className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Include any necessary disclaimers"
          rows={3}
        />
      </div>

      {/* Upload Images */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold">
          Upload Images
        </label>
        <input
          type="file"
          name="images"
          multiple
          onChange={handleFileChange}
          className="block mt-2"
        />
      </div>

      {/* Upload Videos */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold">
          Upload Videos
        </label>
        <input
          type="file"
          name="videos"
          multiple
          onChange={handleFileChange}
          className="block mt-2"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Update Blog
      </button>
    </form>
    </div>
  );
};

export default DoctorBlogUpdate;
