import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ReadEmployee = () => {
  const [employee, setEmployee] = useState(null);
  const [empNo, setEmpNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchEmployee = async () => {
    if (!empNo) {
      setError("Please enter an employee number.");
      return;
    }

    setLoading(true);
    setError(null);
    setEmployee(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please sign in to view employee details.");
        navigate("/SignIn/Admin");
        return;
      }

      console.log("Token being sent:", token);

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

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          setError("Session expired. Please sign in again.");
          localStorage.removeItem("token");
          navigate("/SignIn/Admin");
        } else if (response.status === 404) {
          setError(errorData.message || "Employee not found");
        } else {
          setError(errorData.message || "An unexpected error occurred");
        }
        return;
      }

      const data = await response.json();
      setEmployee(data);
    } catch (err) {
      console.error("Error fetching employee:", err);
      setError("Error fetching employee data");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(
      localStorage.getItem("role") === "ROLE_ADMIN" ? "/AdminCrud" : "/UserCrud"
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Read Employee by EmpNo
        </h1>

        <div className="mb-6 flex justify-center gap-4">
          <input
            type="number"
            value={empNo}
            onChange={(e) => setEmpNo(e.target.value)}
            placeholder="Enter Employee No"
            className="p-2 border rounded text-black"
          />
          <button
            onClick={fetchEmployee}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            Fetch Employee
          </button>
        </div>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {employee && !loading && !error && (
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
                <tr className="hover:bg-gray-100">
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
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={handleBack}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back To Admin Crud
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadEmployee;
