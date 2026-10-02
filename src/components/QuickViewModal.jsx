import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { productsData } from '../data/products';

const QuickViewModal = ({ productId, onClose }) => {
  const { addToCart, buyNow, shareProduct } = useStore();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (productId) {
      const found = productsData.find(p => p.id === productId);
      if (found) {
        setProduct(found);
        setSelectedSize(found.sizes ? found.sizes[0] : "Medium (18\")");
        setSelectedColor(found.colors ? (typeof found.colors[0] === 'string' ? found.colors[0] : found.colors[0].name) : "Brown");
        setQuantity(1);
        setActiveImageIndex(0);
      }
    }
  }, [productId]);

  if (!productId || !product) return null;

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedSize, selectedColor);
    onClose();
  };

  const handleBuyNow = () => {
    buyNow(product.id, quantity, selectedSize, selectedColor);
    onClose();
    window.location.hash = '#/checkout';
  };

  const images = product.images && product.images.length > 0 ? product.images : ['toddy/raj1.jpg'];

  const relatedProducts = productsData
    .filter(p => p.id !== product.id)
    .sort((a, b) => (a.category === product.category ? -1 : 1))
    .slice(0, 3);

  return (
    <div className="quick-view-modal" id="quickViewModal" style={{ display: 'flex', zIndex: 1050 }} onClick={onClose}>
      <div className="quick-view-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
        <span className="close-quick-view" onClick={onClose}>&times;</span>
        <div className="quick-view-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' }}>
          
          {/* Gallery Column */}
          <div className="gallery-column">
            <div 
              className="main-image-container" 
              style={{ height: '250px', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => { navigate(`/product/${product.id}`); onClose(); }}
              title="View full details"
            >
              <img 
                src={images[activeImageIndex]} 
                alt={product.name} 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                onError={(e) => { e.target.onerror = null; e.target.src = 'toddy/raj1.jpg'; }}
              />
            </div>
            <div className="thumbnail-row" style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumbnail ${idx === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{ width: '50px', height: '50px', border: idx === activeImageIndex ? '2px solid #2575fc' : '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', overflow: 'hidden' }}
                >
                  <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Info Column */}
          <div className="info-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="product-category" style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase' }}>{product.category}</span>
              <h2 
                style={{ fontSize: '1.5rem', margin: '5px 0 10px 0', color: '#333', cursor: 'pointer' }}
                onClick={() => { navigate(`/product/${product.id}`); onClose(); }}
                title="View full details"
              >
                {product.name}
              </h2>
              
              <div className="rating" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                <i className="fas fa-star" style={{ color: '#f1c40f' }}></i>
                <span>{product.rating || '4.5'}</span>
                <span style={{ color: '#888', fontSize: '0.85rem' }}>({product.reviews || '50'} reviews)</span>
              </div>
              
              <div className="price-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <span className="current-price" style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ff4757' }}>₹{product.price}</span>
                {product.originalPrice && (
                  <span className="original-price" style={{ textDecoration: 'line-through', color: '#999' }}>₹{product.originalPrice}</span>
                )}
              </div>

              <p className="description" style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.4', marginBottom: '15px' }}>
                {product.description}
              </p>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="option-group" style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Size</label>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {product.sizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding: '6px 12px',
                          border: selectedSize === size ? '2px solid #2575fc' : '1px solid #ddd',
                          borderRadius: '4px',
                          background: selectedSize === size ? '#eef4ff' : 'white',
                          color: selectedSize === size ? '#2575fc' : '#333',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="option-group" style={{ marginBottom: '15px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Color</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {product.colors.map(color => {
                      const colorName = typeof color === 'string' ? color : color.name;
                      const colorCode = typeof color === 'string' ? '#8B4513' : color.code;
                      return (
                        <button 
                          key={colorName}
                          title={colorName}
                          onClick={() => setSelectedColor(colorName)}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: colorCode,
                            border: selectedColor === colorName ? '2px solid #2575fc' : '2px solid transparent',
                            cursor: 'pointer',
                            padding: 0
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div>
              <div className="qty-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Qty:</span>
                <div className="quantity-control" style={{ display: 'flex', alignItems: 'center', background: '#eee', borderRadius: '4px', padding: '3px 8px' }}>
                  <button className="qty-btn" onClick={() => quantity > 1 && setQuantity(quantity - 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0 5px' }}>-</button>
                  <span style={{ margin: '0 10px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
                  <button className="qty-btn" onClick={() => setQuantity(quantity + 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0 5px' }}>+</button>
                </div>
              </div>

              <div className="quick-view-actions" style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-add-cart" onClick={handleAddToCart} style={{ flex: 2, padding: '10px', fontSize: '0.9rem' }}>
                  Add to Cart
                </button>
                <button className="btn btn-primary" onClick={handleBuyNow} style={{ flex: 2, padding: '10px', fontSize: '0.9rem' }}>
                  Buy Now
                </button>
                <button className="btn btn-outline" onClick={() => shareProduct(product.id)} style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Share Product">
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>

              <div className="suggestions-section" style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Suggested for you</h3>
                <div className="suggestions-grid">
                  {relatedProducts.map(item => (
                    <div
                      key={item.id}
                      className="suggestion-card"
                      onClick={() => { navigate(`/product/${item.id}`); onClose(); }}
                    >
                      <div className="suggestion-image">
                        <img src={item.images?.[0] || 'toddy/raj1.jpg'} alt={item.name} />
                      </div>
                      <div className="suggestion-info">
                        <div className="suggestion-name">{item.name}</div>
                        <div className="suggestion-price">₹{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
