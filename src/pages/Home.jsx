import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { productsData } from '../data/products';

import Header from '../components/Header';
import Footer from '../components/Footer';
import CartModal from '../components/CartModal';
import WishlistModal from '../components/WishlistModal';
import UserPopup from '../components/UserPopup';
import QuickViewModal from '../components/QuickViewModal';
import ChatWidget from '../components/ChatWidget';
import ComparePanel from '../components/ComparePanel';
import ArPreviewModal from '../components/ArPreviewModal';
import CustomizerWidget from '../components/CustomizerWidget';
import VoiceSearchWidget from '../components/VoiceSearchWidget';
import BirthdayReminderBanner from '../components/BirthdayReminderBanner';
import StoreLocator from '../components/StoreLocator';
import LoyaltyCard from '../components/LoyaltyCard';
import GiftWrapSelector from '../components/GiftWrapSelector';
import MiniGamePromo from '../components/MiniGamePromo';
import SavedCardsPanel from '../components/SavedCardsPanel';

// Rotating hero image inside the pink blob
const RotatingHeroImage = () => {
  const images = [
    'toddy/raj13.avif',
    'toddy/raj20.avif',
    'toddy/raj27.avif',
    'toddy/raj29.avif'
  ];
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % images.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <img
      src={images[index]}
      alt=""
      className={`rotating-img ${visible ? 'show' : 'hide'}`}
      onError={(e) => { e.target.onerror = null; e.target.src = images[0]; }}
    />
  );
};

const Home = () => {
  const { 
    addToCart, 
    buyNow, 
    toggleWishlist, 
    isInWishlist,
    shareProduct,
    sellOffer,
    addRecentlyViewed,
    recentlyViewed,
    addCompareItem,
    openChat,
    toggleArPreview,
    activateVoiceSearch,
    getRecommendations,
    addVoiceNote,
    showToast,
    themeMode,
    toggleTheme,
    highContrast,
    toggleContrast
  } = useStore();

  const navigate = useNavigate();
  const location = useLocation();

  // Page States
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedMood, setSelectedMood] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [quickViewId, setQuickViewId] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [giftFinder, setGiftFinder] = useState({ occasion: 'birthday', budget: '1500' });
  const [giftRecommendation, setGiftRecommendation] = useState(null);
  
  // Countdown Timer States
  const [timeLeft, setTimeLeft] = useState({ days: '03', hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('search') || '');
  }, [location.search]);

  useEffect(() => {
    // 3 days countdown timer
    const countdownDate = new Date();
    countdownDate.setDate(countdownDate.getDate() + 3);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({
          days: days.toString().padStart(2, '0'),
          hours: hours.toString().padStart(2, '0'),
          minutes: minutes.toString().padStart(2, '0'),
          seconds: seconds.toString().padStart(2, '0')
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredProducts = productsData
    .filter(p => selectedFilter === 'all' || p.category === selectedFilter)
    .filter(p => selectedMood === 'all' || p.tags?.some(tag => tag.includes(selectedMood)))
    .filter(p => {
      if (!searchTerm.trim()) return true;
      const query = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query) || p.tags?.some(tag => tag.includes(query));
    });

  const [offerTimer, setOfferTimer] = useState({ minutes: '10', seconds: '00' });

  const isSellOfferActive = sellOffer.active && sellOffer.endsAt && new Date(sellOffer.endsAt) > new Date();

  useEffect(() => {
    if (!isSellOfferActive) {
      setOfferTimer({ minutes: '10', seconds: '00' });
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(new Date(sellOffer.endsAt).getTime() - Date.now(), 0);
      const minutes = String(Math.floor(remaining / 60000)).padStart(2, '0');
      const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
      setOfferTimer({ minutes, seconds });
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sellOffer, isSellOfferActive]);

  const handleProductClick = (id) => {
    // Open product quick view and show related suggestions
    addRecentlyViewed(id);
    localStorage.setItem('currentProductId', id);
    setQuickViewId(id);
  };

  const handleAddBundle = (bundle) => {
    bundle.items.forEach(item => addToCart(item.id, item.quantity || 1, item.size || item.sizes?.[0] || 'Medium (18")', item.color || item.colors?.[0] || 'Brown'));
  };

  const handleVoiceNote = (product) => {
    addVoiceNote({ productId: product.id, text: `Voice note added for ${product.name}` });
    showToast(`Voice note saved for ${product.name}`,'success');
  };

  const moodOptions = [
    { label: 'All', value: 'all' },
    { label: 'Joy', value: 'joy' },
    { label: 'Gift', value: 'gift' },
    { label: 'Premium', value: 'premium' },
    { label: 'Sleepy', value: 'sleepy' }
  ];

  const handleGiftFinderSubmit = () => {
    const budget = Number(giftFinder.budget);
    const occasion = giftFinder.occasion;

    const recommended = [...productsData]
      .filter(product => product.price <= budget)
      .filter(product => {
        if (occasion === 'birthday') {
          return product.tags?.some(tag => ['gift', 'premium', 'best-seller', 'classic'].includes(tag));
        }
        if (occasion === 'anniversary') {
          return product.tags?.some(tag => ['premium', 'luxury', 'romantic', 'love'].includes(tag));
        }
        if (occasion === 'baby') {
          return product.tags?.some(tag => ['baby', 'mini', 'soft'].includes(tag));
        }
        return product.tags?.some(tag => ['gift', 'special', 'unique'].includes(tag));
      })
      .sort((a, b) => Math.abs(a.price - budget) - Math.abs(b.price - budget))[0];

    setGiftRecommendation(recommended || null);

    if (recommended) {
      showToast(`Suggested ${recommended.name} for ${occasion}.`, 'success');
    } else {
      showToast('No teddy matched that budget yet. Try a higher range.', 'warning');
    }
  };

  const handleBuyNow = (id) => {
    buyNow(id);
    navigate('/checkout');
  };

  const recentlyViewedProducts = recentlyViewed
    .map(id => productsData.find(p => p.id === id))
    .filter(Boolean);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const bundleOffers = [
    {
      title: 'Gift Bundle Duo',
      description: 'Pair a premium bear with a mini companion for instant joy.',
      discount: 15,
      items: [productsData[0], productsData[2]]
    },
    {
      title: 'Sleepy Snuggle Set',
      description: 'Sleepy Bear plus Rainbow Bear for bedtime magic.',
      discount: 18,
      items: [productsData[4], productsData[5]]
    },
    {
      title: 'Ultimate Cuddle Trio',
      description: 'Three best-selling bears at a special bundle price.',
      discount: 20,
      items: [productsData[1], productsData[3], productsData[8]]
    }
  ];

  return (
    <div className="store-page">
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1><span className="highlight">Cuddles & Love</span> in Every Hug</h1>
              <p>Discover our collection of adorable teddy bears, perfect for gifting or adding warmth to your home. Each bear is crafted with love and care.</p>
              <div className="hero-buttons">
                <a href="#collections" className="btn btn-primary btn-lg" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('collections').scrollIntoView({ behavior: 'smooth' });
                }}>
                  <i className="fas fa-shopping-bag"></i> Shop Collection
                </a>
                <a href="#features" className="btn btn-secondary btn-lg" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                }}>
                  <i className="fas fa-info-circle"></i> Learn More
                </a>
              </div>
              <div className="hero-quick-actions">
                <button className="btn btn-outline" onClick={activateVoiceSearch}><i className="fas fa-microphone"></i> Voice Search</button>
                <button className="btn btn-outline" onClick={toggleArPreview}><i className="fas fa-camera"></i> AR Preview</button>
                <button className="btn btn-outline" onClick={openChat}><i className="fas fa-comments"></i> Live Chat</button>
              </div>
              <div className="hero-theme-switcher">
                <button className="btn btn-xs" onClick={toggleTheme}>{themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}</button>
                <button className="btn btn-xs" onClick={toggleContrast}>{highContrast ? 'Normal Contrast' : 'High Contrast'}</button>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-image-card">
                <div className="floating-bear" />
                <RotatingHeroImage />
                <div className="hero-badge">
                  <i className="fas fa-sparkles"></i> New plush drops
                </div>
                <div className="hero-mini-card">
                  <span>Soft & cozy</span>
                  <strong>Gift-ready comfort</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat">
              <i className="fas fa-smile"></i>
              <div>
                <h3>10,000+</h3>
                <p>Happy Customers</p>
              </div>
            </div>
            <div className="stat">
              <i className="fas fa-bear"></i>
              <div>
                <h3>50+</h3>
                <p>Teddy Varieties</p>
              </div>
            </div>
            <div className="stat">
              <i className="fas fa-shipping-fast"></i>
              <div>
                <h3>500+</h3>
                <p>Daily Deliveries</p>
              </div>
            </div>
            <div className="stat">
              <i className="fas fa-award"></i>
              <div>
                <h3>100%</h3>
                <p>Quality Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Collection Section */}
      <section className="popular-collection" id="collections">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our <span className="highlight">Popular</span> Collection</h2>
            <p className="section-subtitle">Handpicked teddy bears that bring joy and comfort to every moment</p>
          </div>

          {isSellOfferActive && (
            <div className="sell-offer-banner">
              <strong>FLASH SALE LIVE:</strong> Get {sellOffer.discount}% off storewide. Ends in {offerTimer.minutes}:{offerTimer.seconds}
            </div>
          )}
          
          <div className="collection-controls">
            {['all', 'premium', 'giant', 'mini'].map(filter => (
              <button 
                key={filter} 
                className={`filter-btn ${selectedFilter === filter ? 'active' : ''}`}
                onClick={() => setSelectedFilter(filter)}
                style={{ textTransform: 'capitalize' }}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="mood-filters">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                className={`mood-btn ${selectedMood === mood.value ? 'active' : ''}`}
                onClick={() => setSelectedMood(mood.value)}
              >
                {mood.label}
              </button>
            ))}
          </div>
          
          <div className="products-grid" id="productsGrid">
            {filteredProducts.map(product => {
              const mainImg = product.images && product.images.length > 0 ? product.images[0] : 'toddy/raj1.jpg';
              const hoverImg = product.images && product.images.length > 1 ? product.images[1] : mainImg;
              const hasDiscount = product.discount > 0;
              const currentPrice = isSellOfferActive
                ? Math.round(product.price * (1 - sellOffer.discount / 100))
                : product.price;
              const displayOriginal = isSellOfferActive ? product.price : product.originalPrice;

              return (
                <div className="product-card" key={product.id}>
                  {isSellOfferActive && (
                    <div className="product-badge offer">FLASH SALE {sellOffer.discount}% OFF</div>
                  )}
                  {hasDiscount && <div className="product-badge">{product.discount}% OFF</div>}
                  <div 
                    className="product-image" 
                    style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img 
                      src={mainImg} 
                      alt={product.name}
                      className="main-img"
                      style={{ width: '100%', height: '250px', objectFit: 'cover', transition: 'opacity 0.5s ease' }}
                    />
                    <img 
                      src={hoverImg} 
                      alt={product.name}
                      className="hover-img"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '250px', objectFit: 'cover', opacity: 0, transition: 'opacity 0.5s ease' }}
                    />
                    <div className="product-actions" onClick={(e) => e.stopPropagation()}>
                      <button className="action-btn view" onClick={() => setQuickViewId(product.id)} title="Quick View">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className={`action-btn wishlist ${isInWishlist(product.id) ? 'active' : ''}`} 
                        onClick={() => toggleWishlist(product.id)} 
                        title="Add to Wishlist"
                        style={{ color: isInWishlist(product.id) ? '#ff4757' : 'inherit' }}
                      >
                        <i className="fas fa-heart"></i>
                      </button>
                      <button className="action-btn share share-btn" onClick={() => shareProduct(product.id)} title="Share">
                        <i className="fas fa-share-alt"></i>
                      </button>
                    </div>
                  </div>
                  <div className="product-info">
                    <span className="product-category" style={{ textTransform: 'capitalize' }}>{product.category}</span>
                    <h3 onClick={() => handleProductClick(product.id)} style={{ cursor: 'pointer' }}>{product.name}</h3>
                    <div className="rating">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const starVal = idx + 1;
                        if (product.rating >= starVal) {
                          return <i className="fas fa-star" key={idx}></i>;
                        } else if (product.rating >= starVal - 0.5) {
                          return <i className="fas fa-star-half-alt" key={idx}></i>;
                        } else {
                          return <i className="far fa-star" key={idx}></i>;
                        }
                      })}
                      <span className="rating-count">({product.reviews || 0})</span>
                    </div>
                    <div className="product-price">
                      <span className="current-price">₹{currentPrice}</span>
                      {displayOriginal && displayOriginal !== currentPrice && (
                        <span className="original-price">₹{displayOriginal}</span>
                      )}
                    </div>
                    <div className="product-footer">
                      <button className="btn btn-add-cart" onClick={() => addToCart(product.id)}>
                        <i className="fas fa-cart-plus"></i> Add to Cart
                      </button>
                      <button className="btn btn-primary" onClick={() => handleBuyNow(product.id)}>
                        <i className="fas fa-bolt"></i> Buy Now
                      </button>
                      <button className="btn btn-outline btn-sm" onClick={() => addCompareItem(product.id)}>
                        <i className="fas fa-balance-scale-left"></i> Compare
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      {recentlyViewedProducts.length > 0 && (
        <section className="recently-viewed">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Recently Viewed</h2>
              <p className="section-subtitle">Continue exploring products you checked out recently.</p>
            </div>
            <div className="recently-viewed-grid">
              {recentlyViewedProducts.map(product => (
                <div key={product.id} className="recently-viewed-card" onClick={() => handleProductClick(product.id)}>
                  <img src={product.images?.[0] || 'toddy/raj1.jpg'} alt={product.name} />
                  <div className="recently-viewed-info">
                    <h4>{product.name}</h4>
                    <span>₹{product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <BirthdayReminderBanner />
      <section className="bundle-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Bundle <span className="highlight">Deals</span></h2>
            <p className="section-subtitle">Save more with curated sets of our best teddy bears.</p>
          </div>
          <div className="bundle-grid">
            {bundleOffers.map((bundle, index) => (
              <div key={index} className="bundle-card">
                <div className="bundle-card-header">
                  <div>
                    <h3>{bundle.title}</h3>
                    <p>{bundle.description}</p>
                  </div>
                  <span className="bundle-discount">{bundle.discount}% OFF</span>
                </div>
                <div className="bundle-images">
                  {bundle.items.slice(0, 3).map(item => (
                    <img key={item.id} src={item.images?.[0] || 'toddy/raj1.jpg'} alt={item.name} />
                  ))}
                </div>
                <button className="btn btn-primary btn-block" onClick={() => handleAddBundle(bundle)}>
                  Add Bundle to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gift-finder-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Gift <span className="highlight">Finder</span></h2>
            <p className="section-subtitle">Pick an occasion and budget to discover the perfect teddy in seconds.</p>
          </div>

          <div className="gift-finder-card">
            <div className="gift-finder-form">
              <label htmlFor="occasion">Occasion</label>
              <select
                id="occasion"
                value={giftFinder.occasion}
                onChange={(e) => setGiftFinder(prev => ({ ...prev, occasion: e.target.value }))}
              >
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="baby">Baby Gift</option>
                <option value="general">General Surprise</option>
              </select>

              <label htmlFor="budget">Budget</label>
              <select
                id="budget"
                value={giftFinder.budget}
                onChange={(e) => setGiftFinder(prev => ({ ...prev, budget: e.target.value }))}
              >
                <option value="800">Up to ₹800</option>
                <option value="1500">Up to ₹1500</option>
                <option value="2500">Up to ₹2500</option>
                <option value="4000">Up to ₹4000</option>
              </select>

              <button className="btn btn-primary btn-block" onClick={handleGiftFinderSubmit}>
                <i className="fas fa-magic"></i> Find My Teddy
              </button>
            </div>

            <div className="gift-finder-result">
              {giftRecommendation ? (
                <>
                  <div className="gift-finder-badge">Recommended</div>
                  <h3>{giftRecommendation.name}</h3>
                  <p>{giftRecommendation.description}</p>
                  <div className="gift-finder-meta">
                    <span>₹{giftRecommendation.price}</span>
                    <span>{giftRecommendation.category}</span>
                  </div>
                  <button className="btn btn-outline" onClick={() => handleBuyNow(giftRecommendation.id)}>
                    <i className="fas fa-shopping-cart"></i> Buy This Teddy
                  </button>
                </>
              ) : (
                <div className="gift-finder-empty">
                  <i className="fas fa-gift"></i>
                  <p>Choose a mood and budget to get a personalized recommendation.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose <span className="highlight">Teddy Haven</span></h2>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon premium">
                <i className="fas fa-gem"></i>
              </div>
              <h3>Premium Quality</h3>
              <p>Made with the softest, child-safe materials certified by international standards</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon delivery">
                <i className="fas fa-truck-fast"></i>
              </div>
              <h3>Free Delivery</h3>
              <p>Free shipping on orders above ₹999 with 24-hour delivery in metro cities</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon gift">
                <i className="fas fa-gift"></i>
              </div>
              <h3>Perfect Gift</h3>
              <p>Beautifully packaged with custom messages for special moments</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon support">
                <i className="fas fa-headset"></i>
              </div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support for all your queries and concerns</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <LoyaltyCard />
      <CustomizerWidget />
      <GiftWrapSelector />
      <StoreLocator />
      <ComparePanel />
      <SavedCardsPanel />
      <MiniGamePromo />
      <ArPreviewModal />
      <ChatWidget />
      <VoiceSearchWidget />
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <div className="cta-text">
              <h2>Ready to Spread Some <span className="highlight">Love</span>?</h2>
              <p>Order now and get <strong>20% off</strong> on your first purchase. Limited time offer!</p>
              <div className="countdown-timer" id="countdown">
                <div className="countdown-item">
                  <span className="countdown-number" id="days">{timeLeft.days}</span>
                  <span className="countdown-label">Days</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-number" id="hours">{timeLeft.hours}</span>
                  <span className="countdown-label">Hours</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-number" id="minutes">{timeLeft.minutes}</span>
                  <span className="countdown-label">Minutes</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-number" id="seconds">{timeLeft.seconds}</span>
                  <span className="countdown-label">Seconds</span>
                </div>
              </div>
            </div>
            <div className="cta-action">
              <a href="#collections" className="btn btn-primary btn-xl" onClick={(e) => {
                e.preventDefault();
                document.getElementById('collections').scrollIntoView({ behavior: 'smooth' });
              }}>
                <i className="fas fa-bolt"></i> Shop Now & Get 20% OFF
              </a>
              <p className="cta-note"><i className="fas fa-shield-alt"></i> Secure checkout · 30-day returns</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {showScrollTop && (
        <button className="scroll-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <i className="fas fa-chevron-up"></i>
        </button>
      )}

      {/* Modals & Overlays */}
      <CartModal />
      <WishlistModal />
      <UserPopup />
      <QuickViewModal productId={quickViewId} onClose={() => setQuickViewId(null)} />
    </div>
  );
};

export default Home;
