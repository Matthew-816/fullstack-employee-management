import UserIcon from "../UserIcon/UserIcon.png";
import React, { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { performPostActionAsync } from "../utils";

function CreateEmployee() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    birth_date: "",
    hire_date: "",
    dept_no: "",
    dept_name: "",
    title: "",
    salary: "",
    from_date: "",
    to_date: "",
    email: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formDataObj = new FormData(event.currentTarget);

    const requestData = {
      firstName: formDataObj.get("first_name"),
      lastName: formDataObj.get("last_name"),
      gender: formDataObj.get("gender"),
      birthDate: formDataObj.get("birth_date"),
      hireDate: formDataObj.get("hire_date"),
      deptNo: formDataObj.get("dept_no"),
      deptName: formDataObj.get("dept_name"),
      title: formDataObj.get("title"),
      salary: formDataObj.get("salary")
        ? Number(formDataObj.get("salary"))
        : null,
      fromDate: formDataObj.get("from_date"),
      toDate: formDataObj.get("to_date"),
      email: formDataObj.get("email"),
    };

    console.log("Form submitted:", requestData);

    try {
      const response = await performPostActionAsync(
        "/api/AdminCrud/CreateEmployee",
        requestData
      );

      console.log("Response from performPostActionAsync:", response);
      console.log("Does response.data have empNo?", !!response.data?.empNo);

      if (response && response.data && response.data.empNo) {
        alert("Employee created successfully!");
        setFormData({
          first_name: "",
          last_name: "",
          gender: "",
          birth_date: "",
          hire_date: "",
          dept_no: "",
          dept_name: "",
          title: "",
          salary: "",
          from_date: "",
          to_date: "",
          email: "",
        });
        navigate("/AdminCrud");
      } else {
        throw new Error("Unexpected response format or creation failed");
      }
    } catch (error) {
      const errorMessage = error.message || "Unknown error occurred";
      console.error("Error creating employee:", error);
      alert(`Error creating employee: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-12 bg-blue-800 max-w-3xl rounded-lg mx-auto p-2 text-white">
      <h1 className="text-2xl font-bold text-center">Create Employee</h1>

      <div className="flex flex-col space-y-2 mt-2 bg-white rounded text-blue-800 p-4 text-xl">
        <div className="flex justify-center mb-4">
          <img src={UserIcon} alt="User Icon" className="w-16 h-16" />
        </div>

        <Form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-4"
            name="first_name"
            id="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />

          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-4"
            name="last_name"
            id="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />

          <label htmlFor="gender">Gender:</label>
          <input
            type="text"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-4"
            name="gender"
            id="gender"
            value={formData.gender}
            onChange={handleChange}
          />

          <label htmlFor="birth_date">Birth Date:</label>
          <input
            type="date"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-4"
            name="birth_date"
            id="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
          />

          <label htmlFor="hire_date">Hire Date:</label>
          <input
            type="date"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-4"
            name="hire_date"
            id="hire_date"
            value={formData.hire_date}
            onChange={handleChange}
          />

          <label htmlFor="dept_no">Department Number:</label>
          <input
            type="text"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-4"
            name="dept_no"
            id="dept_no"
            value={formData.dept_no}
            onChange={handleChange}
          />

          <label htmlFor="dept_name">Department Name:</label>
          <input
            type="text"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-4"
            name="dept_name"
            id="dept_name"
            value={formData.dept_name}
            onChange={handleChange}
          />

          <label htmlFor="title">Title:</label>
          <input
            type="text"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-4"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
          />

          <label htmlFor="salary">Salary:</label>
          <input
            type="number"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-4"
            name="salary"
            id="salary"
            value={formData.salary}
            onChange={handleChange}
          />

          <label htmlFor="from_date">From Date:</label>
          <input
            type="date"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-4"
            name="from_date"
            id="from_date"
            value={formData.from_date}
            onChange={handleChange}
          />

          <label htmlFor="to_date">To Date:</label>
          <input
            type="date"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-4"
            name="to_date"
            id="to_date"
            value={formData.to_date}
            onChange={handleChange}
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-4"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="block bg-blue-800 text-white py-2 rounded mt-4 hover:bg-blue-900"
            disabled={loading}
          >
            {loading ? "Creating..." : "Submit"}
          </button>
        </Form>
      </div>

      <button
        type="button"
        className="block bg-gray-800 text-white py-2 rounded mt-4 text-center hover:bg-gray-900"
        onClick={() => navigate("/AdminCrud")}
      >
        Back to Admin Dashboard
      </button>
    </div>
  );
}

export default CreateEmployee;
