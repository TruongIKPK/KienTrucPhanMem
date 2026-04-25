import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-nav sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-starbucks-accent rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🍜</span>
            </div>
            <span className="text-xl font-bold text-starbucks hidden sm:block">
              Food Order
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/menu" 
              className="text-text-primary font-medium hover:text-starbucks-accent transition-colors"
            >
              Menu
            </Link>
            {user && (
              <Link 
                to="/orders" 
                className="text-text-primary font-medium hover:text-starbucks-accent transition-colors"
              >
                Đơn hàng
              </Link>
            )}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-starbucks font-semibold hover:text-starbucks-dark transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link 
              to="/cart" 
              className="relative p-2 text-text-primary hover:text-starbucks-accent transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-starbucks-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-secondary hidden sm:block">
                  Xin chào, <span className="font-semibold text-starbucks">{user.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-text-primary border border-text-primary rounded-pill px-4 py-1.5 hover:bg-gray-100 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-text-primary border border-text-primary rounded-pill px-4 py-1.5 hover:bg-gray-100 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-starbucks-dark text-white rounded-pill px-4 py-1.5 hover:bg-black transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          <Link 
            to="/menu" 
            className="text-sm text-text-primary font-medium hover:text-starbucks-accent"
          >
            Menu
          </Link>
          {user && (
            <Link 
              to="/orders" 
              className="text-sm text-text-primary font-medium hover:text-starbucks-accent"
            >
              Đơn hàng
            </Link>
          )}
          {isAdmin && (
            <Link 
              to="/admin" 
              className="text-sm text-starbucks font-semibold hover:text-starbucks-dark"
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
