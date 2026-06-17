import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllApps, getAllCategories, getAppsByCategory, searchApps, getTrendingApps } from '../services/api';
import { useAuth } from '../context/AuthContext';
 
export default function Home() {
  const [apps, setApps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trending, setTrending] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
 
  useEffect(() => {
    fetchData();
  }, []);
 
  const fetchData = async () => {
    try {
      const [appsRes, catsRes, trendRes] = await Promise.all([getAllApps(), getAllCategories(), getTrendingApps(),]);
      setApps(appsRes.data);
      setCategories(catsRes.data);
      setTrending(trendRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearch(val);
    setSelectedCat(null);
    if (val.trim() === '') {
      fetchData();
      return;
    }
    try {
      const res = await searchApps(val);
      setApps(res.data);
    } catch (err) { console.error(err); }
  };
 
  const handleCategoryFilter = async (catId) => {
    setSearch('');
    if (selectedCat === catId) {
      setSelectedCat(null);
      fetchData();
      return;
    }
    setSelectedCat(catId);
    try {         
      const res = await getAppsByCategory(catId);
      setApps(res.data);
    } catch (err) { console.error(err); }
  };
 
  const stars = (rating) => {
    if (!rating) return '☆☆☆☆☆';
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  };
 
  return (
    <div style={{ background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Discover Amazing Apps</h1>
        <p style={styles.heroSub}>Explore, review and download the best applications on AppVerse AI</p>
 
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Search apps by name..."
            style={styles.searchInput}
          />
        </div>
 
        <div style={styles.heroStats}>
          <div style={styles.stat}><span style={styles.statNum}>{apps.length}+</span><span style={styles.statLabel}>Apps</span></div>
          <div style={styles.statDivider} />
          <div style={styles.stat}><span style={styles.statNum}>{categories.length}+</span><span style={styles.statLabel}>Categories</span></div>
          <div style={styles.statDivider} />
          <div style={styles.stat}><span style={styles.statNum}>Free</span><span style={styles.statLabel}>Always</span></div>
        </div>
      </div>
 
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

        {trending.length > 0 && (
    <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🔥 Trending Apps</h2>
        <div style={styles.trendingRow}>
            {trending.map((app, index) => (
                <div key={app.id} style={styles.trendCard}
                    onClick={() => navigate(`/apps/${app.id}`)}>
                    <span style={styles.trendRank}>#{index + 1}</span>
                    <div style={styles.trendIcon}>📱</div>
                    <div style={styles.trendName}>{app.name}</div>
                    <div style={styles.trendDownloads}>⬇ {app.totalDownloads || 0}</div>
                </div>
            ))}
        </div>
    </div>
)}
        {/* Category Filters */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Browse by Category</h2>
          <div style={styles.catChips}>
            <button
              onClick={() => { setSelectedCat(null); setSearch(''); fetchData(); }}
              style={{ ...styles.chip, ...(selectedCat === null ? styles.chipActive : {}) }}
            >All Apps</button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryFilter(cat.id)}
                style={{ ...styles.chip, ...(selectedCat === cat.id ? styles.chipActive : {}) }}
              >{cat.name}</button>
            ))}
          </div>
        </div>
 
        {/* Apps Grid */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {search ? `Results for "${search}"` : selectedCat ? 'Filtered Apps' : 'All Apps'}
         { /*  <span style={styles.count}> {apps.length} apps</span>*/}
          </h2>
 
          {loading ? (
            <div style={styles.loading}>Loading apps...</div>
          ) : apps.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '48px' }}>📭</div>
              <p>No apps found</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {apps.map(app => (
                <div key={app.id} style={styles.appCard}
                  onClick={() => navigate(`/apps/${app.id}`)}>
                  <div style={styles.appIcon}>
                    {app.iconUrl ? (
                      <img src={app.iconUrl} alt={app.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
                        onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <span style={{ fontSize: '36px' }}>📱</span>
                    )}
                  </div>
                  <h3 style={styles.appName}>{app.name}</h3>
                  <p style={styles.appDesc}>
                    {app.description ? app.description.substring(0, 60) + '...' : 'No description'}
                  </p>
                  <div style={styles.appMeta}>
                    <span style={styles.stars}>{stars(app.averageRating)}</span>
                    <span style={styles.downloads}>⬇ {app.totalDownloads || 0}</span>
                  </div>
                  <button style={styles.viewBtn}>View Details →</button>
                </div>
              ))}
            </div>
          )}
        </div>
 
        {/* CTA for non-logged in users */}
        {!user && (
          <div style={styles.ctaBox}>
            <h2 style={styles.ctaTitle}>Ready to get started?</h2>
            <p style={styles.ctaSub}>Create a free account to download apps, write reviews, and get personalized recommendations</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link to="/register" style={styles.ctaBtn}>Get Started Free</Link>
              <Link to="/login" style={styles.ctaBtnOutline}>Sign In</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
 
const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #006064 100%)',
    padding: '80px 20px 60px',
    textAlign: 'center',
    color: '#fff',
  },
  heroTitle: { fontSize: '48px', fontWeight: '900', marginBottom: '16px', letterSpacing: '-1px' },
  heroSub: { fontSize: '18px', opacity: 0.85, marginBottom: '36px' },
  searchBox: {
    maxWidth: '560px',
    margin: '0 auto 36px',
    background: '#fff',
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    padding: '6px 20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  searchIcon: { fontSize: '20px', marginRight: '12px' },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    padding: '10px 0',
    color: '#1a1a2e',
    background: 'transparent',
  },
  heroStats: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { fontSize: '28px', fontWeight: '800' },
  statLabel: { fontSize: '12px', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '1px' },
  statDivider: { width: '1px', height: '40px', background: 'rgba(255,255,255,0.3)' },
  section: { marginBottom: '48px' },
  sectionTitle: { fontSize: '22px', fontWeight: '800', color: '#1a237e', marginBottom: '16px' },
  count: { fontSize: '14px', fontWeight: '400', color: '#546e7a' },
  catChips: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  chip: {
    padding: '8px 20px',
    borderRadius: '20px',
    border: '2px solid #e0e0e0',
    background: '#fff',
    color: '#546e7a',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  chipActive: {
    background: '#1a237e',
    color: '#fff',
    border: '2px solid #1a237e',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
  appCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  appIcon: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #e8eaf6, #e0f7fa)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  appName: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e' },
  appDesc: { fontSize: '13px', color: '#546e7a', lineHeight: '1.4', flex: 1 },
  appMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  stars: { color: '#fb8c00', fontSize: '13px' },
  downloads: { fontSize: '12px', color: '#546e7a' },
  viewBtn: {
    background: 'linear-gradient(135deg, #1a237e, #3949ab)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
  },
  loading: { textAlign: 'center', padding: '60px', color: '#546e7a', fontSize: '18px' },
  empty: { textAlign: 'center', padding: '60px', color: '#546e7a', fontSize: '18px' },
  ctaBox: {
    background: 'linear-gradient(135deg, #1a237e, #006064)',
    borderRadius: '20px',
    padding: '60px 40px',
    textAlign: 'center',
    color: '#fff',
  },
  ctaTitle: { fontSize: '32px', fontWeight: '800', marginBottom: '12px' },
  ctaSub: { fontSize: '16px', opacity: 0.85, marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' },
  ctaBtn: {
    background: '#00bcd4',
    color: '#fff',
    padding: '14px 32px',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '16px',
    textDecoration: 'none',
  },
  ctaBtnOutline: {
    background: 'transparent',
    color: '#fff',
    padding: '14px 32px',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '16px',
    textDecoration: 'none',
    border: '2px solid rgba(255,255,255,0.5)',
  },
  trendingRow: { display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' },
trendCard: {
    background: '#fff', borderRadius: '14px', padding: '16px',
    minWidth: '150px', textAlign: 'center', cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'relative',
},
trendRank: {
    position: 'absolute', top: '8px', right: '8px',
    background: '#1a237e', color: '#fff',
    borderRadius: '50%', width: '24px', height: '24px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', fontWeight: '800',
},
trendIcon: { fontSize: '36px', marginBottom: '8px' },
trendName: { fontSize: '13px', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' },
trendDownloads: { fontSize: '11px', color: '#546e7a' },
};