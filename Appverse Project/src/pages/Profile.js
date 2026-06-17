import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getDownloadsByUser, getReviewsByApp, getAllReviews } from '../services/api';
 
export default function Profile() {
  const { user, logout } = useAuth();
  const [downloads, setDownloads] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
 
  useEffect(() => {
    if (!user) return;
    Promise.all([
      getDownloadsByUser(user.id),
      getAllReviews(),
    ]).then(([d, r]) => {
      setDownloads(d.data);
      setMyReviews(r.data.filter(rv => rv.userId === user.id));
    });
  }, [user]);
 
  const roleColor = { USER: '#3949ab', DEVELOPER: '#00897b', ADMIN: '#c62828' };
  const roleBg = { USER: '#e8eaf6', DEVELOPER: '#e0f7fa', ADMIN: '#fce4ec' };
 
  return (
    <div style={{ background: '#f0f2f5', minHeight: 'calc(100vh - 64px)', padding: '32px 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
 
        {/* Profile Card */}
        <div style={styles.profileCard}>
          <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>{user?.name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>{user?.email}</p>
            <span style={{ ...styles.roleBadge, background: roleBg[user?.role], color: roleColor[user?.role] }}>
              {user?.role}
            </span>
          </div>
          <button onClick={logout} style={styles.logoutBtn}>Sign Out</button>
        </div>
 
        {/* Stats */}
        <div style={styles.statsRow}>
          {[
            { icon: '⬇', label: 'Downloads', value: downloads.length },
            { icon: '💬', label: 'My Reviews', value: myReviews.length },
            { icon: '🆔', label: 'User ID', value: `#${user?.id}` },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ fontSize: '28px' }}>{s.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#1a237e' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#546e7a' }}>{s.label}</div>
            </div>
          ))}
        </div>
 
        {/* Account Info */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Account Information</h2>
          {[
            { label: 'Full Name', value: user?.name },
            { label: 'Email Address', value: user?.email },
            { label: 'Account Role', value: user?.role },
            { label: 'User ID', value: `#${user?.id}` },
          ].map((item, i) => (
            <div key={i} style={styles.infoRow}>
              <span style={styles.infoLabel}>{item.label}</span>
              <span style={styles.infoValue}>{item.value}</span>
            </div>
          ))}
        </div>
 
        {/* Recent Reviews */}
        {myReviews.length > 0 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>💬 My Reviews</h2>
            {myReviews.slice(0, 5).map(r => (
              <div key={r.id} style={styles.reviewItem}>
                <div style={{ color: '#fb8c00' }}>{'★'.repeat(r.rating)}</div>
                <p style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>{r.comment}</p>
                <div style={{ fontSize: '11px', color: '#9e9e9e', marginTop: '4px' }}>App #{r.appId}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
 
const styles = {
  profileCard: {
    background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
    borderRadius: '20px', padding: '32px',
    display: 'flex', alignItems: 'center', gap: '24px',
    marginBottom: '24px', color: '#fff',
  },
  avatar: {
    width: '80px', height: '80px', background: '#00bcd4',
    borderRadius: '50%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '32px', fontWeight: '800', color: '#fff', minWidth: '80px',
  },
  roleBadge: {
    display: 'inline-block', padding: '3px 14px', borderRadius: '12px',
    fontSize: '12px', fontWeight: '700', marginTop: '8px',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px',
  },
  statCard: {
    background: '#fff', borderRadius: '14px', padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
  },
  card: {
    background: '#fff', borderRadius: '16px', padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '24px',
  },
  cardTitle: { fontSize: '18px', fontWeight: '800', color: '#1a237e', marginBottom: '20px' },
  infoRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 0', borderBottom: '1px solid #f0f0f0',
  },
  infoLabel: { fontSize: '13px', color: '#546e7a', fontWeight: '600' },
  infoValue: { fontSize: '15px', fontWeight: '700', color: '#1a1a2e' },
  reviewItem: { padding: '14px 0', borderBottom: '1px solid #f0f0f0' },
};