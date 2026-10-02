import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { productsData } from '../data/products';

const Header = () => {
  const { 
    cart,
    cartCount, 
    wishlist, 
    orders, 
    currentUser,
    setIsCartOpen, 
    setIsWishlistOpen, 
    setIsUserPopupOpen,
    sellOffer,
    activateSellOffer
  } = useStore();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showCartPreview, setShowCartPreview] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const matching = productsData.find(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      if (matching) {
        navigate(`/product/${matching.id}`);
      } else {
        navigate(`/store?search=${encodeURIComponent(searchQuery)}`);
      }
      setIsSearchOpen(false);
    }
  };

  const handleSearchInput = (value) => {
    setSearchQuery(value);
    if (value.trim().length >= 2) {
      setSearchSuggestions(
        productsData
          .filter(p => p.name.toLowerCase().includes(value.toLowerCase()) || p.category.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 6)
      );
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchQuery(product.name);
    setSearchSuggestions([]);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/product/${product.id}`);
  };

  const handleNavClick = (anchor) => {
    if (location.pathname !== '/store') {
      navigate(`/store${anchor}`);
    } else {
      const element = document.querySelector(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (location.pathname !== '/store') {
      setActiveSection('home');
      return;
    }

    const anchors = ['home', 'collections', 'features', 'about'];
    const sections = anchors.map(id => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id || 'home');
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(sec => observer.observe(sec));
    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/store" className="logo-link">
              <i className="fas fa-bear logo-icon"></i>
              <span>Teddy Haven</span>
            </Link>
          </div>
          
          <button className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(prev => !prev)}>
            <i className="fas fa-bars"></i>
          </button>

          <nav className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            <Link to="/store" className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>
              <i className="fas fa-home"></i> Home
            </Link>
            <a href="#collections" onClick={(e) => { e.preventDefault(); handleNavClick('#collections'); setIsMobileMenuOpen(false); }} className={`nav-link ${activeSection === 'collections' ? 'active' : ''}`}>
              <i className="fas fa-box"></i> Collections
            </a>
            <a href="#features" onClick={(e) => { e.preventDefault(); handleNavClick('#features'); setIsMobileMenuOpen(false); }} className={`nav-link ${activeSection === 'features' ? 'active' : ''}`}>
              <i className="fas fa-star"></i> Featured
            </a>
            <a href="#about" onClick={(e) => { e.preventDefault(); handleNavClick('#about'); setIsMobileMenuOpen(false); }} className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}>
              <i className="fas fa-info-circle"></i> About
            </a>
          </nav>

          <div className="header-actions">
            <button className="search-btn" id="searchToggle" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <i className="fas fa-search"></i>
            </button>

            <button className="wishlist-btn" id="wishlistBtn" onClick={() => setIsWishlistOpen(true)}>
              <i className="fas fa-heart"></i>
              <span className="wishlist-count">{wishlist.length}</span>
            </button>

            <div className="cart-preview-wrapper" onMouseEnter={() => setShowCartPreview(true)} onMouseLeave={() => setShowCartPreview(false)}>
              <button className="cart-btn" id="cartBtn" onClick={() => setIsCartOpen(true)}>
                <i className="fas fa-shopping-cart"></i>
                <span className="cart-count">{cartCount}</span>
              </button>
              {showCartPreview && (
                <div className="cart-preview-dropdown">
                  {cart.length === 0 ? (
                    <div className="cart-preview-empty">No items yet</div>
                  ) : (
                    <>
                      <div className="cart-preview-items">
                        {cart.slice(0, 3).map((item, idx) => (
                          <div className="cart-preview-item" key={`${item.id}-${idx}`}>
                            <img src={item.image || 'toddy/raj1.jpg'} alt={item.name} />
                            <div>
                              <p>{item.name}</p>
                              <span>{item.quantity} x ₹{item.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="btn btn-primary btn-block" onClick={() => { setIsCartOpen(true); setShowCartPreview(false); }}>
                        View Cart
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <button 
              className="user-btn" 
              id="userBtn" 
              onClick={() => setIsUserPopupOpen(true)} 
              title="My Account"
            >
              <i className="fas fa-user"></i>
            </button>

            <button 
              className={`sell-offer-btn ${sellOffer.active ? 'active' : ''}`} 
              id="sellOfferBtn" 
              onClick={activateSellOffer} 
              title={sellOffer.active ? 'Sell Offer Active' : 'Activate Sell Offer'}
            >
              <i className="fas fa-tag"></i>
              {sellOffer.active && <span className="sell-offer-count">{sellOffer.discount}%</span>}
            </button>

            <button className="settings-btn" id="settingsBtn" onClick={() => { navigate('/orders#settings'); }} title="Settings">
              <i className="fas fa-cog"></i>
              <span className="settings-count" id="settingsCount">0</span>
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        {isSearchOpen && (
          <div className="search-container show" id="searchContainer">
            <form onSubmit={handleSearchSubmit} className="search-bar">
              <input 
                type="text" 
                id="searchInput" 
                placeholder="Search for teddy bears, collections..."
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
              />
              <button type="submit" className="search-submit"><i className="fas fa-search"></i></button>
            </form>

            {searchSuggestions.length > 0 && (
              <div className="search-suggestions">
                {searchSuggestions.map(product => (
                  <button 
                    type="button" 
                    key={product.id} 
                    className="search-suggestion-item"
                    onClick={() => handleSuggestionClick(product)}
                  >
                    <span>{product.name}</span>
                    <small>{product.category}</small>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
