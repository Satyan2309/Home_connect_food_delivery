import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { menuAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import '../styles/menu.css';

export function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 500
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenuItems();
  }, [filters]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getItems(1, 50, {
        search: searchTerm,
        category: filters.category
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    alert(`${item.name} added to cart!`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <div className="loading">Loading menu items...</div>;
  }

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Browse delicious homemade meals from local chefs</p>
      </div>

      <div className="menu-container">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <h3>Filters</h3>

          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search meals..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="dessert">Dessert</option>
              <option value="snacks">Snacks</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-range">
              <input
                type="range"
                min="0"
                max="500"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
              />
              <p>₹0 - ₹{filters.maxPrice}</p>
            </div>
          </div>

          <div className="filter-group">
            <label>Dietary Tags</label>
            <label className="checkbox">
              <input type="checkbox" />
              <span>Vegetarian</span>
            </label>
            <label className="checkbox">
              <input type="checkbox" />
              <span>Vegan</span>
            </label>
            <label className="checkbox">
              <input type="checkbox" />
              <span>Gluten-Free</span>
            </label>
          </div>
        </aside>

        {/* Menu Items Grid */}
        <div className="menu-grid">
          {items.length === 0 ? (
            <div className="no-items">
              <p>No items found. Try adjusting your filters.</p>
            </div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.id}
                className="menu-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="menu-card-image">
                  <img src={item.image || '/placeholder-food.jpg'} alt={item.name} />
                  <span className="price">₹{item.price}</span>
                </div>

                <div className="menu-card-content">
                  <h3>{item.name}</h3>
                  <p className="description">{item.description}</p>

                  <div className="card-meta">
                    <span className="category">{item.category}</span>
                    <span className="prep-time">
                      <i className="fas fa-clock"></i> {item.preparation_time} min
                    </span>
                  </div>

                  {item.dietary_info && (
                    <div className="dietary-tags">
                      {item.dietary_info.split(',').map((tag, idx) => (
                        <span key={idx} className="tag">{tag.trim()}</span>
                      ))}
                    </div>
                  )}

                  <button
                    className="btn-add-cart"
                    onClick={() => handleAddToCart(item)}
                  >
                    <i className="fas fa-shopping-cart"></i> Add to Cart
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
