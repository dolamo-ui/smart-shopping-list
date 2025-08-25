import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { AppDispatch } from '../../app/store';
import { loginSuccess, loginFailure } from '../login/loginSlice';
import styles from './RegisterForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhoneAlt, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cell, setCell] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Passwords do not match');

    try {
      const resCheck = await fetch(`http://localhost:3001/users?email=${encodeURIComponent(email)}`);
      const existingUsers = await resCheck.json();
      if (existingUsers.length > 0) return setError('Email already registered');

      const newUser = { name, email, password, cell };
      const res = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        const createdUser = await res.json();
        dispatch(loginSuccess(createdUser));
        navigate('/shopping-list');
      } else {
        setError('Registration failed. Try again.');
        dispatch(loginFailure('Registration failed'));
      }
    } catch {
      setError('Server error. Please try again.');
      dispatch(loginFailure('Server error'));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Sign up new account</h2>
        <div className={styles.logo}>
          <img src="https://cdn-icons-png.flaticon.com/512/1170/1170576.png" alt="Logo" />
        </div>
      </div>

      <form onSubmit={handleRegister}>
        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faUser} />
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faEnvelope} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faPhoneAlt} />
          <input type="tel" placeholder="Phone number" value={cell} onChange={(e) => setCell(e.target.value)} required />
        </div>

        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faLock} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faLock} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
          />






        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.btn}>Sign Up</button>
      </form>

      <div className={styles.footerText}>
        Already have an account? <Link to="/login">Sign In</Link>
      </div>
    </div>
  );
};

export default RegisterForm;
