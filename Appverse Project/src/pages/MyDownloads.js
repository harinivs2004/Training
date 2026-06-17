import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDownloadsByUser, getAppById } from '../services/api';
import { useAuth } from '../context/AuthContext';
 
export default function MyDownloads() {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState([]);
  const [appDetails, setAppDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 
  useEffect(() => {
    if (!user) return;
    getDownloadsByUser(user.id).then(async (res) => {
      setDownloads(res.data);
      const details = {};
      await Promise.all(res.data.map(async (d) => {
        try {
          const app = await getAppById(d.appId);
          details[d.appId] = app.data;
        } catch {}
      }));
      setAppDetails(details);
    }).finally(() => setLoading(false));
  }, [user]);
 
  return (
    <div style={{ background: '#f0f2f5', minHeight: 'calc(100vh - 64px)', padding: '32px 0' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a237e', marginBottom: '8px' }}>
          ⬇ My Downloads
        </h1>
        <p style={{ color: '#546e7a', marginBottom: '28px' }}>All apps you have downloaded</p>
 
        {loading ? (
          <div style={styles.center}>Loading...</div>
        ) : downloads.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
            <h2 style={{ color: '#1a237e', marginBottom: '8px' }}>No Downloads Yet</h2>
            <p style={{ color: '#546e7a', marginBottom: '24px' }}>Start exploring and download some apps!</p>
            <button onClick={() => navigate('/apps')} style={styles.btn}>Browse Apps</button>
          </div>
        ) : (
          <div style={styles.grid}>
            {downloads.map(d => {
              const app = appDetails[d.appId];
              return (
                <div key={d.id} style={styles.card}>
                  <div style={styles.appIcon}>
                    {app?.iconUrl ? (
                      <img src={app.iconUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} onError={e => e.target.style.display='none'} />
                    ) : <span style={{ fontSize: '32px' }}>📱</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' }}>
                      {app?.name || `App #${d.appId}`}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#546e7a' }}>
                      Downloaded: {d.downloadedAt ? new Date(d.downloadedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <button onClick={() => navigate(`/apps/${d.appId}`)} style={styles.viewBtn}>View →</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
 
const styles = {
  center: { textAlign: 'center', padding: '60px', color: '#546e7a', fontSize: '18px' },
  emptyState: {
    textAlign: 'center', padding: '60px', background: '#fff',
    borderRadius: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  btn: {
    background: '#1a237e', color: '#fff', border: 'none',
    borderRadius: '10px', padding: '12px 28px', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
  },
  grid: { display: 'flex', flexDirection: 'column', gap: '14px' },
  card: {
    background: '#fff', borderRadius: '14px', padding: '18px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex',
    alignItems: 'center', gap: '16px',
  },
  appIcon: {
    width: '56px', height: '56px', minWidth: '56px',
    background: 'linear-gradient(135deg, #e8eaf6, #e0f7fa)',
    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  viewBtn: {
    background: '#1a237e', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
};
 