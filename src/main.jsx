import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import User from "./pages/User.jsx";
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import PageNotFound from './Pages/PageNotFound '
import RecoverAccount from './pages/RecoverAccount.jsx'
import ResetPassword from "./Pages/ResetPassword";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      
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
