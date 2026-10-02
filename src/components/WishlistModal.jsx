import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const WishlistModal = () => {
  const navigate = useNavigate();
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    moveAllToCart
  } = useStore();

  if (!isWishlistOpen) return null;

  return (
    <div className="wishlist-modal" id="wishlistModal" style={{ display: 'flex' }} onClick={(e) => {
      if (e.target.id === 'wishlistModal') setIsWishlistOpen(false);
    }}>
      <div className="wishlist-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="wishlist-modal-header">
          <h3><i className="fas fa-heart"></i> My Wishlist</h3>
          <span className="close-wishlist" onClick={() => setIsWishlistOpen(false)}>&times;</span>
        </div>
        <div className="wishlist-body">
          {wishlist.length === 0 ? (
            <div className="wishlist-empty" id="wishlistEmpty" style={{ display: 'flex' }}>
              <i className="fas fa-heart"></i>
              <p>Your wishlist is empty</p>
              <button className="btn btn-primary" onClick={() => setIsWishlistOpen(false)}>Browse Products</button>
            </div>
          ) : (
            <div className="wishlist-items" id="wishlistItemsContainer" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {wishlist.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-image" style={{ cursor: 'pointer' }} onClick={() => { navigate(`/product/${item.id}`); setIsWishlistOpen(false); }}>
                    <img 
                      src={item.images ? item.images[0] : 'toddy/raj1.jpg'} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = 'toddy/raj1.jpg'; }}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h4 style={{ cursor: 'pointer' }} onClick={() => { navigate(`/product/${item.id}`); setIsWishlistOpen(false); }}>{item.name}</h4>
                    <div className="cart-item-price">₹{item.price}</div>
                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => {
                          addToCart(item.id, 1, item.sizes ? item.sizes[0] : "Medium (18\")", item.colors ? item.colors[0] : "Brown");
                          toggleWishlist(item.id);
                        }}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="btn btn-outline btn-sm"
                        style={{ border: 'none', color: '#ff4757' }}
                        onClick={() => toggleWishlist(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {wishlist.length > 0 && (
          <div className="wishlist-actions">
            <button 
              className="btn btn-primary btn-block" 
              id="moveAllToCart"
              onClick={() => {
                moveAllToCart();
                setIsWishlistOpen(false);
              }}
            >
              <i className="fas fa-shopping-cart"></i> Move All to Cart
            </button>
            <button className="btn btn-outline btn-block" id="continueShoppingWishlist" onClick={() => setIsWishlistOpen(false)}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistModal;
