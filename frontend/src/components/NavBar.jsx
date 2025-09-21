import React from "react";
import { SignIn, UserButton, UserProfile, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import SignupPage from "./SignUp";

const Navbar = () => {
  const { user, isSignedIn } = useUser();

  return (
    <nav className="bg-blue-950 p-4 flex justify-between items-center">
      <div className="text-white text-lg font-bold">My App</div>

      <div className="flex items-center gap-4">
        {/* Home link */}
        <Link to="/" className="text-white">
          Home
        </Link>

        {/* Additional links */}
        <a href="/test" className="text-white">
          Test
        </a>
        <a href="/display-user-data" className="text-white">
          Display user data
        </a>

        {/* Conditionally render SignIn or UserButton/Profile */}
        {isSignedIn ? (
          // When signed in, show profile button
          <>
            <Link to="/user-profile" className="flex items-center">
              <img
                src={user?.imageUrl} // Ensure you're using profileImageUrl
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            </Link>
          </>
        ) : (
          <Link to="/signUp">
            <a href="/signUp" className="text-white">
              signUp
            </a>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
