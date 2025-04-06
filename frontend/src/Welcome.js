import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 text-white">
      <h1 className="text-6xl mb-8">Welcome</h1>
      <div className="space-y-8">
        {" "}
        {/* Increased space between buttons */}
        <Link to="/SignIn/User">
          <button className="bg-sky-400 hover:bg-blue-400 text-white font-bold py-2 px-6 border-b-4 border-blue-700 hover:border-blue-500 rounded">
            {" "}
            {/* Increased padding and font size */}
            User
          </button>
        </Link>
        <Link to="/SignIn/Admin">
          <button className="bg-sky-900 hover:bg-blue-400 text-white font-bold py-2 px-6 border-b-4 border-blue-700 hover:border-blue-500 rounded">
            {" "}
            {/* Increased padding and font size */}
            Admin
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
