import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDownloadsByUser, getRecommendationsByUser, getAllApps, getAllReviews } from '../services/api';
import { useNavigate } from 'react-router-dom';
 
export default function Dashboard() {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [totalApps, setTotalApps] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const navigate = useNavigate();
 
  useEffect(() => {
    if (!user) return;
    Promise.all([
      getDownloadsByUser(user.id),
      getRecommendationsByUser(user.id),
      getAllApps(),
      getAllReviews(),
    ]).then(([d, r, a, rv]) => {
      setDownloads(d.data);
      setRecommendations(r.data);
      setTotalApps(a.data.length);
      setTotalReviews(rv.data.length);
    }).catch(console.error);
  }, [user]);
 
  const cards = [
    { icon: '⬇', label: 'My Downloads', value: downloads.length, color: '#1a237e' },
     ...(user?.role === 'USER'
    ? [{
        icon: '💡',
        label: 'Recommendations',
        value: recommendations.length,
        color: '#00897b'
      }]
    : []),
    { icon: '📱', label: 'Total Apps', value: totalApps, color: '#6a1b9a' },
    { icon: '💬', label: 'Total Reviews', value: totalReviews, color: '#e65100' },
  ];
 
  return (
    <div style={{ background: '#f0f2f5', minHeight: 'calc(100vh - 64px)', padding: '32px 0' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a237e' }}>
            Welcome back, {user?.name} 👋
          </h1>
          <p style={{ color: '#546e7a', marginTop: '4px' }}>Here's your AppVerse dashboard</p>
        </div>
 
        {/* Stats */}
        <div style={styles.statsGrid}>
          {cards.map((c, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: c.color }}>{c.icon}</div>
              <div style={styles.statNum}>{c.value}</div>
              <div style={styles.statLabel}>{c.label}</div>
            </div>
          ))}
        </div>
 
        {/* Quick Actions */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Quick Actions</h2>
          <div style={styles.actionsGrid}>
            {[
              { icon: '🔍', label: 'Browse Apps', path: '/apps' },
              { icon: '⬇', label: 'My Downloads', path: '/my-downloads' },
              ...(user?.role === 'USER'
  ? [{
      icon: '💡',
      label: 'Recommendations',
      path: '/recommendations'
    }]
  : []),
              { icon: '👤', label: 'My Profile', path: '/profile' },
              ...(user?.role === 'DEVELOPER' || user?.role === 'ADMIN'
                ? [{ icon: '🛠', label: 'Developer Console', path: '/developer' }]
                : []),
              ...(user?.role === 'ADMIN'
                ? [{ icon: '⚙', label: 'Admin Panel', path: '/admin' }]
                : []),
            ].map((a, i) => (
              <button key={i} onClick={() => navigate(a.path)} style={styles.actionBtn}>
                <span style={{ fontSize: '28px' }}>{a.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
 
        {/* Recent Downloads */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Recent Downloads</h2>
          {downloads.length === 0 ? (
            <div style={styles.empty}>
              <p>No downloads yet</p>
              <button onClick={() => navigate('/apps')} style={styles.emptyBtn}>Browse Apps</button>
            </div>
          ) : (
            downloads.slice(0, 5).map(d => (
              <div key={d.id} style={styles.listItem}>
                <span style={styles.listIcon}>📱</span>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>App ID: {d.appId}</div>
                  <div style={{ fontSize: '12px', color: '#546e7a' }}>
                    Downloaded: {d.downloadedAt ? new Date(d.downloadedAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <button onClick={() => navigate(`/apps/${d.appId}`)} style={styles.viewBtn}>View</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
 
const styles = {
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' },
  statCard: {
    background: '#fff', borderRadius: '16px', padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', textAlign: 'center',
  },
  statIcon: {
    width: '52px', height: '52px', borderRadius: '14px', margin: '0 auto 14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#fff',
  },
  statNum: { fontSize: '32px', fontWeight: '900', color: '#1a1a2e', lineHeight: 1 },
  statLabel: { fontSize: '13px', color: '#546e7a', marginTop: '6px' },
  card: {
    background: '#fff', borderRadius: '16px', padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '24px',
  },
  cardTitle: { fontSize: '18px', fontWeight: '800', color: '#1a237e', marginBottom: '20px' },
  actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '14px' },
  actionBtn: {
    background: '#f8f9ff', border: '2px solid #e8eaf6', borderRadius: '14px',
    padding: '20px 12px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s',
    color: '#1a237e',
  },
  listItem: {
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '12px 0', borderBottom: '1px solid #f0f0f0',
  },
  listIcon: { fontSize: '28px' },
  viewBtn: {
    marginLeft: 'auto', background: '#1a237e', color: '#fff',
    border: 'none', borderRadius: '8px', padding: '6px 14px',
    fontSize: '12px', fontWeight: '600', cursor: 'pointer',
  },
  empty: { textAlign: 'center', padding: '30px', color: '#546e7a' },
  emptyBtn: {
    marginTop: '12px', background: '#1a237e', color: '#fff',
    border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontWeight: '600',
  },
};
 