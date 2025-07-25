import { LogOut, User } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { Link } from "react-router-dom";
import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";

const TopBar = () => {
  const { fetchData } = useAxios();
  const user = useAuthStore((state) => state.user);
  const [toggleMenu, setToggleMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await fetchData({
        url: "/user/logout",
        method: "post",
      });

      toast.success("Logout successful", {
        autoClose: 2000,
        position: "bottom-right",
        theme: "colored",
      });
      location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("An error occurred during Logout", {
        autoClose: 2000,
        position: "bottom-right",
        theme: "colored",
      });
    }
  };

  return (
    <div className="flex flex-row items-center justify-between p-3 px-7 bg-gray-900 fixed top-0 left-0 w-full z-2">
      <p className="hidden sm:flex text-white text-lg font-medium">I Tracker</p>
      <p className="flex sm:hidden text-white text-lg font-medium">I Tracker</p>
      <div
        className="flex items-center gap-3 cursor-pointer relative"
        onMouseEnter={() => setToggleMenu(true)}
        onMouseLeave={() => setToggleMenu(false)}
      >
        <User color="#fff" size={22} />
        <span className="text-white font-semibold uppercase">
          {user?.username}
        </span>
        {toggleMenu && (
          <div className="absolute top-4 right-0 ">
            <div className="mt-1 p-2 bg-gray-800">
              <Link
                to={""}
                className="flex items-center justify-start gap-2 p-2 px-4 mb-0.5 hover:bg-gray-600 rounded-sm"
              >
                <User color="#fff" size={18} />
                <span className="text-white font-semibold text-[14px]">
                  Profile
                </span>
              </Link>

              <button
                className="flex items-center justify-start gap-2 p-2 px-4 hover:bg-red-600 rounded-sm"
                onClick={handleLogout}
              >
                <LogOut color="#fff" size={18} />
                <span className="text-white font-semibold text-[14px]">
                  Logout
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
