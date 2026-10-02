import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

import Header from '../components/Header';
import Footer from '../components/Footer';
import CartModal from '../components/CartModal';
import WishlistModal from '../components/WishlistModal';
import UserPopup from '../components/UserPopup';

import '../styles/Checkout.css';

const Checkout = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    addOrder,
    clearCart,
    currentUser,
    addAddress,
    showToast
  } = useStore();

  const navigate = useNavigate();

  // Stepper state: 1 = Shipping, 2 = Payment, 3 = Confirm
  const [step, setStep] = useState(1);

  // Form Fields - Shipping
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [address, setAddress] = useState(currentUser.address || '');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [instructions, setInstructions] = useState('');
  const [saveAddress, setSaveAddress] = useState(false);

  // Form Fields - Payment
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi'
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');

  // Loading Indicator
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  // Validation
  const validateShipping = () => {
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !pincode) {
      showToast('Please fill in all required fields.', 'error');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return false;
    }
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      showToast('Please enter a valid 10-digit phone number.', 'error');
      return false;
    }
    if (pincode.trim().length !== 6) {
      showToast('PIN code must be exactly 6 digits.', 'error');
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        showToast('Please fill in all card details.', 'error');
        return false;
      }
      if (cardNumber.replace(/\s/g, '').length < 15) {
        showToast('Please enter a valid card number.', 'error');
        return false;
      }
      if (cardCvv.length < 3) {
        showToast('Please enter a valid CVV.', 'error');
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        showToast('Please enter a valid UPI ID (e.g. user@bank).', 'error');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateShipping()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validatePayment()) {
        setStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirmOrder = () => {
    setIsProcessing(true);
    showToast('Processing your payment...', 'info');

    // Simulate Payment processing delay
    setTimeout(() => {
      // Compile order data
      const orderData = {
        items: cart,
        total: cartTotal - couponDiscount,
        customerName: `${firstName} ${lastName}`,
        phone: phone,
        email: email,
        paymentMethod: paymentMethod.toUpperCase(),
        address: {
          name: `${firstName} ${lastName}`,
          street: address + (landmark ? `, Near ${landmark}` : ''),
          city: city,
          state: state,
          pincode: pincode,
          phone: phone
        }
      };

      // Add to Order History
      const orderId = addOrder(orderData);

      // Save latest order info for ThankYou page references
      localStorage.setItem('lastOrder', JSON.stringify({
        id: orderId,
        total: cartTotal,
        date: new Date().toLocaleDateString('en-IN'),
        email: email
      }));

      // Optionally save address to account address book
      if (saveAddress) {
        addAddress({
          name: `${firstName} ${lastName}`,
          phone: phone,
          pincode: pincode,
          addressText: address,
          city: city,
          state: state,
          landmark: landmark,
          isDefault: addresses.length === 0
        });
      }

      // Clear the Cart
      clearCart();

      setIsProcessing(false);
      navigate('/thankyou');
    }, 2000);
  };

  if (cart.length === 0 && !isProcessing) {
    return (
      <div className="store-page">
        <Header />
        <section className="checkout-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="empty-cart-message">
            <i className="fas fa-shopping-cart"></i>
            <h3>Your cart is empty</h3>
            <p>You don't have any items in your cart. Start shopping to proceed to checkout!</p>
            <button className="btn btn-primary" onClick={() => navigate('/store')}>Start Shopping</button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="store-page">
      <Header />

      <section className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-header">
            <h1><i className="fas fa-lock"></i> Secure Checkout</h1>
            <p>Complete your purchase in just a few steps</p>
          </div>

          {/* Stepper Progress bar */}
          <div className="checkout-progress">
            <div className="progress-line"></div>
            <div 
              className="progress-fill" 
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            ></div>
            
            <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-circle">{step > 1 ? '✓' : '1'}</div>
              <div className="step-label">Shipping</div>
            </div>
            
            <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-circle">{step > 2 ? '✓' : '2'}</div>
              <div className="step-label">Payment</div>
            </div>
            
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-circle">3</div>
              <div className="step-label">Confirm</div>
            </div>
          </div>

          <div className="checkout-content">
            {/* Form Steps */}
            <div className="checkout-form-container">
              
              {/* STEP 1: SHIPPING */}
              {step === 1 && (
                <div className="form-section active">
                  <div className="section-header">
                    <div className="section-icon"><i className="fas fa-truck"></i></div>
                    <div>
                      <h2 className="section-title">Shipping Information</h2>
                      <p>Where should we deliver your order?</p>
                    </div>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label required">First Name</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={firstName} 
                          onChange={(e) => setFirstName(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label required">Last Name</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={lastName} 
                          onChange={(e) => setLastName(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label required">Email Address</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label required">Phone Number</label>
                      <input 
                        type="tel" 
                        className="form-input" 
                        placeholder="10-digit number"
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label required">Address</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Street address, apartment, building"
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        required 
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label required">City</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={city} 
                          onChange={(e) => setCity(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label required">State</label>
                        <select 
                          className="form-select" 
                          value={state} 
                          onChange={(e) => setState(e.target.value)} 
                          required
                        >
                          <option value="">Select State</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="West Bengal">West Bengal</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label required">PIN Code</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={pincode} 
                          onChange={(e) => setPincode(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Landmark (Optional)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={landmark} 
                          onChange={(e) => setLandmark(e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Delivery Instructions</label>
                      <textarea 
                        className="form-textarea" 
                        placeholder="Leave at gate, ring bell, call before arrival, etc."
                        value={instructions} 
                        onChange={(e) => setInstructions(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="saveAddress" 
                        checked={saveAddress} 
                        onChange={(e) => setSaveAddress(e.target.checked)} 
                      />
                      <label htmlFor="saveAddress">Save this address to my profile</label>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 2: PAYMENT */}
              {step === 2 && (
                <div className="form-section active">
                  <div className="section-header">
                    <div className="section-icon"><i className="fas fa-credit-card"></i></div>
                    <div>
                      <h2 className="section-title">Payment Method</h2>
                      <p>Choose how you want to pay</p>
                    </div>
                  </div>

                  <div className="payment-methods">
                    <div 
                      className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <i className="fas fa-credit-card"></i>
                      <h4>Credit/Debit Card</h4>
                      <p>Pay securely with your card</p>
                    </div>
                    <div 
                      className={`payment-method ${paymentMethod === 'upi' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <i className="fas fa-mobile-alt"></i>
                      <h4>UPI</h4>
                      <p>Pay using Google Pay, PhonePe, Paytm</p>
                    </div>
                  </div>

                  {paymentMethod === 'card' ? (
                    <div className="card-details active">
                      <div className="form-group">
                        <label className="form-label required">Cardholder Name</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Name on card"
                          value={cardName} 
                          onChange={(e) => setCardName(e.target.value)} 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label required">Card Number</label>
                        <div className="card-input-group">
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="1234 5678 9101 1121"
                            maxLength="19"
                            value={cardNumber} 
                            onChange={(e) => {
                              // format card spacing
                              const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                              setCardNumber(val);
                            }} 
                          />
                          <i className="fas fa-credit-card card-icon"></i>
                        </div>
                      </div>
                      <div className="card-row">
                        <div className="form-group">
                          <label className="form-label required">Expiry Date</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="MM/YY"
                            maxLength="5"
                            value={cardExpiry} 
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length > 2) {
                                val = val.substring(0,2) + '/' + val.substring(2,4);
                              }
                              setCardExpiry(val);
                            }} 
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label required">CVV</label>
                          <input 
                            type="password" 
                            className="form-input" 
                            placeholder="123"
                            maxLength="3"
                            value={cardCvv} 
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))} 
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="card-details active" style={{ backgroundColor: '#f0f4ff' }}>
                      <div className="form-group">
                        <label className="form-label required">UPI ID</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="username@bank"
                          value={upiId} 
                          onChange={(e) => setUpiId(e.target.value)} 
                        />
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
                        <i className="fas fa-info-circle"></i> Enter your UPI ID and click confirm. A request will be sent to your UPI app.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: CONFIRM */}
              {step === 3 && (
                <div className="form-section active">
                  <div className="section-header">
                    <div className="section-icon" style={{ backgroundColor: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50' }}><i className="fas fa-clipboard-check"></i></div>
                    <div>
                      <h2 className="section-title">Confirm Your Order</h2>
                      <p>Please review your details before placing the order</p>
                    </div>
                  </div>

                  <div className="order-details" style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                      <h4 style={{ color: '#2575fc', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '8px' }}>Shipping Address</h4>
                      <p style={{ fontWeight: 'bold' }}>{firstName} {lastName}</p>
                      <p>{address}</p>
                      <p>{city}, {state} - {pincode}</p>
                      <p>Phone: {phone}</p>
                      <p>Email: {email}</p>
                    </div>

                    <div>
                      <h4 style={{ color: '#2575fc', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '8px' }}>Payment Method</h4>
                      <p style={{ textTransform: 'capitalize' }}>
                        {paymentMethod === 'card' ? `Credit/Debit Card (Ending in ${cardNumber.slice(-4)})` : `UPI (ID: ${upiId})`}
                      </p>
                    </div>

                    {instructions && (
                      <div>
                        <h4 style={{ color: '#2575fc', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '8px' }}>Delivery Instructions</h4>
                        <p style={{ fontStyle: 'italic' }}>{instructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="checkout-actions" style={{ marginTop: '30px' }}>
                {step > 1 && (
                  <button className="btn btn-outline btn-back" onClick={handlePrevStep} disabled={isProcessing}>
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button className="btn btn-primary btn-continue" onClick={handleNextStep}>
                    Continue
                  </button>
                ) : (
                  <button className="btn btn-confirm" onClick={handleConfirmOrder} disabled={isProcessing}>
                    {isProcessing ? 'Placing Order...' : 'Place Order & Pay'}
                  </button>
                )}
              </div>

            </div>

            {/* Sidebar Summary */}
            <div className="checkout-summary">
              <div className="summary-header">
                <i className="fas fa-shopping-bag"></i>
                <h3>Order Summary</h3>
              </div>
              <div className="order-items-summary">
                {cart.map((item, index) => (
                  <div className="order-item" key={`${item.id}-${index}`}>
                    <div className="item-image">
                      <img src={item.image || 'toddy/raj1.jpg'} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <div className="item-name">{item.name}</div>
                      <div className="item-variants">{item.color} • {item.size}</div>
                      <div className="item-variants">Qty: {item.quantity}</div>
                      <div className="item-price">₹{item.price * item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
                      <div className="coupon-row">
                <input 
                  type="text" 
                  className="form-input coupon-input" 
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponMessage('');
                  }}
                />
                <button 
                  type="button" 
                  className="btn btn-secondary coupon-btn"
                  onClick={() => {
                    const code = couponCode.trim().toUpperCase();
                    if (code === 'TODDY20') {
                      const discountValue = Math.min(250, cartSubtotal * 0.2);
                      setCouponDiscount(discountValue);
                      setCouponMessage(`Coupon applied! You saved ₹${discountValue.toFixed(0)}`);
                      showToast('Coupon applied successfully!', 'success');
                    } else if (code === 'BUNDLE15') {
                      const discountValue = Math.min(300, cartSubtotal * 0.15);
                      setCouponDiscount(discountValue);
                      setCouponMessage(`Bundle code applied! You saved ₹${discountValue.toFixed(0)}`);
                      showToast('Coupon applied successfully!', 'success');
                    } else {
                      setCouponDiscount(0);
                      setCouponMessage('Invalid coupon code.');
                      showToast('Coupon is not valid.', 'error');
                    }
                  }}
                >
                  Apply
                </button>
              </div>
              {couponMessage && <div className="coupon-message">{couponMessage}</div>}
              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                <div className="total-row">
                  <span>Discount (20%)</span>
                  <span>-₹{cartDiscount.toFixed(2)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="total-row">
                    <span>Coupon Savings</span>
                    <span>-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="total-row">
                  <span>Shipping</span>
                  <span>{cartShipping === 0 ? 'FREE' : `₹${cartShipping}`}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>₹{(cartTotal - couponDiscount).toFixed(2)}</span>
                </div>
              </div>
              <div className="secure-checkout-badge">
                <i className="fas fa-shield-alt"></i>
                <span>SSL Secured Transaction</span>
              </div>
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

export default Checkout;
