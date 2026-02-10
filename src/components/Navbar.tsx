import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/loginSlice';
import type { RootState } from '../store/store';
import { 
  ShoppingBag, 
  Plus, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { isAuthenticated, user } = useSelector((state: RootState) => state.login);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsMenuOpen(false);
  };

  const NavLink: React.FC<{ to: string; icon: React.ReactNode; text: string; onClick?: () => void }> = ({ to, icon, text, onClick }) => (
    <Link 
      to={to} 
      onClick={() => { setIsMenuOpen(false); onClick?.(); }}
      className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-all"
    >
      {icon}
      <span className="font-medium">{text}</span>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl text-white shadow-lg group-hover:shadow-xl transition-shadow">
              <ShoppingBag size={22} />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShopSwift
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" icon={<ShoppingBag size={18} />} text="Dashboard" />
                <NavLink to="/add" icon={<Plus size={18} />} text="Add Item" />
                <NavLink to="/profile" icon={<UserIcon size={18} />} text={user?.name || "Profile"} />
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 ml-2 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-5 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-all font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium ml-2"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" icon={<ShoppingBag size={18} />} text="Dashboard" />
                <NavLink to="/add" icon={<Plus size={18} />} text="Add Item" />
                <NavLink to="/profile" icon={<UserIcon size={18} />} text={user?.name || "Profile"} />
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium mt-2"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="block px-4 py-3 rounded-xl hover:bg-slate-100 text-slate-700 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg font-medium text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;