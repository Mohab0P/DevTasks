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
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-3xl font-bold flex items-center gap-2 hover:scale-110 transition-transform">
          <span className="text-4xl">📋</span>
          <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            DevTasks
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-6">
            <Link 
              to="/dashboard" 
              className="hover:text-yellow-300 font-medium transition-colors flex items-center gap-1"
            >
              🏠 الرئيسية
            </Link>
            <div className="flex items-center gap-2 bg-blue-700 bg-opacity-50 px-4 py-2 rounded-full">
              <span className="text-2xl">👤</span>
              <span className="font-medium">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg font-medium transform hover:scale-105 transition-all shadow-lg flex items-center gap-2"
            >
              🚪 خروج
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
