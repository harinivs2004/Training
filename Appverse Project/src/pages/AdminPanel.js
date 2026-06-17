import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAllUsers, deleteUser, getAllApps, deleteApp,
  getAllCategories, createCategory, deleteCategory,
  getAllDownloads, getAllReviews, deleteReview
} from '../services/api';
 
export default function AdminPanel() {
  const [tab, setTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [apps, setApps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [catForm, setCatForm] = useState({ name: '', description: '' });
 
  useEffect(() => { loadAll(); }, []);
 
  const loadAll = async () => {
    try {
      const [u, a, c, d, r] = await Promise.all([
        getAllUsers(), getAllApps(), getAllCategories(), getAllDownloads(), getAllReviews()
      ]);
      setUsers(u.data); setApps(a.data); setCategories(c.data);
      setDownloads(d.data); setReviews(r.data);
    } catch (err) { toast.error('Failed to load data'); }
  };
 
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await deleteUser(id); toast.success('User deleted'); loadAll(); }
    catch { toast.error('Cannot delete user with existing data'); }
  };
 
  const handleDeleteApp = async (id) => {
    if (!window.confirm('Delete this app?')) return;
    try { await deleteApp(id); toast.success('App deleted'); loadAll(); }
    catch { toast.error('Failed to delete app'); }
  };
 
  const handleDeleteReview = async (id) => {
    try { await deleteReview(id); toast.success('Review deleted'); loadAll(); }
    catch { toast.error('Failed to delete review'); }
  };
 
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catForm.name) { toast.error('Category name required'); return; }
    try {
      await createCategory(catForm);
      toast.success('Category created!');
      setCatForm({ name: '', description: '' });
      loadAll();
    } catch { toast.error('Failed to create category'); }
  };
 
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await deleteCategory(id); toast.success('Category deleted'); loadAll(); }
    catch { toast.error('Cannot delete category with existing apps'); }
  };
 
  const overviewCards = [
    { icon: '👥', label: 'Total Users', value: users.length, color: '#1a237e' },
    { icon: '📱', label: 'Total Apps', value: apps.length, color: '#00897b' },
    { icon: '📂', label: 'Categories', value: categories.length, color: '#6a1b9a' },
    { icon: '⬇', label: 'Downloads', value: downloads.length, color: '#e65100' },
    { icon: '💬', label: 'Reviews', value: reviews.length, color: '#c62828' },
  ];
 
  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'users', label: '👥 Users' },
    { id: 'apps', label: '📱 Apps' },
    { id: 'categories', label: '📂 Categories' },
    { id: 'reviews', label: '💬 Reviews' },
  ];
 
  const roleBg = { USER: '#e8eaf6', DEVELOPER: '#e0f7fa', ADMIN: '#fce4ec' };
  const roleColor = { USER: '#3949ab', DEVELOPER: '#00897b', ADMIN: '#c62828' };
 
  return (
    <div style={{ background: '#f0f2f5', minHeight: 'calc(100vh - 64px)', padding: '32px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a237e', marginBottom: '8px' }}>
          ⚙️ Admin Panel
        </h1>
        <p style={{ color: '#546e7a', marginBottom: '28px' }}>Manage the entire AppVerse platform</p>
 
        <div style={styles.tabs}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ ...styles.tab, ...(tab === t.id ? styles.tabActive : {}) }}>
              {t.label}
            </button>
          ))}
        </div>
 
        {/* Overview */}
        {tab === 'overview' && (
          <div style={styles.grid}>
            {overviewCards.map((c, i) => (
              <div key={i} style={styles.statCard}>
                <div style={{ ...styles.icon, background: c.color }}>{c.icon}</div>
                <div style={styles.statNum}>{c.value}</div>
                <div style={styles.statLabel}>{c.label}</div>
              </div>
            ))}
          </div>
        )}
 
        {/* Users */}
        {tab === 'users' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>👥 All Users ({users.length})</h2>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={styles.tr}>
                    <td style={styles.td}>#{u.id}</td>
                    <td style={styles.td}><b>{u.name}</b></td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>
                      <span style={{ background: roleBg[u.role], color: roleColor[u.role], padding: '2px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '700' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => handleDeleteUser(u.id)} style={styles.delBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
 
        {/* Apps */}
        {tab === 'apps' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📱 All Apps ({apps.length})</h2>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Developer ID</th>
                  <th style={styles.th}>Category ID</th>
                  <th style={styles.th}>Downloads</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(a => (
                  <tr key={a.id} style={styles.tr}>
                    <td style={styles.td}>#{a.id}</td>
                    <td style={styles.td}><b>{a.name}</b></td>
                    <td style={styles.td}>{a.developerId}</td>
                    <td style={styles.td}>{a.categoryId}</td>
                    <td style={styles.td}>{a.totalDownloads || 0}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleDeleteApp(a.id)} style={styles.delBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
 
        {/* Categories */}
        {tab === 'categories' && (
          <div style={styles.twoCol}>
            <div style={{ ...styles.card, flex: 1 }}>
              <h2 style={styles.cardTitle}>➕ Add Category</h2>
              <form onSubmit={handleCreateCategory} style={styles.form}>
                <div style={styles.field}>
                  <label style={styles.label}>Category Name *</label>
                  <input value={catForm.name}
                    onChange={e => setCatForm({ ...catForm, name: e.target.value })}
                    placeholder="Games, Education, etc." style={styles.input} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Description</label>
                  <input value={catForm.description}
                    onChange={e => setCatForm({ ...catForm, description: e.target.value })}
                    placeholder="Brief description" style={styles.input} />
                </div>
                <button type="submit" style={styles.btn}>Create Category</button>
              </form>
            </div>
            <div style={{ ...styles.card, flex: 2 }}>
              <h2 style={styles.cardTitle}>📂 All Categories ({categories.length})</h2>
              {categories.map(c => (
                <div key={c.id} style={styles.listItem}>
                  <div>
                    <div style={{ fontWeight: '700' }}>{c.name}</div>
                    <div style={{ fontSize: '12px', color: '#546e7a' }}>{c.description}</div>
                  </div>
                  <button onClick={() => handleDeleteCategory(c.id)} style={styles.delBtn}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
 
        {/* Reviews */}
        {tab === 'reviews' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>💬 All Reviews ({reviews.length})</h2>
            {reviews.map(r => (
              <div key={r.id} style={styles.reviewItem}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ color: '#fb8c00' }}>{'★'.repeat(r.rating)}</span>
                    <span style={{ fontSize: '12px', color: '#546e7a' }}>User #{r.userId} → App #{r.appId}</span>
                  </div>
                  <p style={{ fontSize: '14px' }}>{r.comment}</p>
                </div>
                <button onClick={() => handleDeleteReview(r.id)} style={styles.delBtn}>🗑</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
 
const styles = {
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  tab: {
    padding: '10px 20px', borderRadius: '10px', border: '2px solid #e0e0e0',
    background: '#fff', color: '#546e7a', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
  },
  tabActive: { background: '#1a237e', color: '#fff', border: '2px solid #1a237e' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', marginBottom: '28px' },
  statCard: {
    background: '#fff', borderRadius: '16px', padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', textAlign: 'center',
  },
  icon: {
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
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8f9ff' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#546e7a', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e8eaf6' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#374151' },
  delBtn: {
    background: '#fce4e4', color: '#c62828', border: 'none',
    borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
  },
  twoCol: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '700', color: '#546e7a', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: {
    border: '2px solid #e0e0e0', borderRadius: '10px',
    padding: '11px 14px', fontSize: '14px', color: '#1a1a2e',
  },
  btn: {
    background: '#1a237e', color: '#fff', border: 'none',
    borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
  },
  listItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 0', borderBottom: '1px solid #f0f0f0',
  },
  reviewItem: {
    display: 'flex', alignItems: 'flex-start', gap: '16px',
    padding: '14px 0', borderBottom: '1px solid #f0f0f0',
  },
};
 