import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="font-bold text-2xl hover:text-blue-400 transition"
        >
          MyApp
        </Link>

        <div className="flex gap-6 items-center">
          {/* USER LOGGED OUT */}
          {!user && (
            <>
              <Link
                to="/login"
                className="hover:text-blue-400 transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg transition font-medium"
              >
                Register
              </Link>
            </>
          )}

          {/* USER LOGGED IN */}
          {user && (
            <>
              <span className="text-sm bg-gray-700 px-4 py-2 rounded-full">
                {user.username}
              </span>
              <Link
                to="/dashboard"
                className="hover:text-blue-400 transition font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 px-5 py-2 rounded-lg hover:bg-red-600 transition font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
