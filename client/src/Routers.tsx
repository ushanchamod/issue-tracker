import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthInitializer } from "./AuthInitializer";
import ProtectedRoute from "./layouts/ProtectedRoute";
import GuestRoute from "./layouts/GuestRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [{ index: true, element: <Dashboard /> }],
  },
  {
    path: "/auth",
    element: <GuestRoute />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);

const Routers = () => {
  return (
    <>
      <AuthInitializer />
      <RouterProvider router={router} />
    </>
  );
};

export default Routers;
