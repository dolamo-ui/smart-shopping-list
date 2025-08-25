
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import type { RootState } from './app/store';
import { logout } from './features/login/loginSlice';

import LoginForm from './features/login/LoginForm';
import RegisterForm from './features/register/RegisterForm';
import ShoppingList from './features/shoppingList/ShoppingList';
import Profile from './features/profile/Profile';

import './App.css';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => !!state.login.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="app-container">
      {/* Navigation menu only when logged in */}
      {isLoggedIn && (
        <nav className="nav-bar">
          <div className="nav-left">
            <div className="logo">🛍️ MyShop</div>
          </div>

          <div className="nav-right">
            <Link to="/shopping-list" className="nav-link">
              <FontAwesomeIcon icon={faShoppingCart} /> Shopping List
            </Link>
            <Link to="/profile" className="nav-link">
              <FontAwesomeIcon icon={faUser} /> Profile
            </Link>
            <button onClick={handleLogout} className="nav-link logout-button">
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </button>
          </div>
        </nav>
      )}

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? '/shopping-list' : '/login'} />}
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected Routes */}
        <Route
          path="/shopping-list"
          element={isLoggedIn ? <ShoppingList /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
