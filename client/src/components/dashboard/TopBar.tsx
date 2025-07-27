import { LogOut, User } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
// import { Link } from "react-router-dom"; // Keep your original import
import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

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
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 fixed top-0 left-0 w-full z-50 backdrop-blur-sm bg-white/95">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          IssueTracker
        </h1>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setToggleMenu(true)}
        onMouseLeave={() => setToggleMenu(false)}
      >
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 capitalize">
              {user?.username}
            </span>
          </div>
        </div>

        {toggleMenu && (
          <div className="absolute top-full right-0 mt-2 w-48 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-1">
                <Link
                  to=""
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Profile</span>
                </Link>

                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
