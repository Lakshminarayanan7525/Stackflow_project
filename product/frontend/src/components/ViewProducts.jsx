import React, { useState, useMemo, useEffect } from 'react';

const ViewProducts = ({ products, onDelete, onEdit, onRefresh, onBulkDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('id-asc');
  
  // NEW STATES
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Adjust items per page

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [searchTerm, categoryFilter, sortBy, products]);

  // Categories for dropdown
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Filter & Sort Logic
  const displayedProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerTerm) || 
        p.id.toString().includes(lowerTerm)
      );
    }

    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'quantity-asc': return a.quantity - b.quantity;
        case 'quantity-desc': return b.quantity - a.quantity;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'id-desc': return b.id - a.id;
        case 'id-asc':
        default: return a.id - b.id;
      }
    });

    return result;
  }, [products, searchTerm, categoryFilter, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(displayedProducts.length / itemsPerPage) || 1;
  const currentProducts = displayedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Bulk Selection Logic
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(currentProducts.map(p => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const handleExecuteBulkDelete = () => {
    onBulkDelete(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  // CSV Export Logic
  const handleExportCSV = () => {
    const headers = ['ID', 'Product Name', 'Price', 'Quantity', 'Category'];
    const csvRows = [headers.join(',')];
    
    displayedProducts.forEach(p => {
      // Escape commas in strings by wrapping in quotes
      const row = [p.id, `"${p.name}"`, p.price, p.quantity, `"${p.category}"`];
      csvRows.push(row.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'inventory_export.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Avatar Color Generator
  const getAvatarColor = (category = '') => {
    const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#3b82f6'];
    let hash = 0;
    for (let i = 0; i < category.length; i++) hash = category.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <div>
          <h2 className="page-title">Inventory Overview</h2>
          <p className="page-subtitle">Manage, export, and track your products.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="refresh-btn" onClick={handleExportCSV}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export CSV
          </button>
          <button className="refresh-btn" onClick={onRefresh}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '20px', 
        background: 'var(--bg-secondary)', 
        padding: '16px', 
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-dark)',
        boxShadow: 'var(--shadow-sm)',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
          {/* Search */}
          <div style={{ flex: '1', position: 'relative' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-secondary)' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="modern-input"
              style={{ paddingLeft: '36px', width: '100%' }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ width: '160px' }}>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="modern-input"
              style={{ width: '100%', cursor: 'pointer' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div style={{ width: '160px' }}>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="modern-input"
              style={{ width: '100%', cursor: 'pointer' }}
            >
              <option value="id-asc">Sort ID (Asc)</option>
              <option value="id-desc">Sort ID (Desc)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low)</option>
              <option value="price-desc">Price (High)</option>
            </select>
          </div>
        </div>

        {/* BULK ACTIONS */}
        {selectedIds.size > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px', borderLeft: '1px solid var(--border-dark)' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {selectedIds.size} selected
            </span>
            <button 
              onClick={handleExecuteBulkDelete}
              style={{
                background: 'var(--danger)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {displayedProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <h3>No products found</h3>
          <p>{products.length === 0 ? 'Your inventory is currently empty.' : 'No products match your search or filter.'}</p>
        </div>
      ) : (
        <div className="table-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowX: 'auto' }}>
            <table className="products-table">
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={currentProducts.length > 0 && selectedIds.size === currentProducts.length}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map(product => (
                  <tr key={product.id} style={{ background: selectedIds.has(product.id) ? 'rgba(99, 102, 241, 0.05)' : 'transparent' }}>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(product.id)}
                        onChange={() => handleSelectOne(product.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td className="id-cell">#{product.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '32px', height: '32px', borderRadius: '50%', 
                          background: getAvatarColor(product.category), 
                          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '14px', fontWeight: 'bold'
                        }}>
                          {product.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="name-cell">{product.name}</span>
                      </div>
                    </td>
                    <td className="price-cell">₹{Number(product.price).toLocaleString()}</td>
                    <td className="quantity-cell">{product.quantity}</td>
                    <td className="category-cell">
                      <span className="category-badge">{product.category}</span>
                    </td>
                    <td className="actions-cell">
                      <button className="edit-btn" onClick={() => onEdit(product)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => onDelete(product.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              padding: '16px 24px', borderTop: '1px solid var(--border-dark)', background: 'var(--bg-primary)' 
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, displayedProducts.length)} of {displayedProducts.length} products
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  style={{
                    padding: '6px 12px', border: '1px solid var(--border-dark)', borderRadius: '6px',
                    background: currentPage === 1 ? 'var(--bg-primary)' : 'white',
                    color: currentPage === 1 ? 'var(--text-secondary)' : 'var(--text-primary)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600
                  }}
                >
                  Previous
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px' }}>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <span 
                      key={i} 
                      onClick={() => setCurrentPage(i + 1)}
                      style={{ 
                        width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                        background: currentPage === i + 1 ? 'var(--accent-primary)' : 'transparent',
                        color: currentPage === i + 1 ? 'white' : 'var(--text-primary)'
                      }}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  style={{
                    padding: '6px 12px', border: '1px solid var(--border-dark)', borderRadius: '6px',
                    background: currentPage === totalPages ? 'var(--bg-primary)' : 'white',
                    color: currentPage === totalPages ? 'var(--text-secondary)' : 'var(--text-primary)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewProducts;