import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import Welcome from "./Welcome";
import UserSignIn from "./SignIn/UserSignIn";
import AdminSignIn from "./SignIn/AdminSignIn";
import UserSignUp from "./SignUp/UserSignUp";
import AdminSignUp from "./SignUp/AdminSignUp";
import CreateEmployee from "./CRUD/CreateEmployee";
import ReadEmployee from "./CRUD/ReadEmployee";
import AdminCrud from "./CRUD/AdminCrud";
import EditEmployee from "./CRUD/EditEmployee";
import AiChatBox from "./CRUD/AiChatBox";
import ReadAllEmployee from "./CRUD/ReadAllEmployee";
import UserCrud from "./UserCrud/UserCrud";
import UserRead from "./UserCrud/UserRead";
import UserReadAll from "./UserCrud/UserReadAll";
import DeleteEmployee, { deleteEmployeeLoader } from "./CRUD/DeleteEmployee";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/SignIn/User",
    element: <UserSignIn />,
  },
  {
    path: "/SignIn/Admin",
    element: <AdminSignIn />,
  },
  {
    path: "/SignUp/User",
    element: <UserSignUp />,
  },
  {
    path: "/SignUp/Admin",
    element: <AdminSignUp />,
  },
  {
    path: "/AdminCrud",
    element: <AdminCrud />,
  },
  {
    path: "/UserCrud",
    element: <UserCrud />,
  },
  {
    path: "/CreateEmployee",
    element: <CreateEmployee />,
  },
  {
    path: "/AdminCrud/ReadEmployee",
    element: <ReadEmployee />,
  },
  {
    path: "/DeleteEmployee/:empNo",
    element: <DeleteEmployee />,
    loader: deleteEmployeeLoader,
  },
  {
    path: "/EditEmployee/:id",
    element: <EditEmployee />,
    loader: async ({ params }) => {
      const { id } = params;
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please sign in to edit employees.");

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/AdminCrud/ReadEmployee/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Employee not found or server error");

      const result = await response.json();
      return { id, data: result.data };
    },
  },
  {
    path: "/AiChatBox",
    element: <AiChatBox />,
    loader: async () => {
      // Optional: Add authentication check for AiChatBox
      const token = localStorage.getItem("token");
      if (!token) {
        // Redirect to sign-in if not authenticated
        return redirect("/SignIn/Admin");
      }
      // No preloaded data needed since AiChatBox uses WebSocket
      return null;
    },
  },
  {
    path: "/AdminCrud/ReadAllEmployee",
    element: <ReadAllEmployee />,
  },
  {
    path: "/UserCrud/UserRead",
    element: <UserRead />,
  },
  {
    path: "/UserCrud/UserReadAll",
    element: <UserReadAll />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
