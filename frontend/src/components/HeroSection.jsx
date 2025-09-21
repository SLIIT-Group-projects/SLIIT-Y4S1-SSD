import { useUser } from "@clerk/clerk-react";
import React from "react";

const HeroSection = () => {
  return (
    <section className="bg-white">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-blue-600">
            Comprehensive Health Solutions for Your Well-being
          </h1>
          <p className="max-w-2xl mb-6 font-light text-gray-600 lg:mb-8 md:text-lg lg:text-xl">
            Discover a range of health services from virtual consultations to
            personalized wellness programs, designed to keep you healthy and
            active.
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          >
            Get Started
            <svg
              className="w-5 h-5 ml-2 -mr-1 border"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 focus:ring-4 focus:ring-blue-100"
          >
            Speak to a Doctor
          </a>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img
            src="https://img.freepik.com/free-photo/young-handsome-physician-medical-robe-with-stethoscope_1303-17818.jpg?t=st=1728579233~exp=1728582833~hmac=abe499b9c266a0f96fe6b6b1932c56fe99d8c08074cc300fc58ad88e76085b36&w=996"
            alt="Healthcare illustration"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
