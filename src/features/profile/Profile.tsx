import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from './profileSlice';
import type { RootState, AppDispatch } from '../../app/store';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.login);
  const { name, surname, email, password, cell, status, error, id } = useSelector((state: RootState) => state.profile);

  const [form, setForm] = useState({ name: '', surname: '', email: '', password: '', cell: '' });

  useEffect(() => {
    if (user?.id) dispatch(fetchProfile(user.id));
  }, [dispatch, user]);

  useEffect(() => {
    setForm({ name, surname, email, password, cell });
  }, [name, surname, email, password, cell]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!id) return;
    await dispatch(updateProfile({ userId: id, updatedData: { ...form } }));
    alert('Profile updated successfully!');
  };

  if (status === 'loading') return <p>Loading profile...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div className={styles.profileContainer}>
      <h2>👤 User Profile</h2>

      <input
        className={styles.inputField}
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="First Name"
      />
      <input
        className={styles.inputField}
        name="surname"
        value={form.surname}
        onChange={handleChange}
        placeholder="Last Name"
      />
      <input
        className={styles.inputField}
        name="cell"
        value={form.cell}
        onChange={handleChange}
        placeholder="Phone Number"
      />
      <input
        className={styles.inputField}
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        className={styles.inputField}
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
      />

      <button className={styles.saveButton} onClick={handleUpdate}>
        Save All Changes
      </button>
    </div>
  );
};

export default Profile;
