import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Navigate, useNavigate } from "react-router-dom";

const DoctorBlogForm = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
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
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

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
      const response = await axios.post(
        "http://localhost:5000/blog/create-blog",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Blog submitted successfully:", response.data);
      navigate("/get-doctor-blogs");
    } catch (err) {
      console.error("Error submitting blog:", err);
    }
  };

  return (
    <div className="medi-main-gradient pt-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8  rounded-lg shadow-md max-w-3xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create Your Blog
        </h2>

        {/* Blog Title */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">
            Blog Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the blog title"
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
          />
        </div>

        {/* Symptoms/Explanation of the Condition */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">
            Symptoms or Explanation
          </label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Explain the medical condition"
            rows={3}
          />
        </div>

        {/* Causes and Risk Factors */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">
            Causes and Risk Factors
          </label>
          <textarea
            name="causes"
            value={formData.causes}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the causes and risks"
            rows={3}
          />
        </div>

        {/* Prevention Tips */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">
            Prevention Tips
          </label>
          <textarea
            name="prevention"
            value={formData.prevention}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Provide tips for prevention"
            rows={3}
          />
        </div>

        {/* Treatment Options */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">
            Treatment Options
          </label>
          <textarea
            name="treatment"
            value={formData.treatment}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Discuss available treatments"
            rows={3}
          />
        </div>

        {/* Case Study or Patient Story (Optional) */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">
            Case Study or Patient Story
          </label>
          <textarea
            name="caseStudy"
            value={formData.caseStudy}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a patient story or case study"
            rows={3}
          />
        </div>

        {/* Call-to-Action */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">
            Call-to-Action
          </label>
          <textarea
            name="callToAction"
            value={formData.callToAction}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Encourage the reader to take action"
            rows={3}
          />
        </div>

        {/* Visuals (Images and Videos) */}
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

        {/* References */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">
            References
          </label>
          <textarea
            name="references"
            value={formData.references}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add links to studies, articles, etc."
            rows={3}
          />
        </div>

        {/* Related Resources/Links */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">
            Related Resources/Links
          </label>
          <textarea
            name="relatedLinks"
            value={formData.relatedLinks}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add links to other blog posts or resources"
            rows={3}
          />
        </div>

        {/* Disclaimer */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">
            Disclaimer
          </label>
          <textarea
            name="disclaimer"
            value={formData.disclaimer}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Include any necessary disclaimers"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-6 py-2 text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition duration-300"
          >
            Submit for Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorBlogForm;
