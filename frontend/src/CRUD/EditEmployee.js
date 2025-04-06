import { Form, useLoaderData, useNavigate, Link } from "react-router-dom"; // Add Link import
import { useState, useEffect } from "react";

function EditEmployee() {
  const { id, data } = useLoaderData();
  const navigate = useNavigate();

  const [empNo, setEmpNo] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [deptNo, setDeptNo] = useState("");
  const [deptName, setDeptName] = useState("");
  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (data) {
      setEmpNo(data.empNo || "");
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setGender(data.gender || "");
      setBirthDate(data.birthDate ? data.birthDate.split("T")[0] : "");
      setHireDate(data.hireDate ? data.hireDate.split("T")[0] : "");
      setDeptNo(data.deptNo || "");
      setDeptName(data.deptName || "");
      setTitle(data.title || "");
      setSalary(data.salary || "");
      setFromDate(data.fromDate ? data.fromDate.split("T")[0] : "");
      setToDate(data.toDate ? data.toDate.split("T")[0] : "");
      setEmail(data.email || "");
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in to update employees.");
      return;
    }

    const employeeData = {
      empNo,
      firstName,
      lastName,
      gender,
      birthDate,
      hireDate,
      deptNo,
      deptName,
      title,
      salary: Number(salary),
      fromDate,
      toDate,
      email,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/AdminCrud/EditEmployee/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(employeeData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update employee");
      }

      alert("Employee updated successfully!");
      navigate("/AdminCrud");
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Error updating employee: " + error.message);
    }
  };

  return (
    <div className="m-12 bg-blue-800 max-w-3xl rounded-lg mx-auto p-2 text-white">
      <h1 className="text-2xl font-bold text-center">Edit Employee</h1>

      <div className="flex flex-col space-y-2 mt-2 bg-white rounded text-blue-800 p-4 text-xl">
        <Form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="empNo">Employee Number:</label>
          <input
            type="text"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-2"
            name="empNo"
            id="empNo"
            value={empNo}
            onChange={(e) => setEmpNo(e.target.value)}
            disabled
          />

          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-2"
            name="firstName"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-2"
            name="lastName"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label htmlFor="gender">Gender:</label>
          <input
            type="text"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-2"
            name="gender"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />

          <label htmlFor="birthDate">Birth Date:</label>
          <input
            type="date"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-2"
            name="birthDate"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />

          <label htmlFor="hireDate">Hire Date:</label>
          <input
            type="date"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-2"
            name="hireDate"
            id="hireDate"
            value={hireDate}
            onChange={(e) => setHireDate(e.target.value)}
          />

          <label htmlFor="deptNo">Department Number:</label>
          <input
            type="text"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-2"
            name="deptNo"
            id="deptNo"
            value={deptNo}
            onChange={(e) => setDeptNo(e.target.value)}
          />

          <label htmlFor="deptName">Department Name:</label>
          <input
            type="text"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-2"
            name="deptName"
            id="deptName"
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
          />

          <label htmlFor="title">Title:</label>
          <input
            type="text"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-2"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="salary">Salary:</label>
          <input
            type="number"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-2"
            name="salary"
            id="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />

          <label htmlFor="fromDate">From Date:</label>
          <input
            type="date"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-2"
            name="fromDate"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <label htmlFor="toDate">To Date:</label>
          <input
            type="date"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-2"
            name="toDate"
            id="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="border border-2 rounded border-gray-400 outline-none focus:border-blue-800 px-2 py-1 mb-2"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-900"
            >
              Update Employee
            </button>
            <Link to="/AdminCrud">
              <button
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel Editing
              </button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default EditEmployee;
