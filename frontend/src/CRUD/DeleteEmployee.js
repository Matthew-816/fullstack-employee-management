import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLoaderData } from "react-router-dom";

function DeleteEmployee() {
  const { empNo } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please sign in to delete employees.");
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

        if (!response.ok) {
          throw new Error("Failed to fetch employee data");
        }

        const result = await response.json();
        setEmployee(result.data);
      } catch (err) {
        console.error("Error fetching employee:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [empNo]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please sign in to delete employees.");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/AdminCrud/DeleteEmployee/${empNo}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to delete employee: ${errorText || response.statusText}`
        );
      }

      alert("Employee deleted successfully!");
      navigate("/AdminCrud");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Error deleting employee: " + error.message);
      setError(error.message);
    }
  };

  const handleCancel = () => {
    navigate("/AdminCrud");
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Delete Employee</h1>

        {employee ? (
          <div className="space-y-4">
            <p className="text-center">
              Are you sure you want to delete the following employee?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <span className="font-semibold">Employee No:</span>
              <span>{employee.empNo}</span>
              <span className="font-semibold">First Name:</span>
              <span>{employee.firstName}</span>
              <span className="font-semibold">Last Name:</span>
              <span>{employee.lastName}</span>
              <span className="font-semibold">Email:</span>
              <span>{employee.email}</span>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Confirm Delete
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center">Employee not found.</p>
        )}
      </div>
    </div>
  );
}

export const deleteEmployeeLoader = async ({ params }) => {
  const { empNo } = params;
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Please sign in to delete employees.");
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

  if (!response.ok) {
    throw new Error("Employee not found or server error");
  }

  const result = await response.json();
  return { empNo, data: result.data };
};

export default DeleteEmployee;
