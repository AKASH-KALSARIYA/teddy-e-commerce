import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const UserPopup = () => {
  const {
    currentUser,
    isUserPopupOpen,
    setIsUserPopupOpen,
    login,
    signup,
    logout,
    orders,
    wishlist,
    addresses,
    setIsCartOpen,
    setIsWishlistOpen
  } = useStore();

  const [authMode, setAuthMode] = useState('menu'); // 'menu' | 'login' | 'signup'
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form states
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [termsAgree, setTermsAgree] = useState(false);

  const navigate = useNavigate();

  if (!isUserPopupOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const result = login(loginEmail, loginPassword);
    if (result.success) {
      setIsUserPopupOpen(false);
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!termsAgree) {
      alert("Please agree to the Terms & Conditions.");
      return;
    }
    const result = signup(
      signupFirstName,
      signupLastName,
      signupEmail,
      signupPhone,
      signupPassword
    );
    if (result.success) {
      setIsUserPopupOpen(false);
      setSignupFirstName('');
      setSignupLastName('');
      setSignupEmail('');
      setSignupPhone('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      setTermsAgree(false);
    }
  };

  const handleLinkClick = (path) => {
    setIsUserPopupOpen(false);
    navigate(path);
  };

  return (
    <div 
      className="user-popup show" 
      id="userPopup"
      style={{ display: 'block', position: 'fixed', top: '70px', right: '20px', zIndex: 1000 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="user-popup-content">
        <div className="user-popup-header">
          <h3><i className="fas fa-user-circle"></i> Account</h3>
          <p>Manage your Teddy Haven account</p>
          <span 
            className="close-user-menu" 
            style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer', fontSize: '20px' }}
            onClick={() => {
              setIsUserPopupOpen(false);
              setAuthMode('menu');
            }}
          >
            &times;
          </span>
        </div>
        <div className="user-popup-body" style={{ padding: '15px' }}>
          
          {/* GUEST VIEW - MENU */}
          {!currentUser.isLoggedIn && authMode === 'menu' && (
            <div className="guest-view" id="guestView">
              <div className="popup-section">
                <button 
                  className="popup-btn primary" 
                  id="popupLoginBtn"
                  onClick={() => setAuthMode('login')}
                  style={{ width: '100%', marginBottom: '10px' }}
                >
                  <i className="fas fa-sign-in-alt"></i> Login to Account
                </button>
                <button 
                  className="popup-btn secondary" 
                  id="popupSignupBtn"
                  onClick={() => setAuthMode('signup')}
                  style={{ width: '100%' }}
                >
                  <i className="fas fa-user-plus"></i> Create Account
                </button>
              </div>
              <div className="popup-section" style={{ marginTop: '15px' }}>
                <h4>Benefits of Account:</h4>
                <ul className="benefits-list" style={{ listStyle: 'none', paddingLeft: '0', marginTop: '10px' }}>
                  <li><i className="fas fa-check" style={{ color: '#2575fc', marginRight: '8px' }}></i> Track orders</li>
                  <li><i className="fas fa-check" style={{ color: '#2575fc', marginRight: '8px' }}></i> Save wishlist</li>
                  <li><i className="fas fa-check" style={{ color: '#2575fc', marginRight: '8px' }}></i> Fast checkout</li>
                  <li><i className="fas fa-check" style={{ color: '#2575fc', marginRight: '8px' }}></i> Exclusive offers</li>
                </ul>
              </div>
            </div>
          )}

          {/* GUEST VIEW - LOGIN FORM */}
          {!currentUser.isLoggedIn && authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label required">Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label required">Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required 
                />
              </div>
              <button type="submit" className="popup-btn primary" style={{ width: '100%', marginTop: '10px' }}>
                Login
              </button>
              <button 
                type="button" 
                className="popup-btn secondary" 
                onClick={() => setAuthMode('menu')}
                style={{ width: '100%' }}
              >
                Back
              </button>
            </form>
          )}

          {/* GUEST VIEW - SIGNUP FORM */}
          {!currentUser.isLoggedIn && authMode === 'signup' && (
            <form 
              onSubmit={handleSignupSubmit} 
              style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}
            >
              <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label required">First Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={signupFirstName}
                    onChange={(e) => setSignupFirstName(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label required">Last Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={signupLastName}
                    onChange={(e) => setSignupLastName(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label required">Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label required">Phone</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label required">Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label required">Confirm Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  id="popupAgree" 
                  checked={termsAgree}
                  onChange={(e) => setTermsAgree(e.target.checked)}
                  required 
                />
                <label htmlFor="popupAgree" style={{ fontSize: '0.85rem' }}>Agree to Terms & Conditions</label>
              </div>
              <button type="submit" className="popup-btn primary" style={{ width: '100%', marginTop: '10px' }}>
                Register
              </button>
              <button 
                type="button" 
                className="popup-btn secondary" 
                onClick={() => setAuthMode('menu')}
                style={{ width: '100%' }}
              >
                Back
              </button>
            </form>
          )}

          {/* LOGGED IN USER VIEW */}
          {currentUser.isLoggedIn && (
            <div className="user-view" id="userView" style={{ display: 'block' }}>
              <div className="user-info-popup" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <div className="avatar-popup" style={{ fontSize: '2.5rem', color: '#2575fc' }}>
                  {currentUser.profilePic ? (
                    <img 
                      src={currentUser.profilePic} 
                      alt="Avatar" 
                      style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <i className="fas fa-user-circle"></i>
                  )}
                </div>
                <div className="user-details">
                  <h4 id="popupUserName">{currentUser.name || 'User'}</h4>
                  <p id="popupUserEmail" style={{ fontSize: '0.85rem', color: '#666' }}>{currentUser.email}</p>
                </div>
              </div>
              
              <div className="popup-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <button onClick={() => handleLinkClick('/orders')} className="popup-link" style={{ background: 'none', border: 'none', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', width: '100%', fontWeight: '600', color: '#ff758c' }}>
                  <span><i className="fas fa-tachometer-alt" style={{ marginRight: '10px', color: '#ff758c' }}></i> My Dashboard</span>
                  <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', color: '#ff758c' }}></i>
                </button>
                
                <button onClick={() => handleLinkClick('/orders#profile')} className="popup-link" style={{ background: 'none', border: 'none', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
                  <span><i className="fas fa-user" style={{ marginRight: '10px', color: '#2575fc' }}></i> My Profile</span>
                  <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', color: '#ccc' }}></i>
                </button>
                
                <button onClick={() => handleLinkClick('/orders#orders')} className="popup-link" style={{ background: 'none', border: 'none', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
                  <span><i className="fas fa-shopping-bag" style={{ marginRight: '10px', color: '#2575fc' }}></i> My Orders</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span className="badge" style={{ background: '#2575fc', color: 'white', borderRadius: '10px', padding: '2px 8px', fontSize: '0.75rem' }}>{orders.length}</span>
                    <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', color: '#ccc' }}></i>
                  </div>
                </button>
                
                <button 
                  onClick={() => {
                    setIsUserPopupOpen(false);
                    setIsWishlistOpen(true);
                  }} 
                  className="popup-link" 
                  style={{ background: 'none', border: 'none', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', width: '100%' }}
                >
                  <span><i className="fas fa-heart" style={{ marginRight: '10px', color: '#2575fc' }}></i> My Wishlist</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span className="badge" style={{ background: '#2575fc', color: 'white', borderRadius: '10px', padding: '2px 8px', fontSize: '0.75rem' }}>{wishlist.length}</span>
                    <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', color: '#ccc' }}></i>
                  </div>
                </button>
                
                <button onClick={() => handleLinkClick('/orders#addresses')} className="popup-link" style={{ background: 'none', border: 'none', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
                  <span><i className="fas fa-address-book" style={{ marginRight: '10px', color: '#2575fc' }}></i> Address Book</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span className="badge" style={{ background: '#2575fc', color: 'white', borderRadius: '10px', padding: '2px 8px', fontSize: '0.75rem' }}>{addresses.length}</span>
                    <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', color: '#ccc' }}></i>
                  </div>
                </button>
              </div>

              <div className="popup-section" style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginTop: '10px' }}>
                <button 
                  className="popup-btn logout" 
                  id="popupLogoutBtn"
                  onClick={() => {
                    logout();
                    setIsUserPopupOpen(false);
                  }}
                  style={{ width: '100%' }}
                >
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPopup;
