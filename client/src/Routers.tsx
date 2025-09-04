import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { AuthInitializer } from "./AuthInitializer";
import ProtectedRoute from "./layouts/ProtectedRoute";
import GuestRoute from "./layouts/GuestRoute";
import Loading from "./components/ui/Loading";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ChatUI = lazy(() => import("./components/chat/ChatUI"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <GuestRoute />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      {
        path: "login",
        element: (
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<Loading />}>
            <Register />
          </Suspense>
        ),
      },
    ],
  },
]);

const Routers = () => {
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowChat(true), 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <AuthInitializer />
      <RouterProvider router={router} />
      {showChat && (
        <Suspense fallback={null}>
          <ChatUI />
        </Suspense>
      )}
    </>
  );
};

export default Routers;
