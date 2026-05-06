import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import AddProduct from './components/AddProduct';
import ViewProducts from './components/ViewProducts';
import AboutProject from './components/AboutProject';
import Toast from './components/Toast';

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from './services/productService';

const App = () => {
  const [activePage, setActivePage] = useState('home'); // Home is default
  const [products, setProducts] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    quantity: '',
    category: 'Electronics' // Default category
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Handle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // LOAD DATA FROM BACKEND
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    getProducts()
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  const showToast = (message) => {
    setToast({ show: true, message });
  };

  const hideToast = () => {
    setToast({ show: false, message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ADD / UPDATE USING BACKEND
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.productName || !formData.price || !formData.quantity || !formData.category) {
      showToast('Please fill in all fields');
      return;
    }

    const productData = {
      name: formData.productName,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      category: formData.category
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData)
        .then(() => {
          showToast('Product updated successfully!');
          loadProducts();
          setEditingProduct(null);
          handleReset();
        })
        .catch(err => console.error(err));
    } else {
      addProduct(productData)
        .then(() => {
          showToast('Product added successfully!');
          loadProducts();
          handleReset();
        })
        .catch(err => console.error(err));
    }
  };

  const handleReset = () => {
    setFormData({
      productName: '',
      price: '',
      quantity: '',
      category: 'Electronics'
    });
    setEditingProduct(null);
  };

  // DELETE FROM BACKEND
  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
        .then(() => {
          showToast('Product deleted successfully!');
          loadProducts();
        })
        .catch(err => console.error(err));
    }
  };

  const handleBulkDelete = async (ids) => {
    if (window.confirm(`Are you sure you want to delete ${ids.length} products?`)) {
      try {
        await Promise.all(ids.map(id => deleteProduct(id)));
        showToast(`${ids.length} products deleted successfully!`);
        loadProducts();
      } catch (err) {
        console.error(err);
        showToast('Error deleting some products.');
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.name,
      price: product.price,
      quantity: product.quantity,
      category: product.category
    });
    setActivePage('add');
  };

  const handleRefresh = () => {
    loadProducts();
    showToast('Products refreshed!');
  };

  // Navigate to Add Product page from Home button
  const handleStartManaging = () => {
    setActivePage('add');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onStartManaging={handleStartManaging} products={products} />;
      case 'add':
        return (
          <AddProduct
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onReset={handleReset}
            isEditing={!!editingProduct}
          />
        );
      case 'view':
        return (
          <ViewProducts
            products={products}
            onDelete={handleDeleteProduct}
            onBulkDelete={handleBulkDelete}
            onEdit={handleEditProduct}
            onRefresh={handleRefresh}
          />
        );
      case 'about':
        return <AboutProject />;
      default:
        return <HomePage onStartManaging={handleStartManaging} products={products} />;
    }
  };

  return (
    <div className="app">
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="app-layout">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
      <Toast message={toast.message} show={toast.show} onClose={hideToast} />
    </div>
  );
};

export default App;