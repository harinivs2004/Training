import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getAppById,
  getReviewsByApp,
  createReview,
  downloadApp,
  getDownloadsByUser,
  getTotalDownloads,
  getVersionsByApp,
  deleteReview
} from '../services/api';
import { useAuth } from '../context/AuthContext';
 
export default function AppDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [versions, setVersions] = useState([]);
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [reviewForm, setReviewForm] = useState({ comment: '', rating: 5 });
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
 
  useEffect(() => {
    fetchAll();
  }, [id]);
 
  const fetchAll = async () => {
    try {
      const [appRes, reviewsRes, versionsRes, dlRes] = await Promise.all([
        getAppById(id),
        getReviewsByApp(id),
        getVersionsByApp(id),
        getTotalDownloads(id),
      ]);
      setApp(appRes.data);
      setReviews(reviewsRes.data);
      setVersions(versionsRes.data);
      setTotalDownloads(dlRes.data);
      if (user) {
  const myDownloads = await getDownloadsByUser(user.id);
 
  const alreadyDownloaded =
    myDownloads.data.some(d => d.appId === Number(id));
 
  setIsDownloaded(alreadyDownloaded);
}
    } catch (err) {
      toast.error('App not found');
      navigate('/apps');
    } finally {
      setLoading(false);
    }
  };
 
  const handleDownload = async () => {
    if (!user) { toast.error('Please login to download'); navigate('/login'); return; }
    setDownloading(true);
    try {
      await downloadApp(user.id, app.id);
      setIsDownloaded(true);
      toast.success('App downloaded successfully! 🎉');
      setTotalDownloads(prev => prev + 1);
    } catch (err) {
      toast.error('Download failed');
    } finally {
      setDownloading(false);
    }
  };
 
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); navigate('/login'); return; }
    if (!reviewForm.comment.trim()) { toast.error('Comment is required'); return; }
    try {
      await createReview({ ...reviewForm, userId: user.id, appId: app.id });
      toast.success('Review posted! ⭐');
      setReviewForm({ comment: '', rating: 5 });
      const res = await getReviewsByApp(id);
      setReviews(res.data);
    } catch (err) {
      toast.error('Failed to post review');
    }
  };
 
  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      toast.success('Review deleted');
      const res = await getReviewsByApp(id);
      setReviews(res.data);
    } catch { toast.error('Failed to delete review'); }
  };
 
  const stars = (r) => '★'.repeat(r) + '☆'.repeat(5 - r);
 
  if (loading) return <div style={styles.loading}>Loading app details...</div>;
  if (!app) return null;
 
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* App Header */}
        <div style={styles.header}>
          <div style={styles.appIcon}>
            {app.iconUrl ? (
              <img src={app.iconUrl} alt={app.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '20px' }}
                onError={(e) => { e.target.style.display = 'none'; }} />
            ) : <span style={{ fontSize: '48px' }}>📱</span>}
          </div>
          <div style={styles.headerInfo}>
            <h1 style={styles.appName}>{app.name}</h1>
            <p style={styles.appDesc}>{app.description}</p>
            <div style={styles.metaRow}>
              <span style={styles.metaBadge}>⬇ {totalDownloads} Downloads</span>
              <span style={styles.metaBadge}>⭐ {app.averageRating?.toFixed(1) || 'N/A'} Rating</span>
              <span style={styles.metaBadge}>📦 {versions.length} Versions</span>
            </div>
            <button onClick={handleDownload} disabled={downloading || isDownloaded} style={styles.downloadBtn}>
             {isDownloaded
  ? '✓ Downloaded'
  : downloading
    ? 'Downloading...'
    : '⬇ Download App'}
            </button>
          </div>
        </div>
 
        <div style={styles.twoCol}>
          {/* Left Column */}
          <div style={{ flex: 2 }}>
            {/* Versions */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>📦 Version History</h2>
              {versions.length === 0 ? (
                <p style={styles.empty}>No versions available</p>
              ) : (
                versions.map(v => (
                  <div key={v.id} style={styles.versionItem}>
                    <span style={styles.versionBadge}>v{v.versionName}</span>
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '14px' }}>{v.releaseNotes}</p>
                      <p style={{ fontSize: '12px', color: '#546e7a' }}>
                        {v.releaseDate ? new Date(v.releaseDate).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
 
            {/* Reviews */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>💬 Reviews ({reviews.length})</h2>
 
              {/* Add Review Form */}
              {user && (
                <form onSubmit={handleReviewSubmit} style={styles.reviewForm}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px' }}>Write a Review</h3>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    {[1,2,3,4,5].map(n => (
                      <button type="button" key={n}
                        onClick={() => setReviewForm({...reviewForm, rating: n})}
                        style={{
                          ...styles.starBtn,
                          color: reviewForm.rating >= n ? '#fb8c00' : '#ccc',
                        }}>★</button>
                    ))}
                    <span style={{ fontSize: '13px', color: '#546e7a', alignSelf: 'center' }}>
                      {reviewForm.rating}/5
                    </span>
                  </div>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    placeholder="Share your experience with this app..."
                    rows={3}
                    style={styles.textarea}
                  />
                  <button type="submit" style={styles.submitReviewBtn}>Post Review</button>
                </form>
              )}
 
              {reviews.length === 0 ? (
                <p style={styles.empty}>No reviews yet. Be the first!</p>
              ) : (
                reviews.map(r => (
                  <div key={r.id} style={styles.reviewItem}>
                    <div style={styles.reviewHeader}>
                      <div style={styles.reviewAvatar}>U{r.userId}</div>
                      <div>
                       {/* <div style={{ color: '#fb8c00', fontSize: '14px' }}>{stars(r.rating)}</div>*/}
                        {r.sentiment && (
                           <span style={{
                    background: r.sentiment === 'POSITIVE' ? '#e8f5e9' :
                    r.sentiment === 'NEGATIVE' ? '#fce4e4' : '#fff9c4',
                    color: r.sentiment === 'POSITIVE' ? '#2e7d32' :
                     r.sentiment === 'NEGATIVE' ? '#c62828' : '#f57f17',
                     padding: '2px 10px',
                     borderRadius: '10px',
                     fontSize: '11px',
                     fontWeight: '700',
                     marginLeft: 'auto'
                    }}>
                    {r.sentiment === 'POSITIVE' ? '😊 Positive' :
                     r.sentiment === 'NEGATIVE' ? '😞 Negative' : '😐 Neutral'}
                   </span>
                     )}
                        <div style={{ fontSize: '11px', color: '#546e7a' }}>
                          {r.reviewDate ? new Date(r.reviewDate).toLocaleDateString() : ''}
                        </div>
                      </div>
                      {user && user.role === 'ADMIN' && (
                        <button onClick={() => handleDeleteReview(r.id)} style={styles.deleteBtn}>🗑</button>
                      )}
                    </div>
                    <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
 
          {/* Right Column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📊 App Stats</h3>
              <div style={styles.statsList}>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Total Downloads</span>
                  <span style={styles.statValue}>{totalDownloads}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Average Rating</span>
                  <span style={styles.statValue}>{app.averageRating?.toFixed(1) || '—'}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Total Reviews</span>
                  <span style={styles.statValue}>{reviews.length}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Versions</span>
                  <span style={styles.statValue}>{versions.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
const styles = {
  page: { background: '#f0f2f5', minHeight: 'calc(100vh - 64px)', padding: '32px 0' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '0 20px' },
  loading: { textAlign: 'center', padding: '80px', fontSize: '18px', color: '#546e7a' },
  header: {
    background: '#fff', borderRadius: '20px', padding: '32px',
    display: 'flex', gap: '28px', marginBottom: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', alignItems: 'flex-start',
  },
  appIcon: {
    width: '70px', height: '70px', minWidth: '70px',
    background: 'linear-gradient(135deg, #e8eaf6, #e0f7fa)',
    borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  headerInfo: { flex: 1 },
  appName: { fontSize: '28px', fontWeight: '800', color: '#1a237e', marginBottom: '8px' },
  appDesc: { color: '#546e7a', fontSize: '15px', marginBottom: '16px', lineHeight: '1.5' },
  metaRow: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' },
  metaBadge: {
    background: '#e8eaf6', color: '#3949ab',
    padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: '600',
  },
  downloadBtn: {
    background: 'linear-gradient(135deg, #00bcd4, #0097a7)',
    color: '#fff', border: 'none', borderRadius: '10px',
    padding: '12px 28px', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
  },
  twoCol: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  card: {
    background: '#fff', borderRadius: '16px', padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '24px',
  },
  cardTitle: { fontSize: '18px', fontWeight: '800', color: '#1a237e', marginBottom: '16px' },
  empty: { color: '#546e7a', fontSize: '14px', textAlign: 'center', padding: '20px 0' },
  versionItem: {
    display: 'flex', gap: '14px', alignItems: 'flex-start',
    padding: '12px 0', borderBottom: '1px solid #f0f0f0',
  },
  versionBadge: {
    background: '#1a237e', color: '#fff',
    padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap',
  },
  reviewForm: {
    background: '#f8f9ff', borderRadius: '12px', padding: '20px',
    marginBottom: '20px', border: '2px solid #e8eaf6',
  },
  starBtn: {
    background: 'none', border: 'none',
    fontSize: '24px', cursor: 'pointer', padding: '0',
  },
  textarea: {
    width: '100%', border: '2px solid #e0e0e0', borderRadius: '10px',
    padding: '12px', fontSize: '14px', resize: 'vertical', marginBottom: '12px',
    color: '#1a1a2e', boxSizing: 'border-box',
  },
  submitReviewBtn: {
    background: '#1a237e', color: '#fff',
    border: 'none', borderRadius: '8px',
    padding: '10px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
  },
  reviewItem: {
    padding: '16px 0', borderBottom: '1px solid #f0f0f0',
  },
  reviewHeader: {
    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px',
  },
  reviewAvatar: {
    width: '36px', height: '36px', background: '#1a237e', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: '11px', fontWeight: '700',
  },
  deleteBtn: {
    background: 'none', border: 'none', fontSize: '16px',
    cursor: 'pointer', marginLeft: 'auto', color: '#e53935',
  },
  statsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  statItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' },
  statLabel: { fontSize: '13px', color: '#546e7a' },
  statValue: { fontSize: '18px', fontWeight: '800', color: '#1a237e' },
};
 