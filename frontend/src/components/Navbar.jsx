import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">BookStore</span>
            </Link>
          </div>

          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                Home
              </Link>
              <Link to="/books" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                Books
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <Link to="/cart" className="text-gray-700 hover:text-blue-600 p-2 relative">
              <ShoppingCartIcon className="h-6 w-6" />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {items.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="ml-4 flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="text-gray-700 hover:text-blue-600">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="ml-4 flex items-center text-gray-700 hover:text-blue-600">
                <UserIcon className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
