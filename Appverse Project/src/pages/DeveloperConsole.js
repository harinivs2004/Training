import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import {
  getAllApps, createApp, updateApp, deleteApp,
  getAllCategories, createVersion, getVersionsByApp,
  createProfile, getProfileByUser, updateProfile, getAllVersions
} from '../services/api';
 
export default function DeveloperConsole() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('apps');
  const [appForm, setAppForm] = useState({ name: '', description: '', iconUrl: '', categoryId: '' });
  const [versionForm, setVersionForm] = useState({ versionName: '', releaseNotes: '', appId: '' });
  const [profileForm, setProfileForm] = useState({ companyName: '', website: '', bio: '' });
  const [editingApp, setEditingApp] = useState(null);
  const [profileId, setProfileId] = useState(null);
 
  useEffect(() => {
    loadData();
  }, [user]);
 
  const loadData = async () => {
    try {
      const [appsRes, catsRes] = await Promise.all([getAllApps(), getAllCategories()]);
      const myApps = appsRes.data.filter(a => a.developerId === user.id);
      setApps(myApps);
      setCategories(catsRes.data);
      try {
        const pRes = await getProfileByUser(user.id);
        setProfile(pRes.data);
        setProfileId(pRes.data.id);
        setProfileForm({ companyName: pRes.data.companyName, website: pRes.data.website, bio: pRes.data.bio });
      } catch { setProfile(null); }
    } catch (err) { toast.error('Failed to load data'); }
  };
 
  const handleCreateApp = async (e) => {
    e.preventDefault();
    if (!appForm.name || !appForm.categoryId) { toast.error('Name and category required'); return; }
    try {
      if (editingApp) {
        await updateApp(editingApp, { ...appForm, developerId: user.id, categoryId: Number(appForm.categoryId) });
        toast.success('App updated!');
        setEditingApp(null);
      } else {
        await createApp({ ...appForm, developerId: user.id, categoryId: Number(appForm.categoryId) });
        toast.success('App created! 🎉');
      }
      setAppForm({ name: '', description: '', iconUrl: '', categoryId: '' });
      loadData();
    } catch (err) { toast.error('Failed to save app'); }
  };
 
  const handleDeleteApp = async (id) => {
    if (!window.confirm('Delete this app?')) return;
    try { await deleteApp(id); toast.success('App deleted'); loadData(); }
    catch { toast.error('Failed to delete app'); }
  };
 
  const handleEditApp = (app) => {
    setEditingApp(app.id);
    setAppForm({ name: app.name, description: app.description || '', iconUrl: app.iconUrl || '', categoryId: app.categoryId });
    setActiveTab('apps');
  };
 
  const handleAddVersion = async (e) => {
    e.preventDefault();
    if (!versionForm.versionName || !versionForm.appId) { toast.error('Version name and app required'); return; }
    try {
      await createVersion({ ...versionForm, appId: Number(versionForm.appId) });
      toast.success('Version added!');
      setVersionForm({ versionName: '', releaseNotes: '', appId: '' });
    } catch { toast.error('Failed to add version'); }
  };
 
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      if (profileId) {
        await updateProfile(profileId, { ...profileForm, userId: user.id });
        toast.success('Profile updated!');
      } else {
        await createProfile({ ...profileForm, userId: user.id });
        toast.success('Profile created!');
      }
      loadData();
    } catch { toast.error('Failed to save profile'); }
  };
 
  const tabs = [
    { id: 'apps', label: '📱 My Apps' },
    { id: 'versions', label: '📦 Add Version' },
    { id: 'profile', label: '👤 Dev Profile' },
  ];
 
  return (
    <div style={{ background: '#f0f2f5', minHeight: 'calc(100vh - 64px)', padding: '32px 0' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a237e', marginBottom: '8px' }}>
          🛠 Developer Console
        </h1>
        <p style={{ color: '#546e7a', marginBottom: '28px' }}>Manage your apps, versions and developer profile</p>
 
        {/* Tabs */}
        <div style={styles.tabs}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ ...styles.tab, ...(activeTab === t.id ? styles.tabActive : {}) }}>
              {t.label}
            </button>
          ))}
        </div>
 
        {/* Apps Tab */}
        {activeTab === 'apps' && (
          <div style={styles.twoCol}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>{editingApp ? '✏️ Edit App' : '➕ Create New App'}</h2>
              <form onSubmit={handleCreateApp} style={styles.form}>
                {[
                  { label: 'App Name *', name: 'name', placeholder: 'My Amazing App' },
                  { label: 'Description', name: 'description', placeholder: 'What does your app do?' },
                  { label: 'Icon URL', name: 'iconUrl', placeholder: 'https://...' },
                ].map(f => (
                  <div key={f.name} style={styles.field}>
                    <label style={styles.label}>{f.label}</label>
                    <input
                      name={f.name}
                      value={appForm[f.name]}
                      onChange={e => setAppForm({ ...appForm, [e.target.name]: e.target.value })}
                      placeholder={f.placeholder}
                      style={styles.input}
                    />
                  </div>
                ))}
                <div style={styles.field}>
                  <label style={styles.label}>Category *</label>
                  <select value={appForm.categoryId}
                    onChange={e => setAppForm({ ...appForm, categoryId: e.target.value })}
                    style={styles.input}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={styles.btn}>
                    {editingApp ? 'Update App' : 'Create App'}
                  </button>
                  {editingApp && (
                    <button type="button" style={styles.cancelBtn}
                      onClick={() => { setEditingApp(null); setAppForm({ name: '', description: '', iconUrl: '', categoryId: '' }); }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
 
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>📱 My Apps ({apps.length})</h2>
              {apps.length === 0 ? (
                <p style={styles.empty}>No apps yet. Create your first app!</p>
              ) : (
                apps.map(app => (
                  <div key={app.id} style={styles.appItem}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '15px' }}>{app.name}</div>
                      <div style={{ fontSize: '12px', color: '#546e7a' }}>{app.description?.substring(0, 60)}</div>
                      <div style={{ fontSize: '11px', color: '#9e9e9e', marginTop: '4px' }}>
                        ⬇ {app.totalDownloads || 0} downloads · ⭐ {app.averageRating || 0}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEditApp(app)} style={styles.editBtn}>✏️</button>
                      <button onClick={() => handleDeleteApp(app.id)} style={styles.delBtn}>🗑</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
 
        {/* Versions Tab */}
        {activeTab === 'versions' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📦 Add New Version</h2>
            <form onSubmit={handleAddVersion} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Select App *</label>
                <select value={versionForm.appId}
                  onChange={e => setVersionForm({ ...versionForm, appId: e.target.value })}
                  style={styles.input}>
                  <option value="">Select App</option>
                  {apps.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Version Name *</label>
                <input value={versionForm.versionName}
                  onChange={e => setVersionForm({ ...versionForm, versionName: e.target.value })}
                  placeholder="e.g. 2.0.0" style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Release Notes</label>
                <textarea value={versionForm.releaseNotes}
                  onChange={e => setVersionForm({ ...versionForm, releaseNotes: e.target.value })}
                  placeholder="What's new in this version?"
                  rows={4} style={{ ...styles.input, resize: 'vertical' }} />
              </div>
              <button type="submit" style={styles.btn}>Add Version</button>
            </form>
          </div>
        )}
 
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>👤 Developer Profile</h2>
            <form onSubmit={handleSaveProfile} style={styles.form}>
              {[
                { label: 'Company Name *', name: 'companyName', placeholder: 'Tech Corp' },
                { label: 'Website', name: 'website', placeholder: 'https://yoursite.com' },
                { label: 'Bio', name: 'bio', placeholder: 'Tell users about you...' },
              ].map(f => (
                <div key={f.name} style={styles.field}>
                  <label style={styles.label}>{f.label}</label>
                  <input name={f.name} value={profileForm[f.name]}
                    onChange={e => setProfileForm({ ...profileForm, [e.target.name]: e.target.value })}
                    placeholder={f.placeholder} style={styles.input} />
                </div>
              ))}
              <button type="submit" style={styles.btn}>
                {profile ? 'Update Profile' : 'Create Profile'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
 
const styles = {
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  tab: {
    padding: '10px 24px', borderRadius: '10px', border: '2px solid #e0e0e0',
    background: '#fff', color: '#546e7a', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  },
  tabActive: { background: '#1a237e', color: '#fff', border: '2px solid #1a237e' },
  twoCol: { display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' },
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
  cancelBtn: {
    background: '#f0f0f0', color: '#546e7a', border: 'none',
    borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  },
  appItem: {
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '14px 0', borderBottom: '1px solid #f0f0f0',
  },
  editBtn: {
    background: '#e8eaf6', border: 'none', borderRadius: '8px',
    padding: '7px 12px', cursor: 'pointer', fontSize: '14px',
  },
  delBtn: {
    background: '#fce4e4', border: 'none', borderRadius: '8px',
    padding: '7px 12px', cursor: 'pointer', fontSize: '14px',
  },
  empty: { color: '#546e7a', fontSize: '14px', textAlign: 'center', padding: '30px 0' },
};
 