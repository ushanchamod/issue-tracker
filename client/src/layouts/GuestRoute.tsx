import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import Loading from "../components/ui/Loading";

export default function GuestRoute() {
  const { user, loading } = useAuthStore();

  if (loading) return <Loading />;

  if (!user) {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace />;
  }
}
