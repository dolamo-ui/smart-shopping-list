import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../app/store';
import { setEmail, setPassword, loginSuccess, loginFailure } from './loginSlice';
import { useNavigate, Link } from 'react-router-dom';
import styles from './LoginForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { email, password, error } = useSelector((state: RootState) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
      dispatch(loginFailure('Login timed out. Please try again.'));
    }, 300000); // 3 minutes

    try {
      const res = await fetch('http://localhost:3001/users');
      const users = await res.json();

      const user = users.find(
        (u: { email: string; password: string }) =>
          u.email === email && u.password === password
      );

      if (user) {
        dispatch(loginSuccess(user));
        navigate('/shopping-list');
      } else {
        dispatch(loginFailure('Invalid email or password'));
      }
    } catch {
      dispatch(loginFailure('Login failed. Please try again.'));
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Sign in your account</h2>
      </div>

      {/* Logo */}
      <div className={styles.logo}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/1170/1170576.png"
          alt="logo"
        />
      </div>

      <form onSubmit={handleLogin}>
        {/* Email */}
        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faEnvelope} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
            required
          />
        </div>

        {/* Password */}
        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faLock} />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
            required
          />
          
         
        </div>

          <FontAwesomeIcon
      icon={showPassword ? faEyeSlash : faEye}
      className={styles.eyeIcon}
      onClick={() => setShowPassword(!showPassword)}
    />





        {/* Error */}
        {error && <p className={styles.error}>{error}</p>}

        {/* Button with spinner */}
        <button type="submit" className={styles.btn} disabled={loading}>
          {loading && <span className={styles.btnSpinner}></span>}
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Footer */}
        <div className={styles.footer}>
          Don’t have an account? <Link to="/register">Sign Up</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
