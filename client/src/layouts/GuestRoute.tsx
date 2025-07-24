import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export default function GuestRoute() {
  const { user, loading } = useAuthStore();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace />;
  }
}
