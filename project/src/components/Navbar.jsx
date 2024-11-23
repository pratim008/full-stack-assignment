import { ShoppingCart, Store, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Store className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-800">EcoStore</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user?.isAdmin ? (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/cart"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <ShoppingCart className="h-6 w-6" />
              </Link>
            )}
            
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{user.username}</span>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-indigo-600"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-gray-700 hover:text-indigo-600"
              >
                <User className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}