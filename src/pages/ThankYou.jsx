import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

import Header from '../components/Header';
import Footer from '../components/Footer';
import CartModal from '../components/CartModal';
import WishlistModal from '../components/WishlistModal';
import UserPopup from '../components/UserPopup';

const ThankYou = () => {
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState({ id: '', total: 0 });

  useEffect(() => {
    // Attempt to load latest placed order info
    const stored = localStorage.getItem('lastOrder');
    if (stored) {
      setOrderInfo(JSON.parse(stored));
    } else {
      // Fallback randomized ID
      const randomId = 'TH-' + Math.floor(100000000 + Math.random() * 900000000);
      setOrderInfo({ id: randomId, total: 1299 });
    }
  }, []);

  return (
    <div className="store-page">
      <Header />

      <section className="thank-you" style={{ padding: '80px 0', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div className="thank-you-content" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
            <div className="thank-you-icon" style={{ fontSize: '5rem', color: '#2ed573', marginBottom: '20px' }}>
              <i className="fas fa-check-circle"></i>
            </div>
            
            <h1 style={{ fontSize: '2.5rem', marginBottom: '15px', color: '#2c3e50' }}>Thank You for Your Order!</h1>
            
            <div className="order-confirmation" style={{ backgroundColor: '#f9f9f9', padding: '15px 25px', borderRadius: '8px', display: 'inline-block', marginBottom: '30px' }}>
              <p>Your order has been confirmed and will be shipped within 24 hours.</p>
              <p className="order-id" style={{ marginTop: '10px', fontSize: '1.1rem' }}>Order ID: <strong>{orderInfo.id}</strong></p>
              {orderInfo.total > 0 && <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>Amount Paid: ₹{orderInfo.total.toFixed(2)}</p>}
            </div>
            
            <div className="delivery-info" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div className="info-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
                <i className="fas fa-shipping-fast" style={{ fontSize: '2rem', color: '#2575fc', marginBottom: '10px' }}></i>
                <h3>Delivery Timeline</h3>
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>Expected delivery:<br/><strong>2-4 business days</strong></p>
              </div>
              
              <div className="info-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
                <i className="fas fa-envelope" style={{ fontSize: '2rem', color: '#2575fc', marginBottom: '10px' }}></i>
                <h3>Email Confirmation</h3>
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>A confirmation email has been sent to your registered email address</p>
              </div>
              
              <div className="info-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
                <i className="fas fa-headset" style={{ fontSize: '2rem', color: '#2575fc', marginBottom: '10px' }}></i>
                <h3>Need Help?</h3>
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>Contact our support team at<br/><strong>support@teddyhaven.com</strong></p>
              </div>
            </div>
            
            <div className="thank-you-actions" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/store')}>
                <i className="fas fa-home"></i> Back to Home
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => alert('Downloading invoice... (Simulation)')}>
                <i className="fas fa-download"></i> Download Invoice
              </button>
            </div>
            
            <div className="continue-shopping" style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <p style={{ color: '#666', marginBottom: '10px' }}>Continue browsing our collection</p>
              <button className="btn btn-secondary" onClick={() => navigate('/store#collections')}>
                <i className="fas fa-shopping-bag"></i> Shop More Teddies
              </button>
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

export default ThankYou;
