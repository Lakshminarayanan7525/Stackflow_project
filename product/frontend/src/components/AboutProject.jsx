import React from 'react';

const AboutProject = () => {
  return (
    <div className="page-container">
      <div className="about-card">
        <div className="about-header">
          <h2>About This Project</h2>
          <p>Learn more about the Product Inventory System</p>
        </div>

        <div className="about-content">
          <div className="about-text">
            <p>
              <strong>Product Inventory System</strong> is a full-stack web application built to manage products efficiently with a modern, beautiful interface.
            </p>
            
            <p>It allows users to seamlessly:</p>
            
            <ul style={{ listStyleType: 'none', paddingLeft: 0, marginBottom: '24px' }}>
              {['Add new products', 'View all products', 'Update existing products', 'Delete products'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: '#475569' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            
            <div style={{ marginTop: '32px' }}>
              <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Tech Stack</p>
              <div className="tech-stack">
                <span className="tech-pill">☕ Java</span>
                <span className="tech-pill">🍃 Spring Boot</span>
                <span className="tech-pill">🐬 MySQL</span>
                <span className="tech-pill">⚛️ React</span>
              </div>
            </div>
          </div>

          <div className="about-visual">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <h4>Modern Workspace</h4>
            <p>Built for productivity.</p>
          </div>
        </div>

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
          <p>Developed with ❤️ by <span style={{ fontWeight: 600, color: '#4f46e5' }}>Lakshmi Narayanan S A</span></p>
        </div>
      </div>
    </div>
  );
};

export default AboutProject;