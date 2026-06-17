import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
 
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
 
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
 
  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🚀</span>
          <span style={styles.logoText}>AppVerse AI</span>
        </Link>
 
        {/* Desktop Links */}
        <div style={styles.links}>
          {user && (
  <>
    <Link to="/" style={styles.link}>Home</Link>
    <Link to="/apps" style={styles.link}>Browse Apps</Link>
  </>
)}
 
          {user && (
            <>
              <Link to="/dashboard" style={styles.link}>Dashboard</Link>
              {(user.role === 'DEVELOPER' || user.role === 'ADMIN') && (
              <Link to="/analytics" style={styles.link}>Analytics</Link>
               )}
              <Link to="/my-downloads" style={styles.link}>Downloads</Link>
              {user?.role === 'USER' && (
             <Link to="/recommendations" style={styles.link}>
               For You
              </Link>
           )} 
            </>
          )}
 
          {user && (user.role === 'DEVELOPER' || user.role === 'ADMIN') && (
            <Link to="/developer" style={styles.link}>Dev Console</Link>
          )}
 
          {user && user.role === 'ADMIN' && (
            <Link to="/admin" style={styles.link}>Admin</Link>
          )}
        </div>
 
        {/* Auth Buttons */}
        <div style={styles.authArea}>
          {user ? (
            <div style={styles.userArea}>
              <Link to="/profile" style={styles.userBadge}>
                <span style={styles.avatar}>{user.name ? user.name[0].toUpperCase() : 'U'}</span>
                <span style={styles.userName}>{user.name}</span>
                <span style={styles.roleBadge}>{user.role}</span>
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>
          ) : (
            <div style={styles.authBtns}>
              <Link to="/login" style={styles.loginBtn}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
 
const styles = {
  nav: {
    background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
    padding: '0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
  },
  logoIcon: { fontSize: '24px' },
  logoText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: '20px',
    letterSpacing: '-0.5px',
  },
  links: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
  link: {
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  authArea: { display: 'flex', alignItems: 'center' },
  userArea: { display: 'flex', alignItems: 'center', gap: '12px' },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    background: 'rgba(255,255,255,0.1)',
    padding: '6px 12px',
    borderRadius: '20px',
  },
  avatar: {
    width: '30px',
    height: '30px',
    background: '#00bcd4',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: '13px',
  },
  userName: { color: '#fff', fontWeight: '600', fontSize: '14px' },
  roleBadge: {
    background: '#00bcd4',
    color: '#fff',
    fontSize: '10px',
    padding: '2px 7px',
    borderRadius: '10px',
    fontWeight: '700',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.4)',
    color: '#fff',
    padding: '6px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  authBtns: { display: 'flex', gap: '8px', alignItems: 'center' },
  loginBtn: {
    color: '#fff',
    textDecoration: 'none',
    padding: '7px 18px',
    borderRadius: '6px',
    fontSize: '14px',
    border: '1px solid rgba(255,255,255,0.4)',
  },
  registerBtn: {
    background: '#00bcd4',
    color: '#fff',
    textDecoration: 'none',
    padding: '7px 18px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
  },
};