import { LogOut, User } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";

const TopBar = () => {
  const { fetchData } = useAxios();
  const user = useAuthStore((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-900 fixed top-0 left-0 w-full z-50 shadow-md">
      <h1 className="text-white text-lg font-medium">
        <Link to="/" className="hover:text-gray-300 transition-colors">
          I Tracker
        </Link>
      </h1>

      <div className="relative" ref={menuRef}>
        <button
          className="flex items-center gap-2 focus:outline-none cursor-pointer"
          onClick={toggleMenu}
          aria-label="User menu"
          aria-expanded={isMenuOpen}
        >
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <User color="#fff" size={18} />
          </div>
          <span className="text-white font-semibold uppercase hidden sm:inline">
            {user?.username}
          </span>
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 box-border">
            <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
              {user?.username}
            </div>
            <Link
              to="#"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors m-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>Profile</span>
              </div>
            </Link>
            <div
              className="flex gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-red-600 hover:text-gray-100 transition-colors m-2 cursor-pointer items-center"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
