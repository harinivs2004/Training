import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getRecommendationsByUser, createRecommendation, getAllApps, deleteRecommendation, getAppById } from '../services/api';
import { useAuth } from '../context/AuthContext';
 
export default function Recommendations() {
  const { user } = useAuth();
  const [recs, setRecs] = useState([]);
  const [apps, setApps] = useState([]);
  const [appDetails, setAppDetails] = useState({});
  const [form, setForm] = useState({ appId: '', reason: '', score: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 
  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);
  if (user && user.role !== "USER") {
    return (
        <div style={{ padding: "30px", textAlign: "center" }}>
            <h2>Access Denied</h2>
            <p>Only Users can view Recommendations.</p>
        </div>
    );
}
 
  const loadData = async () => {
    try {
      const [recsRes, appsRes] = await Promise.all([
        getRecommendationsByUser(user.id),
        getAllApps(),
      ]);
      setRecs(recsRes.data);
      setApps(appsRes.data);
      const details = {};
      await Promise.all(recsRes.data.map(async r => {
        try { const a = await getAppById(r.appId); details[r.appId] = a.data; } catch {}
      }));
      setAppDetails(details);
    } catch { toast.error('Failed to load recommendations'); }
    finally { setLoading(false); }
  };
 
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.appId || !form.reason) { toast.error('App and reason required'); return; }
    try {
      await createRecommendation({ ...form, appId: Number(form.appId), score: Number(form.score), userId: user.id });
      toast.success('Recommendation added!');
      setForm({ appId: '', reason: '', score: '' });
      loadData();
    } catch { toast.error('Failed to add recommendation'); }
  };
 
  const handleDelete = async (id) => {
    try { await deleteRecommendation(id); toast.success('Removed'); loadData(); }
    catch { toast.error('Failed to remove'); }
  };
 
  return (
    <div style={{ background: '#f0f2f5', minHeight: 'calc(100vh - 64px)', padding: '32px 0' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a237e', marginBottom: '8px' }}>
          💡 Recommendations For You
        </h1>
        <p style={{ color: '#546e7a', marginBottom: '28px' }}>Apps recommended based on your preferences</p>
 
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Add Recommendation */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>➕ Add Recommendation</h2>
            <form onSubmit={handleAdd} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Select App</label>
                <select value={form.appId} onChange={e => setForm({ ...form, appId: e.target.value })} style={styles.input}>
                  <option value="">Choose an app</option>
                  {apps.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Reason</label>
                <input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                  placeholder="Why recommend this?" style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Score (0-10)</label>
                <input type="number" min="0" max="10" step="0.1" value={form.score}
                  onChange={e => setForm({ ...form, score: e.target.value })}
                  placeholder="8.5" style={styles.input} />
              </div>
              <button type="submit" style={styles.btn}>Add Recommendation</button>
            </form>
          </div>
 
          {/* Recommendations List */}
          <div style={{ ...styles.card, flex: 2 }}>
            <h2 style={styles.cardTitle}>Your Recommendations ({recs.length})</h2>
            {loading ? <p style={styles.empty}>Loading...</p> :
              recs.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={{ fontSize: '48px' }}>💡</div>
                  <p style={{ color: '#546e7a', marginTop: '12px' }}>No recommendations yet</p>
                </div>
              ) : (
                recs.map(r => {
                  const app = appDetails[r.appId];
                  return (
                    <div key={r.id} style={styles.recItem}>
                      <div style={styles.appIcon}>
                        {app?.iconUrl ? (
                          <img src={app.iconUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} onError={e => e.target.style.display='none'} />
                        ) : <span style={{ fontSize: '24px' }}>📱</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a2e' }}>
                            {app?.name || `App #${r.appId}`}
                          </h3>
                          <span style={styles.scoreBadge}>⭐ {r.score}/10</span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#546e7a', marginTop: '4px' }}>{r.reason}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => navigate(`/apps/${r.appId}`)} style={styles.viewBtn}>View</button>
                        <button onClick={() => handleDelete(r.id)} style={styles.delBtn}>✕</button>
                      </div>
                    </div>
                  );
                })
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
 
const styles = {
  card: {
    background: '#fff', borderRadius: '16px', padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '24px', flex: 1, minWidth: '280px',
  },
  cardTitle: { fontSize: '18px', fontWeight: '800', color: '#1a237e', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '700', color: '#546e7a', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: {
    border: '2px solid #e0e0e0', borderRadius: '10px',
    padding: '11px 14px', fontSize: '14px', color: '#1a1a2e', background: '#fff',
  },
  btn: {
    background: '#1a237e', color: '#fff', border: 'none',
    borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
  },
  recItem: {
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '14px 0', borderBottom: '1px solid #f0f0f0',
  },
  appIcon: {
    width: '48px', height: '48px', minWidth: '48px',
    background: 'linear-gradient(135deg, #e8eaf6, #e0f7fa)',
    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  scoreBadge: {
    background: '#e8f5e9', color: '#2e7d32',
    padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '700',
  },
  viewBtn: {
    background: '#1a237e', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
  },
  delBtn: {
    background: '#fce4e4', color: '#c62828', border: 'none',
    borderRadius: '8px', padding: '6px 10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
  },
  emptyState: { textAlign: 'center', padding: '30px' },
  empty: { color: '#546e7a', textAlign: 'center', padding: '20px' },
};
 