import React, { useEffect, useState } from 'react';
import { getDownloadAnalytics, getAllApps, getAllDownloads } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
 
export default function Analytics() {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
 
    useEffect(() => {
        Promise.all([getDownloadAnalytics(), getAllApps()])
            .then(([analyticsRes, appsRes]) => {
                setAnalytics(analyticsRes.data);
                setApps(appsRes.data);
            })
            .finally(() => setLoading(false));
    }, []);
     if (
    user &&
    user.role !== "ADMIN" &&
    user.role !== "DEVELOPER"
) {
    return (
        <div style={{ padding: "30px", textAlign: "center" }}>
            <h2>Access Denied</h2>
            <p>Only Admin and Developer can view Analytics.</p>
        </div>
    );
}
    const getAppName = (appId) => {
        const app = apps.find(a => a.id === Number(appId));
        return app ? app.name : `App #${appId}`;
    };
 
    if (loading) return <div style={styles.loading}>Loading analytics...</div>;
 
    const downloadsPerApp = analytics?.downloadsPerApp || {};
    const sortedApps = Object.entries(downloadsPerApp)
        .sort(([,a],[,b]) => b - a);
 
    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.title}>📊 Download Analytics</h1>
                <p style={styles.sub}>Real-time download insights for your apps</p>
 
                {/* Summary Cards */}
                <div style={styles.cardGrid}>
                    {[
                        { icon: '⬇', label: 'Total Downloads', value: analytics?.totalDownloads || 0, color: '#1a237e' },
                        { icon: '📱', label: 'Apps Downloaded', value: analytics?.uniqueApps || 0, color: '#00897b' },
                        { icon: '🏆', label: 'Top App', value: getAppName(analytics?.topAppId), color: '#e65100' },
                    ].map((card, i) => (
                        <div key={i} style={styles.statCard}>
                            <div style={{ ...styles.icon, background: card.color }}>{card.icon}</div>
                            <div style={styles.statValue}>{card.value}</div>
                            <div style={styles.statLabel}>{card.label}</div>
                        </div>
                    ))}
                </div>
 
                {/* Downloads Per App */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>🏆 Most Downloaded Apps</h2>
                    {sortedApps.length === 0 ? (
                        <p style={styles.empty}>No downloads yet</p>
                    ) : (
                        sortedApps.map(([appId, count], index) => {
                            const maxCount = sortedApps[0][1];
                            const percentage = Math.round((count / maxCount) * 100);
                            return (
                                <div key={appId} style={styles.appRow}>
                                    <span style={styles.rank}>#{index + 1}</span>
                                    <div style={styles.appInfo}>
                                        <div style={styles.appName}
                                            onClick={() => navigate(`/apps/${appId}`)}>
                                            {getAppName(appId)}
                                        </div>
                                        <div style={styles.barContainer}>
                                            <div style={{
                                                ...styles.bar,
                                                width: `${percentage}%`,
                                                background: index === 0 ? '#fb8c00' :
                                                           index === 1 ? '#1a237e' : '#00897b'
                                            }} />
                                        </div>
                                    </div>
                                    <span style={styles.downloadCount}>{count} downloads</span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
 
const styles = {
    page: { background: '#f0f2f5', minHeight: 'calc(100vh - 64px)', padding: '32px 0' },
    container: { maxWidth: '900px', margin: '0 auto', padding: '0 20px' },
    title: { fontSize: '28px', fontWeight: '800', color: '#1a237e', marginBottom: '8px' },
    sub: { color: '#546e7a', marginBottom: '28px' },
    loading: { textAlign: 'center', padding: '60px', color: '#546e7a' },
    cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' },
    statCard: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', textAlign: 'center' },
    icon: { width: '52px', height: '52px', borderRadius: '14px', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#fff' },
    statValue: { fontSize: '24px', fontWeight: '900', color: '#1a1a2e', lineHeight: 1, marginBottom: '6px' },
    statLabel: { fontSize: '13px', color: '#546e7a' },
    card: { background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '24px' },
    cardTitle: { fontSize: '18px', fontWeight: '800', color: '#1a237e', marginBottom: '20px' },
    appRow: { display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
    rank: { fontSize: '18px', fontWeight: '800', color: '#1a237e', minWidth: '32px' },
    appInfo: { flex: 1 },
    appName: { fontSize: '15px', fontWeight: '700', color: '#1a237e', cursor: 'pointer', marginBottom: '6px' },
    barContainer: { height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' },
    bar: { height: '100%', borderRadius: '4px', transition: 'width 0.5s ease' },
    downloadCount: { fontSize: '14px', fontWeight: '700', color: '#546e7a', whiteSpace: 'nowrap' },
    empty: { color: '#546e7a', textAlign: 'center', padding: '20px' },
};