import React from "react";

const ValuesSection = () => {
  return (
    <section className="bg-gray-50 py-12">
      <div className="grid max-w-screen-xl px-4 mx-auto lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 place-self-center">
          <h1 className="valueSection-heading text-center font-bold medi-text-100 mb-4">
            Our Commitment to Excellence
          </h1>
          <p className="mb-6 text-gray-700">
            Our hospital management system is dedicated to delivering
            exceptional healthcare experiences, placing patients at the center
            of everything we do. We prioritize quality care, leveraging
            cutting-edge technology to streamline operations and improve patient
            outcomes. Our platform ensures seamless communication between
            doctors, nurses, and other medical staff, making it easier to
            coordinate care and manage medical records. We continually strive to
            adapt and innovate, providing a user-friendly system that not only
            meets the needs of healthcare providers but also empowers patients
            to actively participate in their own health journey. By focusing on
            efficiency, transparency, and compassion, we aim to set a new
            standard in healthcare management.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold medi-text-100">1200+</span>
              <span className="text-gray-600">Patients Served</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold medi-text-100">4.8/5</span>
              <span className="text-gray-600">Average Rating</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6">
          <img
            className="w-full rounded-lg shadow-lg"
            src="https://img.freepik.com/free-photo/young-handsome-physician-medical-robe-with-stethoscope_1303-17818.jpg?t=st=1729356223~exp=1729359823~hmac=824f1369e3fbf74ef6cc4bfd2f610ac8d8cac72ffa1bdb64f35152c8b70d6272&w=996


"
            alt="Commitment to Excellence"
          />
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
