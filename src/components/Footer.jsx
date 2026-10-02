import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [activePolicy, setActivePolicy] = useState(null);

  const policies = {
    privacy: {
      title: "Privacy Policy",
      icon: "fas fa-shield-alt",
      content: (
        <div>
          <p><strong>Teddy Haven</strong> is owned, operated, and maintained by <strong>Akash Kalsariya</strong>.</p>
          <p>We are committed to protecting your personal data and ensuring your shopping experience is completely safe and secure.</p>
          <ul style={{ paddingLeft: '20px', marginTop: '10px', lineHeight: '1.6' }}>
            <li><strong>Data Collection:</strong> We only collect necessary contact and shipping information to process your orders.</li>
            <li><strong>Data Security:</strong> All data is encrypted and managed under the supervision of Akash Kalsariya.</li>
            <li><strong>Third-Party Protection:</strong> We never sell, rent, or trade your personal information to third parties.</li>
            <li><strong>Policy Representative:</strong> Akash Kalsariya (Data Protection Officer & Founder).</li>
          </ul>
        </div>
      )
    },
    shipping: {
      title: "Shipping & Delivery Policy",
      icon: "fas fa-shipping-fast",
      content: (
        <div>
          <p><strong>Shipping Services by Akash Kalsariya Logistics</strong></p>
          <p>We strive to deliver your cuddly companions as fast and safely as possible!</p>
          <ul style={{ paddingLeft: '20px', marginTop: '10px', lineHeight: '1.6' }}>
            <li><strong>Order Processing:</strong> Orders are dispatched within 24-48 hours.</li>
            <li><strong>Delivery Timeline:</strong> Standard delivery takes 3-5 business days across all major regions.</li>
            <li><strong>Tracking:</strong> Real-time tracking IDs are provided upon dispatch under Akash Kalsariya's fulfillment team.</li>
            <li><strong>Free Shipping:</strong> Available on all orders over ₹499.</li>
          </ul>
        </div>
      )
    },
    returns: {
      title: "Returns & Exchange Policy",
      icon: "fas fa-exchange-alt",
      content: (
        <div>
          <p><strong>Akash Kalsariya's 100% Satisfaction Guarantee</strong></p>
          <p>If you or your loved ones are not completely happy with your bear, we make returns hassle-free.</p>
          <ul style={{ paddingLeft: '20px', marginTop: '10px', lineHeight: '1.6' }}>
            <li><strong>Return Window:</strong> 30 days hassle-free returns from delivery date.</li>
            <li><strong>Condition:</strong> Items must be unused and in original packaging with tags intact.</li>
            <li><strong>Full Refunds:</strong> Processed within 3-5 business days to original payment method upon inspection by Akash Kalsariya's quality team.</li>
          </ul>
        </div>
      )
    },
    terms: {
      title: "Terms & Conditions",
      icon: "fas fa-file-contract",
      content: (
        <div>
          <p>Welcome to <strong>Teddy Haven</strong>, operated by <strong>Akash Kalsariya</strong>.</p>
          <p>By accessing or using our platform, you agree to adhere to all terms established by Akash Kalsariya.</p>
          <ul style={{ paddingLeft: '20px', marginTop: '10px', lineHeight: '1.6' }}>
            <li><strong>Intellectual Property:</strong> All site design, images, and content are the sole property of Akash Kalsariya.</li>
            <li><strong>Account Responsibility:</strong> Users are responsible for maintaining the confidentiality of their credentials.</li>
            <li><strong>Governing Law:</strong> Governed and managed under the legal authority of Akash Kalsariya.</li>
          </ul>
        </div>
      )
    },
    contact: {
      title: "Contact & Support",
      icon: "fas fa-headset",
      content: (
        <div>
          <p>Have questions, custom requests, or need help? Reach out directly to <strong>Akash Kalsariya</strong> and our support team!</p>
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', marginTop: '15px', color: '#333' }}>
            <p style={{ margin: '5px 0' }}><i className="fas fa-user-shield" style={{ color: '#ff4d6d', marginRight: '8px' }}></i> <strong>Founder & Owner:</strong> Akash Kalsariya</p>
            <p style={{ margin: '5px 0' }}><i className="fas fa-envelope" style={{ color: '#ff4d6d', marginRight: '8px' }}></i> <strong>Email:</strong> akashkalsariya@gmail.com</p>
            <p style={{ margin: '5px 0' }}><i className="fas fa-phone" style={{ color: '#ff4d6d', marginRight: '8px' }}></i> <strong>Phone:</strong> +91 7256020750</p>
            <p style={{ margin: '5px 0' }}><i className="fas fa-clock" style={{ color: '#ff4d6d', marginRight: '8px' }}></i> <strong>Support Hours:</strong> Mon - Sat (9:00 AM - 8:00 PM)</p>
          </div>
        </div>
      )
    },
    about: {
      title: "About Akash Kalsariya & Teddy Haven",
      icon: "fas fa-info-circle",
      content: (
        <div>
          <p><strong>Teddy Haven</strong> was created by <strong>Akash Kalsariya</strong> with a passion for bringing warmth, smiles, and high-quality handcrafted teddy bears to every home.</p>
          <p>Designed and built with modern web technologies, AI features, and interactive customizers, Akash Kalsariya leads the vision for the future of interactive e-commerce.</p>
        </div>
      )
    }
  };

  return (
    <footer className="footer" id="about">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/store" className="footer-logo">
              <i className="fas fa-bear"></i>
              <span>Teddy Haven</span>
            </Link>
            <p>Bringing joy and comfort through our cuddly companions. Created by Akash Kalsariya.</p>
            <div className="social-links">
              <a href="#" className="social-link" onClick={(e) => e.preventDefault()}><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-link" onClick={(e) => e.preventDefault()}><i className="fab fa-facebook"></i></a>
              <a href="#" className="social-link" onClick={(e) => e.preventDefault()}><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-link" onClick={(e) => e.preventDefault()}><i className="fab fa-pinterest"></i></a>
              <a href="#" className="social-link" onClick={(e) => e.preventDefault()}><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-column">
              <h4>Shop</h4>
              <ul>
                <li><Link to="/store"><i className="fas fa-paw"></i> All Bears</Link></li>
                <li><Link to="/store"><i className="fas fa-star"></i> New Arrivals</Link></li>
                <li><Link to="/store"><i className="fas fa-fire"></i> Best Sellers</Link></li>
                <li><Link to="/store"><i className="fas fa-gift"></i> Gift Sets</Link></li>
                <li><Link to="/store"><i className="fas fa-tag"></i> Special Offers</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Support & Policies</h4>
              <ul>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); setActivePolicy('contact'); }}><i className="fas fa-phone"></i> Contact Us</a></li>
                <li><a href="#shipping" onClick={(e) => { e.preventDefault(); setActivePolicy('shipping'); }}><i className="fas fa-shipping-fast"></i> Shipping Info</a></li>
                <li><a href="#returns" onClick={(e) => { e.preventDefault(); setActivePolicy('returns'); }}><i className="fas fa-exchange-alt"></i> Returns & Exchange</a></li>
                <li><a href="#terms" onClick={(e) => { e.preventDefault(); setActivePolicy('terms'); }}><i className="fas fa-file-contract"></i> Terms & Conditions</a></li>
                <li><a href="#privacy" onClick={(e) => { e.preventDefault(); setActivePolicy('privacy'); }}><i className="fas fa-user-shield"></i> Privacy Policy</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); setActivePolicy('about'); }}><i className="fas fa-info"></i> About Us</a></li>
                <li><a href="#story" onClick={(e) => { e.preventDefault(); setActivePolicy('about'); }}><i className="fas fa-newspaper"></i> Our Story</a></li>
                <li><a href="#certifications" onClick={(e) => { e.preventDefault(); setActivePolicy('terms'); }}><i className="fas fa-award"></i> Certifications</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); setActivePolicy('contact'); }}><i className="fas fa-briefcase"></i> Careers</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Newsletter</h4>
              <p>Subscribe for updates and exclusive offers</p>
              <form onSubmit={(e) => e.preventDefault()} className="newsletter-form">
                <input type="email" placeholder="Your email address" required />
                <button type="submit" className="btn btn-primary"><i className="fas fa-paper-plane"></i></button>
              </form>
              <div className="payment-methods">
                <i className="fab fa-cc-visa"></i>
                <i className="fab fa-cc-mastercard"></i>
                <i className="fab fa-cc-amex"></i>
                <i className="fab fa-cc-paypal"></i>
                <i className="fab fa-cc-apple-pay"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-info">
            <p><i className="fas fa-heart" style={{ color: '#ff4d6d' }}></i> Crafted with Passion By <strong>Akash Kalsariya</strong></p>
            <p><i className="fas fa-phone"></i> Support: +91 9879331257</p>
            <p><i className="fas fa-envelope"></i> akashkalsariya@gmail.com</p>
          </div>
          <div className="copyright">
            <p>&copy; 2026 Teddy Haven. All Policies & Rights Reserved by Akash Kalsariya.</p>
          </div>
        </div>
      </div>

      {/* Interactive Policy Modal */}
      {activePolicy && policies[activePolicy] && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActivePolicy(null)}
        >
          <div
            style={{
              background: '#ffffff',
              color: '#2d3748',
              borderRadius: '20px',
              maxWidth: '550px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '30px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              animation: 'fadeIn 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePolicy(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                border: 'none',
                background: '#edf2f7',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#4a5568',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              &times;
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <i className={policies[activePolicy].icon} style={{ fontSize: '24px', color: '#ff4d6d' }}></i>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>
                {policies[activePolicy].title}
              </h2>
            </div>
            <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568' }}>
              {policies[activePolicy].content}
            </div>
            <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
              <button
                onClick={() => setActivePolicy(null)}
                className="btn btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #ff4d6d, #ff758f)',
                  border: 'none',
                  padding: '8px 24px',
                  borderRadius: '25px',
                  color: '#fff',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
