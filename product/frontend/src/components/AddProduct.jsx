import React from 'react';

const AddProduct = ({ formData, onChange, onSubmit, onReset, isEditing }) => {
  const PREDEFINED_CATEGORIES = [
    'Electronics',
    'Clothing & Apparel',
    'Home & Kitchen',
    'Books & Stationery',
    'Health & Beauty',
    'Sports & Outdoors',
    'Toys & Games',
    'Other'
  ];

  return (
    <div className="page-container form-container">
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className="form-subtitle">
            {isEditing ? 'Update the details below.' : 'Enter the details of the product to add to your inventory.'}
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-field">
            <label className="field-label">Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={onChange}
              placeholder="e.g., MacBook Pro 16&quot;"
              className="modern-input"
              required
            />
          </div>

          <div className="form-field">
            <label className="field-label">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={onChange}
              placeholder="e.g., 249999"
              className="modern-input"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-field">
            <label className="field-label">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={onChange}
              placeholder="e.g., 25"
              className="modern-input"
              min="0"
              required
            />
          </div>

          <div className="form-field">
            <label className="field-label">Category</label>
            <select
              name="category"
              value={formData.category || 'Electronics'}
              onChange={onChange}
              className="modern-input"
              style={{ cursor: 'pointer' }}
              required
            >
              {PREDEFINED_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-add">
              {isEditing ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Update
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Product
                </>
              )}
            </button>
            <button type="button" className="btn-reset" onClick={onReset}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;