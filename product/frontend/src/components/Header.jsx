import React from 'react';

const Header = ({ currentPage }) => {
  const getPageTitle = () => {
    switch(currentPage) {
      case 'add': return 'Add Product';
      case 'view': return 'View Products';
      case 'about': return 'About Project';
      default: return 'Product Inventory';
    }
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <h2 className="page-title-header">{getPageTitle()}</h2>
      </div>
      <div className="header-right">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8">
          <rect x="3" y="7" width="18" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
        <span className="system-title">Product Inventory System</span>
      </div>
    </header>
  );
};

export default Header;