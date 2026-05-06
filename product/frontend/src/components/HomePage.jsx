import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const HomePage = ({ onStartManaging, products = [] }) => {
  // Compute Stats
  const totalProducts = products.length;
  const totalValue = products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const lowStock = products.filter(p => p.quantity < 10).length;

  // Compute Chart Data (Count by Category)
  const categoryData = useMemo(() => {
    const counts = {};
    products.forEach(p => {
      const cat = p.category || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({
      name: key,
      count: counts[key]
    })).sort((a, b) => b.count - a.count);
  }, [products]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  return (
    <div className="page-container">
      {/* Hero Banner Section */}
      <div className="hero-banner" style={{ padding: '32px 24px', marginBottom: '24px' }}>
        <div className="hero-content">
          <h1 className="hero-heading">Dashboard Overview</h1>
          <p className="hero-subtitle">
            Get a quick glance at your inventory health and essential statistics.
          </p>
          <button className="hero-button" onClick={onStartManaging}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Product
          </button>
        </div>
      </div>

      {/* Analytics Stats Cards */}
      <div className="features-grid-home" style={{ marginBottom: '24px' }}>
        <div className="feature-card-home" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="feature-icon-wrapper" style={{ margin: 0, width: '48px', height: '48px', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Total Products</p>
              <h3 style={{ fontSize: '24px', color: 'var(--text-primary)', margin: 0 }}>{totalProducts}</h3>
            </div>
          </div>
        </div>

        <div className="feature-card-home" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="feature-icon-wrapper" style={{ margin: 0, width: '48px', height: '48px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Total Value</p>
              <h3 style={{ fontSize: '24px', color: 'var(--text-primary)', margin: 0 }}>₹{totalValue.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="feature-card-home" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="feature-icon-wrapper" style={{ margin: 0, width: '48px', height: '48px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Low Stock</p>
              <h3 style={{ fontSize: '24px', color: 'var(--text-primary)', margin: 0 }}>{lowStock}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="form-card" style={{ maxWidth: '100%', padding: '24px' }}>
        <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '24px' }}>Products by Category</h3>
        {categoryData.length > 0 ? (
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-dark)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--bg-primary)' }}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-dark)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <p>No products available to display chart.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;