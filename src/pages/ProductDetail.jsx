import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { productsData } from '../data/products';

import Header from '../components/Header';
import Footer from '../components/Footer';
import CartModal from '../components/CartModal';
import WishlistModal from '../components/WishlistModal';
import UserPopup from '../components/UserPopup';

import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, buyNow, toggleWishlist, isInWishlist, shareProduct, addRecentlyViewed } = useStore();

  const productId = parseInt(id) || 1;
  const [product, setProduct] = useState(null);

  // Selector states
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const found = productsData.find(p => p.id === productId) || productsData[0];
    setProduct(found);
    addRecentlyViewed(productId);
    
    // Set default selections
    setSelectedSize(found.sizes ? found.sizes[0] : "Medium (18\")");
    setSelectedColor(found.colors ? (typeof found.colors[0] === 'string' ? found.colors[0] : found.colors[0].name) : "Brown");
    setQuantity(1);
    setActiveImageIndex(0);
    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : ['toddy/raj1.jpg'];
  const specs = product.specifications || [
    { icon: "fas fa-ruler", label: "Size", value: "18 inches" },
    { icon: "fas fa-weight", label: "Weight", value: "1.2 kg" },
    { icon: "fas fa-paint-brush", label: "Material", value: "Premium Plush" },
    { icon: "fas fa-fill-drip", label: "Filling", value: "Cotton Blend" },
    { icon: "fas fa-child", label: "Age Range", value: "0+ Years" },
    { icon: "fas fa-washing-machine", label: "Care", value: "Machine Washable" }
  ];

  const features = product.features || [
    "Premium quality synthetic fur",
    "Soft cotton filling",
    "Child-safe plastic eyes",
    "Machine washable",
    "Handcrafted stitching",
    "Hypoallergenic materials",
    "Reinforced seams",
    "Lifetime quality guarantee"
  ];

  const reviews = product.reviewsData || [
    {
      id: 1,
      name: "Priya Sharma",
      rating: 5,
      date: "2024-01-15",
      comment: "Absolutely love this teddy! The quality is amazing and it's so soft. My daughter hasn't let it go since we got it."
    },
    {
      id: 2,
      name: "Rahul Verma",
      rating: 4,
      date: "2024-01-10",
      comment: "Great gift for my girlfriend. She loved it! The size is perfect for cuddling."
    },
    {
      id: 3,
      name: "Anjali Patel",
      rating: 5,
      date: "2024-01-05",
      comment: "Best teddy bear I've ever owned. The stitching is perfect and it feels premium."
    }
  ];

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    buyNow(product.id, quantity, selectedSize, selectedColor);
    navigate('/checkout');
  };

  // Hardcoded 3 related products matching product.html related products
  const relatedProducts = productsData.filter(p => p.id !== product.id).slice(0, 3);

  const handleRelatedClick = (relatedId) => {
    localStorage.setItem('currentProductId', relatedId);
    navigate(`/product/${relatedId}`);
  };

  return (
    <div className="store-page">
      <Header />

      <section className="product-detail-page">
        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/store')}>Home</span>
            <i className="fas fa-chevron-right"></i>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/store#collections')}>Collections</span>
            <i className="fas fa-chevron-right"></i>
            <span style={{ textTransform: 'capitalize' }}>{product.category}</span>
            <i className="fas fa-chevron-right"></i>
            <span className="active">{product.name}</span>
          </div>

          {/* Product Detail Container */}
          <div className="product-detail-container">
            {/* Product Gallery */}
            <div className="product-gallery">
              <div className="main-product-image" id="mainImage">
                <img 
                  src={images[activeImageIndex]} 
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'toddy/raj1.jpg'; }}
                />
              </div>
              <div className="thumbnail-gallery" id="thumbnailGallery">
                {images.map((imageUrl, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={imageUrl} alt={`thumbnail-${index}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info Section */}
            <div className="product-info-section">
              <span className="product-category-badge" style={{ textTransform: 'capitalize' }}>{product.category}</span>
              <h1 className="product-title" id="productTitle">{product.name}</h1>
              
              <div className="product-rating">
                <div className="rating-stars">
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
                </div>
                <span className="rating-count">({product.reviews || 128} reviews)</span>
                <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`} style={{
                  backgroundColor: product.inStock ? 'var(--success-light)' : 'var(--danger-light)',
                  color: product.inStock ? 'var(--success)' : 'var(--danger)'
                }}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="product-price-section">
                <span className="current-price">₹{product.price}</span>
                {product.originalPrice && <span className="original-price">₹{product.originalPrice}</span>}
                {product.discount > 0 && <span className="discount-badge">{product.discount}% OFF</span>}
              </div>

              <p className="product-description">
                {product.description}
              </p>

              {/* Product Specifications */}
              <div className="product-specs">
                <h3>Specifications</h3>
                <div className="specs-grid">
                  {specs.map((spec, idx) => (
                    <div className="spec-item" key={idx}>
                      <i className={spec.icon}></i>
                      <div>
                        <div className="spec-label" style={{ fontSize: '0.8rem', color: '#666' }}>{spec.label}</div>
                        <div className="spec-value" style={{ fontWeight: '600' }}>{spec.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Options */}
              <div className="product-options">
                {product.sizes && product.sizes.length > 0 && (
                  <div className="option-section">
                    <h4 className="option-title"><i className="fas fa-ruler"></i> Size</h4>
                    <div className="option-buttons">
                      {product.sizes.map(size => (
                        <button 
                          key={size}
                          className={`option-btn ${selectedSize === size ? 'active' : ''}`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors && product.colors.length > 0 && (
                  <div className="option-section">
                    <h4 className="option-title"><i className="fas fa-palette"></i> Color</h4>
                    <div className="option-buttons">
                      {product.colors.map(color => {
                        const colorName = typeof color === 'string' ? color : color.name;
                        const colorCode = typeof color === 'string' ? '#8B4513' : color.code;
                        return (
                          <button 
                            key={colorName}
                            className={`option-btn color-option ${selectedColor === colorName ? 'active' : ''}`}
                            style={{ backgroundColor: colorCode }}
                            title={colorName}
                            onClick={() => {
                              setSelectedColor(colorName);
                              // Sync main image based on color choice if multiple images are loaded
                              const colorIndex = product.colors.findIndex(c => (typeof c === 'string' ? c : c.name) === colorName);
                              if (colorIndex !== -1 && colorIndex < images.length) {
                                setActiveImageIndex(colorIndex);
                              }
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="quantity-selector">
                <h4 className="option-title"><i className="fas fa-cube"></i> Quantity</h4>
                <div className="quantity-control">
                  <button className="qty-btn minus" onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
                  <span className="qty-value">{quantity}</span>
                  <button className="qty-btn plus" onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              {/* Product Actions */}
              <div className="product-actions" style={{ display: 'flex', gap: '15px' }}>
                <button className="btn btn-product-action btn-add-to-cart" onClick={handleAddToCart} style={{ flex: 1 }}>
                  <i className="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button className="btn btn-product-action btn-buy-now" onClick={handleBuyNow} style={{ flex: 1 }}>
                  <i className="fas fa-bolt"></i> Buy Now
                </button>
                <button 
                  className="btn btn-product-action btn-outline" 
                  onClick={() => shareProduct(product.id)}
                  style={{ minWidth: '50px', width: '50px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}
                  title="Share Product"
                >
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>

              {/* Product Meta Info */}
              <div className="product-meta">
                <div className="meta-item">
                  <i className="fas fa-shipping-fast"></i>
                  <span>Free shipping on orders above ₹999</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-undo"></i>
                  <span>30-day return policy</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>100% quality guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="product-tabs">
            <div className="tab-buttons">
              {['description', 'features', 'reviews', 'shipping'].map(tab => (
                <button 
                  key={tab} 
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {tab === 'shipping' ? 'Shipping Info' : tab}
                </button>
              ))}
            </div>

            {activeTab === 'description' && (
              <div className="tab-content active" id="descriptionTab">
                <h3>About This Product</h3>
                <p>
                  {product.fullDescription || `Our ${product.name} is more than just a teddy bear - it's a companion for life. Made with the finest materials and crafted with attention to detail, this bear is designed to bring comfort and joy to people of all ages.`}
                </p>
                <p>
                  Each bear is individually inspected to ensure the highest quality standards. The soft, 
                  plush fur is gentle to touch, and the premium cotton filling provides the perfect 
                  cuddle factor. Safety is our priority - all materials are child-safe and hypoallergenic.
                </p>
                <p>
                  Perfect as a gift for birthdays, anniversaries, or just because. The bear 
                  comes beautifully packaged, ready to spread love and happiness.
                </p>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="tab-content active" id="featuresTab">
                <h3>Key Features</h3>
                <ul className="features-list">
                  {features.map((feature, idx) => (
                    <li key={idx}><i className="fas fa-check"></i> {feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-content active" id="reviewsTab">
                <div className="reviews-section">
                  <div className="review-summary">
                    <div className="average-rating">
                      <div className="rating-number">{product.rating || '4.8'}</div>
                      <div className="rating-stars-large" style={{ color: 'var(--warning)', margin: '10px 0', fontSize: '1.2rem' }}>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star-half-alt"></i>
                      </div>
                      <div className="review-count">Based on {product.reviews || 128} reviews</div>
                    </div>
                    <div className="rating-bars">
                      {[60, 40, 30, 15, 5].map((pct, idx) => (
                        <div className="rating-bar" key={idx}>
                          <div className="bar-label" style={{ width: '50px' }}>{5 - idx} <i className="fas fa-star" style={{ color: 'var(--warning)' }}></i></div>
                          <div className="bar-container" style={{ flex: 1, height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div className="bar-fill" style={{ width: `${pct}%`, height: '100%', background: 'var(--warning)' }}></div>
                          </div>
                          <div className="bar-percentage" style={{ width: '40px', textAlign: 'right' }}>{pct}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="review-list">
                    {reviews.map(review => {
                      const initials = review.name.split(' ').map(n => n[0]).join('');
                      return (
                        <div className="review-item" key={review.id}>
                          <div className="review-header">
                            <div className="reviewer-info">
                              <div className="reviewer-avatar">{initials}</div>
                              <div>
                                <div className="reviewer-name">{review.name}</div>
                                <div className="review-date">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                              </div>
                            </div>
                            <div className="review-rating" style={{ color: 'var(--warning)' }}>
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <i className={idx < review.rating ? "fas fa-star" : "far fa-star"} key={idx}></i>
                              ))}
                            </div>
                          </div>
                          <div className="review-content">
                            {review.comment}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="tab-content active" id="shippingTab">
                <h3>Shipping Information</h3>
                <div className="shipping-info" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '15px' }}>
                  <div className="shipping-method" style={{ padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}><i className="fas fa-truck" style={{ color: 'var(--primary)' }}></i> Standard Shipping</h4>
                    <p>• Free on orders above ₹999</p>
                    <p>• Delivery in 5-7 business days</p>
                    <p>• Trackable shipping</p>
                  </div>
                  <div className="shipping-method" style={{ padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}><i className="fas fa-bolt" style={{ color: 'var(--primary)' }}></i> Express Shipping</h4>
                    <p>• ₹99 for all orders</p>
                    <p>• Delivery in 2-3 business days</p>
                    <p>• Priority processing</p>
                  </div>
                  <div className="shipping-method" style={{ padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}><i className="fas fa-gift" style={{ color: 'var(--primary)' }}></i> Gift Wrapping</h4>
                    <p>• Premium gift wrapping: ₹99</p>
                    <p>• Includes personalized message card</p>
                    <p>• Ready for gifting</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Related Products */}
          <div className="related-products">
            <div className="related-header">
              <h2>You May Also Like</h2>
              <p>Discover more adorable companions</p>
            </div>
            <div className="related-grid">
              {relatedProducts.map(related => {
                const rImg1 = related.images && related.images.length > 0 ? related.images[0] : 'toddy/raj1.jpg';
                const rImg2 = related.images && related.images.length > 1 ? related.images[1] : rImg1;
                return (
                  <div className="product-card" key={related.id}>
                    {related.discount > 0 && <div className="product-badge">{related.discount}% OFF</div>}
                    <div 
                      className="product-image" 
                      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                      onClick={() => handleRelatedClick(related.id)}
                    >
                      <img src={rImg1} alt={related.name} className="main-img" style={{ width: '100%', height: '250px', objectFit: 'cover', transition: 'opacity 0.5s ease' }} />
                      <img src={rImg2} alt={related.name} className="hover-img" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '250px', objectFit: 'cover', opacity: 0, transition: 'opacity 0.5s ease' }} />
                      <div className="product-actions" onClick={(e) => e.stopPropagation()}>
                        <button className="action-btn view" onClick={() => handleRelatedClick(related.id)} title="Quick View">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className={`action-btn wishlist ${isInWishlist(related.id) ? 'active' : ''}`} 
                          onClick={() => toggleWishlist(related.id)} 
                          title="Add to Wishlist"
                        >
                          <i className="fas fa-heart"></i>
                        </button>
                        <button className="action-btn share share-btn" onClick={() => shareProduct(related.id)} title="Share">
                          <i className="fas fa-share-alt"></i>
                        </button>
                      </div>
                    </div>
                    <div className="product-info">
                      <span className="product-category" style={{ textTransform: 'capitalize' }}>{related.category}</span>
                      <h3 onClick={() => handleRelatedClick(related.id)} style={{ cursor: 'pointer' }}>{related.name}</h3>
                      <div className="rating" style={{ display: 'flex', gap: '2px', color: 'var(--warning)', margin: '5px 0' }}>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star-half-alt"></i>
                        <span style={{ color: '#666', marginLeft: '5px' }}>(89)</span>
                      </div>
                      <div className="product-price">
                        <span className="current-price">₹{related.price}</span>
                        {related.originalPrice && <span className="original-price">₹{related.originalPrice}</span>}
                      </div>
                      <div className="product-footer">
                        <button className="btn btn-add-cart" onClick={() => addToCart(related.id)}>
                          <i className="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <button className="btn btn-primary" onClick={() => { buyNow(related.id); navigate('/checkout'); }}>
                          <i className="fas fa-bolt"></i> Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Modals */}
      <CartModal />
      <WishlistModal />
      <UserPopup />
    </div>
  );
};

export default ProductDetail;
