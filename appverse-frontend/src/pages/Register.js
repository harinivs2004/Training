import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../services/api';
 
export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await registerUser(form);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.email || err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>✨</div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join AppVerse AI today</p>
        </div>
 
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="John Developer" style={styles.input} />
          </div>
 
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="john@example.com" style={styles.input} />
          </div>
 
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="Minimum 6 characters" style={styles.input} />
          </div>
 
          <div style={styles.field}>
            <label style={styles.label}>Register As</label>
            <select name="role" value={form.role} onChange={handleChange} style={styles.input}>
              <option value="USER">User — Browse & download apps</option>
              <option value="DEVELOPER">Developer — Publish apps</option>
              <option value="ADMIN">Admin — Manage platform</option>
            </select>
          </div>
 
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
 
        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
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
    maxWidth: '440px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
  },
  header: { textAlign: 'center', marginBottom: '32px' },
  icon: { fontSize: '48px', marginBottom: '12px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1a237e', marginBottom: '6px' },
  subtitle: { color: '#546e7a', fontSize: '15px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#546e7a', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: {
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '15px',
    color: '#1a1a2e',
    background: '#fff',
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