import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser, getUserById, getAllUsers } from '../services/api';
import { useAuth } from '../context/AuthContext';
 
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
 
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await loginUser(form);
      const { token, email, role } = res.data;
 
      
      localStorage.setItem('token', token);
      const usersRes = await getAllUsers();
      const fullUser = usersRes.data.find(u => u.email === email);
 
      const userData = {
        id: fullUser?.id,
        name: fullUser?.name || email,
        email,
        role,
      };
 
      login(userData, token);
      toast.success('Login successful! Welcome back 👋');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>🚀</div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to AppVerse AI</p>
        </div>
 
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              style={styles.input}
            />
          </div>
 
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={styles.input}
            />
          </div>
 
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
 
        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create one free</Link>
        </p>
      </div>
    </div>
  );
}
 
const styles = {
  page: {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e8eaf6 0%, #e0f7fa 100%)',
    padding: '20px',
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
  },
  header: { textAlign: 'center', marginBottom: '32px' },
  icon: { fontSize: '48px', marginBottom: '12px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1a237e', marginBottom: '6px' },
  subtitle: { color: '#546e7a', fontSize: '15px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#546e7a', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: {
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '15px',
    transition: 'border 0.2s',
    color: '#1a1a2e',
  },
  btn: {
    background: 'linear-gradient(135deg, #1a237e, #3949ab)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
  },
  footer: { textAlign: 'center', marginTop: '24px', color: '#546e7a', fontSize: '14px' },
  link: { color: '#1a237e', fontWeight: '700' },
};