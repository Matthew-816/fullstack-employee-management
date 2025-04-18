import UserIcon from "../UserIcon/UserIcon.png";
import React, { useState } from "react";
import { Form, useNavigate } from "react-router-dom";

const AdminSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    secretCode: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const requestData = {
      email: formData.get("email"),
      password: formData.get("password"),
      secretCode: formData.get("secretCode"),
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/SignUp/Admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Response data:", data);
      navigate("/SignIn/Admin");
    } catch (error) {
      console.error("Error during signup:", error);
      setError("Invalid input");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-sky-900 text-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-xl font-bold text-center mb-4">
          Employee Management System
        </h1>
        <div className="flex justify-center mb-4">
          <img src={UserIcon} alt="User Icon" className="w-16 h-16" />
        </div>
        <h2 className="text-base font-bold text-center mb-6">Admin Sign Up</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <Form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="email" className="block text-sm mb-2">
            Email:
          </label>
          <input
            type="email"
            className="text-black w-full p-2 mb-4 rounded border border-gray-300"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />

          <label htmlFor="password" className="block text-sm mb-2">
            Password:
          </label>
          <input
            type="password"
            className="text-black w-full p-2 mb-4 rounded border border-gray-300"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />

          <label htmlFor="secretCode" className="block text-sm mb-2">
            Secret Code:
          </label>
          <input
            type="text"
            className="text-black w-full p-2 mb-4 rounded border border-gray-300"
            id="secretCode"
            name="secretCode"
            placeholder="Enter your secret code"
            value={formData.secretCode}
            onChange={handleChange}
            disabled={loading}
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </Form>
      </div>
    </div>
  );
};

export default AdminSignUp;
