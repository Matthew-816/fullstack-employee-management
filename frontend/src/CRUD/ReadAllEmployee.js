import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const ReadAllEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllEmployees = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        console.log("Token being sent:", token);
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
        console.log("Raw response data:", dataResponse);
        setEmployees(dataResponse.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEmployees();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">All Employees</h1>

        {loading && <p className="text-center">Loading employees...</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {!loading && !error && employees.length === 0 && (
          <p className="text-center">No employees found.</p>
        )}

        {!loading && !error && employees.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-sky-900 text-white">
                  <th className="p-2 border">Emp No</th>
                  <th className="p-2 border">First Name</th>
                  <th className="p-2 border">Last Name</th>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Birth Date</th>
                  <th className="p-2 border">Gender</th>
                  <th className="p-2 border">Dept Name</th>
                  <th className="p-2 border">Salary</th>
                  <th className="p-2 border">Hire Date</th>
                  <th className="p-2 border">Email</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.empNo} className="hover:bg-gray-100">
                    <td className="p-2 border">{employee.empNo}</td>
                    <td className="p-2 border">{employee.firstName}</td>
                    <td className="p-2 border">{employee.lastName}</td>
                    <td className="p-2 border">{employee.title}</td>
                    <td className="p-2 border">
                      {employee.birthDate
                        ? new Date(employee.birthDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-2 border">{employee.gender}</td>
                    <td className="p-2 border">{employee.deptName}</td>
                    <td className="p-2 border">{employee.salary}</td>
                    <td className="p-2 border">
                      {employee.hireDate
                        ? new Date(employee.hireDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-2 border">{employee.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/AdminCrud"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Admin CRUD
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReadAllEmployee;
