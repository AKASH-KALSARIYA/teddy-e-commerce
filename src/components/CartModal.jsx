import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const CartModal = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal
  } = useStore();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="cart-modal" id="cartModal" style={{ display: 'flex' }} onClick={(e) => {
      if (e.target.id === 'cartModal') setIsCartOpen(false);
    }}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="cart-modal-header">
          <h3><i className="fas fa-shopping-cart"></i> Shopping Cart</h3>
          <span className="close-cart" onClick={() => setIsCartOpen(false)}>&times;</span>
        </div>
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty" id="cartEmpty" style={{ display: 'flex' }}>
              <i className="fas fa-shopping-cart"></i>
              <p>Your cart is empty</p>
              <button className="btn btn-primary" onClick={() => setIsCartOpen(false)}>Start Shopping</button>
            </div>
          ) : (
            <div className="cart-items" id="cartItemsContainer" style={{ display: 'flex' }}>
              {cart.map((item, index) => (
                <div className="cart-item" key={`${item.id}-${item.size}-${item.color}-${index}`}>
                  <div className="cart-item-image" style={{ cursor: 'pointer' }} onClick={() => { navigate(`/product/${item.id}`); setIsCartOpen(false); }}>
                    <img 
                      src={item.image || 'toddy/raj1.jpg'} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = 'toddy/raj1.jpg'; }}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h4 style={{ cursor: 'pointer' }} onClick={() => { navigate(`/product/${item.id}`); setIsCartOpen(false); }}>{item.name}</h4>
                    {item.color && <p className="cart-item-color">Color: {item.color}</p>}
                    {item.size && <p className="cart-item-size">Size: {item.size}</p>}
                    <div className="cart-item-price">₹{item.price}</div>
                    <div className="cart-item-controls">
                      <div className="quantity-control">
                        <button className="qty-btn minus" onClick={() => updateQuantity(item.id, item.size, item.color, -1)}>-</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button className="qty-btn plus" onClick={() => updateQuantity(item.id, item.size, item.color, 1)}>+</button>
                      </div>
                      <button className="remove-item" onClick={() => removeFromCart(item.id, item.size, item.color)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="cart-summary" id="cartSummary" style={{ display: 'block' }}>
            <div className="cart-totals">
              <div className="cart-row">
                <span>Subtotal</span>
                <span id="cartSubtotal">₹{cartSubtotal}</span>
              </div>
              <div className="cart-row">
                <span>Shipping</span>
                <span id="cartShipping">{cartShipping === 0 ? 'FREE' : `₹${cartShipping}`}</span>
              </div>
              <div className="cart-row">
                <span>Discount (20%)</span>
                <span id="cartDiscount">-₹{cartDiscount.toFixed(2)}</span>
              </div>
              <div className="cart-row total">
                <strong>Total</strong>
                <strong id="cartTotal">₹{cartTotal.toFixed(2)}</strong>
              </div>
            </div>
            <div className="cart-actions">
              <button 
                className="btn btn-primary btn-block"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
              >
                <i className="fas fa-lock"></i> Proceed to Checkout
              </button>
              <button className="btn btn-outline btn-block" id="continueShopping" onClick={() => setIsCartOpen(false)}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
