import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          DevTasks
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hover:text-blue-200">
              الرئيسية
            </Link>
            <span className="text-blue-200">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
            >
              خروج
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
