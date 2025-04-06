import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UserCrud = () => {
  const [employee, setEmployee] = useState(null); // Single employee from search
  const [employees, setEmployees] = useState([]); // All employees
  const [empNo, setEmpNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSearchInput, setShowSearchInput] = useState(false); // Toggle search input visibility

  useEffect(() => {
    // Only fetch all employees when "Read All Employee" button is clicked
  }, []);

  const fetchAllEmployees = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please sign in to view employees.");

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/UserCrud/UserReadAll`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch employees");
      }

      const dataResponse = await response.json();
      setEmployees(dataResponse.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!empNo) return;

    setLoading(true);
    setError(null);
    setEmployee(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please sign in to search employees.");

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/UserCrud/UserRead/${empNo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        if (response.status === 404) {
          setError("Invalid Employee Number"); // Set the specific error message
        } else {
          setError(errorData.message || "An unexpected error occurred");
        }
        return;
      }

      const result = await response.json();
      setEmployee(result.data); // Assuming the response is the employee DTO directly
    } catch (error) {
      console.error("Error fetching employee:", error);
      setError("Error fetching employee data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto mt-4 flex flex-col h-screen">
      {/* Dashboard Header */}
      <h2 className="text-3xl font-bold text-center mb-8">User Dashboard</h2>

      {/* 4 Big Buttons in 2x2 Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Read All Employee - Top Left */}
        <button
          onClick={fetchAllEmployees}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-6 px-4 rounded text-lg"
        >
          Read All Employee
        </button>

        {/* Search Employee by Employee Number - Top Right */}
        <button
          onClick={() => setShowSearchInput(!showSearchInput)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-6 px-4 rounded text-lg"
        >
          Search Employee by Employee Number
        </button>

        {/* AI Searching - Bottom Left */}
        <Link
          to="/AiChatBox"
          state={{ from: "/UserCrud" }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-6 px-4 rounded text-lg text-center"
        >
          AI Searching
        </Link>

        {/* Sign Out - Bottom Right */}
        <Link
          to="/"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-6 px-4 rounded text-lg text-center"
        >
          Sign Out
        </Link>
      </div>

      {/* Search Input (Shown only when Search button is clicked) */}
      {showSearchInput && (
        <div className="flex mb-4">
          <input
            type="text"
            value={empNo}
            onChange={(e) => setEmpNo(e.target.value)}
            placeholder="Enter employee number"
            className="border rounded py-2 px-4 mr-2 flex-grow"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Search
          </button>
        </div>
      )}

      {/* Scrollable Employee Section */}
      <div className="flex-1 overflow-y-auto mb-8">
        {/* Single Employee Search Result */}
        {employee && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Search Result</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Employee No</th>
                    <th className="px-4 py-2 text-left">First Name</th>
                    <th className="px-4 py-2 text-left">Last Name</th>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Birth Date</th>
                    <th className="px-4 py-2 text-left">Gender</th>
                    <th className="px-4 py-2 text-left">Dept No</th>
                    <th className="px-4 py-2 text-left">Dept Name</th>
                    <th className="px-4 py-2 text-left">Salary</th>
                    <th className="px-4 py-2 text-left">Hire Date</th>
                    <th className="px-4 py-2 text-left">From Date</th>
                    <th className="px-4 py-2 text-left">To Date</th>
                    <th className="px-4 py-2 text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={employee.empNo} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{employee.empNo}</td>
                    <td className="px-4 py-2">{employee.firstName}</td>
                    <td className="px-4 py-2">{employee.lastName}</td>
                    <td className="px-4 py-2">{employee.title}</td>
                    <td className="px-4 py-2">
                      {formatDate(employee.birthDate)}
                    </td>
                    <td className="px-4 py-2">{employee.gender}</td>
                    <td className="px-4 py-2">{employee.deptNo}</td>
                    <td className="px-4 py-2">{employee.deptName}</td>
                    <td className="px-4 py-2">{employee.salary}</td>
                    <td className="px-4 py-2">
                      {formatDate(employee.hireDate)}
                    </td>
                    <td className="px-4 py-2">
                      {formatDate(employee.fromDate)}
                    </td>
                    <td className="px-4 py-2">{formatDate(employee.toDate)}</td>
                    <td className="px-4 py-2">{employee.email}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All Employees Section */}
        {employees.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">All Employees</h3>
            {loading && <p className="text-center">Loading employees...</p>}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Employee No</th>
                    <th className="px-4 py-2 text-left">First Name</th>
                    <th className="px-4 py-2 text-left">Last Name</th>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Birth Date</th>
                    <th className="px-4 py-2 text-left">Gender</th>
                    <th className="px-4 py-2 text-left">Dept No</th>
                    <th className="px-4 py-2 text-left">Dept Name</th>
                    <th className="px-4 py-2 text-left">Salary</th>
                    <th className="px-4 py-2 text-left">Hire Date</th>
                    <th className="px-4 py-2 text-left">From Date</th>
                    <th className="px-4 py-2 text-left">To Date</th>
                    <th className="px-4 py-2 text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.empNo} className="hover:bg-gray-100">
                      <td className="px-4 py-2">{emp.empNo}</td>
                      <td className="px-4 py-2">{emp.firstName}</td>
                      <td className="px-4 py-2">{emp.lastName}</td>
                      <td className="px-4 py-2">{emp.title}</td>
                      <td className="px-4 py-2">{formatDate(emp.birthDate)}</td>
                      <td className="px-4 py-2">{emp.gender}</td>
                      <td className="px-4 py-2">{emp.deptNo}</td>
                      <td className="px-4 py-2">{emp.deptName}</td>
                      <td className="px-4 py-2">{emp.salary}</td>
                      <td className="px-4 py-2">{formatDate(emp.hireDate)}</td>
                      <td className="px-4 py-2">{formatDate(emp.fromDate)}</td>
                      <td className="px-4 py-2">{formatDate(emp.toDate)}</td>
                      <td className="px-4 py-2">{emp.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCrud;
