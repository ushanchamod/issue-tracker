import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import useAxios from "./hooks/useAxios";

export function AuthInitializer() {
  const { fetchData } = useAxios();
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchData({
          url: "/user/me",
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Fetched user:", response.data.data.username);

        setUser({
          username: response.data.data.username,
        });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [setUser, setLoading]);

  return null;
}
