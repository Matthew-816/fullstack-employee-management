import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AdminCrud = () => {
  const [employee, setEmployee] = useState(null); // Single employee from search
  const [employees, setEmployees] = useState([]); // All employees
  const [empNo, setEmpNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const fetchAllEmployees = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      console.log("Token being sent for fetchAll:", token);
      if (!token) {
        throw new Error("Please sign in to view employees.");
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/AdminCrud/ReadAllEmployee`,
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
      console.log("Fetch all employees response:", dataResponse);
      setEmployees(dataResponse.data || dataResponse); // Adjust based on response structure
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!empNo) {
      setError("Please enter an employee number.");
      return;
    }

    setLoading(true);
    setError(null);
    setEmployee(null); // Clear previous employee data

    try {
      const token = localStorage.getItem("token");
      console.log("Token being sent for search:", token);
      if (!token) {
        throw new Error("Please sign in to search employees.");
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/AdminCrud/ReadEmployee/${empNo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Search response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error response data:", errorData);
        if (response.status === 404) {
          setError("Invalid Employee Number");
        } else {
          setError(errorData.message || "An unexpected error occurred");
        }
        return;
      }

      const result = await response.json();
      console.log("Search result:", result);
      setEmployee(result.data);
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
      <h2 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={fetchAllEmployees}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-6 px-4 rounded text-lg"
        >
          Read All Employee
        </button>
        <button
          onClick={() => setShowSearchInput(!showSearchInput)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-6 px-4 rounded text-lg"
        >
          Search Employee by Employee Number
        </button>
        <Link
          to="/AiChatBox"
          state={{ from: "/AdminCrud" }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-6 px-4 rounded text-lg text-center"
        >
          AI Searching
        </Link>
        <Link
          to="/"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-6 px-4 rounded text-lg text-center"
        >
          Sign Out
        </Link>
      </div>

      <div className="mb-4">
        <Link
          to="/CreateEmployee"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Employee
        </Link>
      </div>

      {/* Search Input */}
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
            disabled={loading}
          >
            Search
          </button>
        </div>
      )}

      {/* Error and Loading Messages */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {loading && <p className="text-center">Loading...</p>}

      {/* Scrollable Employee Section */}
      <div className="flex-1 overflow-y-auto mb-8">
        {/* Single Employee Search Result */}
        {employee && !loading && !error && (
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
                    <th className="px-4 py-2 text-left">Actions</th>
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
                    <td className="px-4 py-2">
                      <Link
                        to={`/EditEmployee/${employee.empNo}`}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2 inline-block"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/DeleteEmployee/${employee.empNo}`}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-block"
                      >
                        Del
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All Employees Section */}
        {employees.length > 0 && !loading && !error && (
          <div>
            <h3 className="text-xl font-semibold mb-2">All Employees</h3>
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
                    <th className="px-4 py-2 text-left">Actions</th>
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
                      <td className="px-4 py-2">
                        <Link
                          to={`/EditEmployee/${emp.empNo}`}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2 inline-block"
                        >
                          Edit
                        </Link>
                        <Link
                          to={`/DeleteEmployee/${emp.empNo}`}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-block"
                        >
                          Del
                        </Link>
                      </td>
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

export default AdminCrud;
