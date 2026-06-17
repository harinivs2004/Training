import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllApps, getAllCategories, searchApps, getAppsByCategory } from '../services/api';
 
export default function AppList() {
  const [apps, setApps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 
  useEffect(() => {
    Promise.all([getAllApps(), getAllCategories()])
      .then(([a, c]) => { setApps(a.data); setCategories(c.data); })
      .finally(() => setLoading(false));
  }, []);
 
  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearch(val);
    if (!val.trim()) { const r = await getAllApps(); setApps(r.data); return; }
    const r = await searchApps(val);
    setApps(r.data);
  };
 
  const handleCat = async (e) => {
    const val = e.target.value;
    setSelectedCat(val);
    if (!val) { const r = await getAllApps(); setApps(r.data); return; }
    const r = await getAppsByCategory(val);
    setApps(r.data);
  };
 
  const stars = (r) => r ? '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r)) : '☆☆☆☆☆';
 
  return (
    <div style={{ background: '#f0f2f5', minHeight: 'calc(100vh - 64px)', padding: '32px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a237e', marginBottom: '24px' }}>
          Browse All Apps
        </h1>
 
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <input
            value={search}
            onChange={handleSearch}
            placeholder="🔍 Search apps..."
            style={styles.searchInput}
          />
          <select value={selectedCat} onChange={handleCat} style={styles.select}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
 
        {loading ? (
          <div style={styles.center}>Loading...</div>
        ) : apps.length === 0 ? (
          <div style={styles.center}>No apps found 📭</div>
        ) : (
          <div style={styles.grid}>
            {apps.map(app => (
              <div key={app.id} style={styles.card} onClick={() => navigate(`/apps/${app.id}`)}>
                <div style={styles.icon}>
                  {app.iconUrl
                    ? <img src={app.iconUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} onError={e => e.target.style.display='none'} />
                    : <span style={{ fontSize: '32px' }}>📱</span>}
                </div>
                <h3 style={styles.appName}>{app.name}</h3>
                <p style={styles.appDesc}>{app.description?.substring(0, 70)}...</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ color: '#fb8c00', fontSize: '12px' }}>{stars(app.averageRating)}</span>
                  <span style={{ fontSize: '11px', color: '#546e7a' }}>⬇ {app.totalDownloads || 0}</span>
                </div>
                <button style={styles.btn}>View Details</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
 
const styles = {
  searchInput: {
    flex: 1, minWidth: '240px', padding: '12px 18px', borderRadius: '10px',
    border: '2px solid #e0e0e0', fontSize: '15px', background: '#fff',
  },
  select: {
    padding: '12px 18px', borderRadius: '10px',
    border: '2px solid #e0e0e0', fontSize: '15px', background: '#fff', color: '#1a1a2e',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  card: {
    background: '#fff', borderRadius: '16px', padding: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
  icon: {
    width: '70px', height: '70px',
    background: 'linear-gradient(135deg, #e8eaf6, #e0f7fa)',
    borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  appName: { fontSize: '15px', fontWeight: '700', color: '#1a1a2e' },
  appDesc: { fontSize: '12px', color: '#546e7a', lineHeight: '1.4', flex: 1 },
  btn: {
    background: '#1a237e', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '6px',
  },
  center: { textAlign: 'center', padding: '60px', color: '#546e7a', fontSize: '18px' },
};
 