import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import User from "./pages/User.jsx";
import Home from "./pages/Home.jsx";
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import PageNotFound from './Pages/PageNotFound '
import RecoverAccount from './pages/RecoverAccount.jsx'
import ResetPassword from "./pages/ResetPassword.jsx";
import Course from "./pages/Course.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/recover-account",
        element: <RecoverAccount/>,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/user",
        element: <User />,
      },
      {
        path: "/course/:courseId",
        element: <Course />,
      },
       
    ],
  },
  {
    path:'*',
    element:<PageNotFound/>
  }
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}>
    <App  />
  </RouterProvider>
);
