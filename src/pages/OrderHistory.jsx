import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { productsData } from '../data/products';

import Header from '../components/Header';
import Footer from '../components/Footer';
import CartModal from '../components/CartModal';
import WishlistModal from '../components/WishlistModal';
import UserPopup from '../components/UserPopup';

import '../styles/OrderHistory.css';

const OrderHistory = () => {
  const {
    currentUser,
    updateProfile,
    updateProfilePic,
    orders,
    cancelOrder,
    reorder,
    addresses,
    addAddress,
    deleteAddress,
    wishlist,
    toggleWishlist,
    addToCart,
    settings,
    setSettings,
    showToast
  } = useStore();

  const location = useLocation();
  const navigate = useNavigate();

  // Active tab state: 'orders' | 'profile' | 'addresses' | 'wishlist' | 'settings'
  const [activeTab, setActiveTab] = useState('orders');

  // Order filters state: 'all' | 'pending' | 'processing' | 'delivered' | 'cancelled'
  const [orderFilter, setOrderFilter] = useState('all');

  // Selected order details modal state
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Profile Edit fields
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser.email || '');
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || '');
  const [profileAddress, setProfileAddress] = useState(currentUser.address || '');

  // Add Address Modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressName, setAddressName] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [addressPincode, setAddressPincode] = useState('');
  const [addressText, setAddressText] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressLandmark, setAddressLandmark] = useState('');
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);

  // Settings states
  const [emailNotifications, setEmailNotifications] = useState(settings.emailNotifications);
  const [smsNotifications, setSmsNotifications] = useState(settings.smsNotifications);
  const [pushNotifications, setPushNotifications] = useState(settings.pushNotifications);
  const [lang, setLang] = useState(settings.language || 'en');
  const [currency, setCurrency] = useState(settings.currency || 'INR');
  const [visibility, setVisibility] = useState(settings.profileVisibility || 'friends');
  const [dataSharing, setDataSharing] = useState(settings.dataSharing || false);
  const [tracking, setTracking] = useState(settings.activityTracking || true);

  // Sync tab with URL hash on load/change
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    const validTabs = ['profile', 'orders', 'addresses', 'wishlist', 'settings'];
    if (validTabs.includes(hash)) {
      setActiveTab(hash);
    } else {
      setActiveTab('orders');
    }
  }, [location.hash]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    navigate(`/orders#${tabName}`);
  };

  // --- Profile handlers ---
  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!profileName || !profileEmail || !profilePhone || !profileAddress) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    updateProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      address: profileAddress
    });
    setIsEditingProfile(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size must be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        updateProfilePic(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Address Handlers ---
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressName || !addressPhone || !addressPincode || !addressText || !addressCity || !addressState) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    addAddress({
      name: addressName,
      phone: addressPhone,
      pincode: addressPincode,
      addressText: addressText,
      city: addressCity,
      state: addressState,
      landmark: addressLandmark,
      isDefault: isDefaultAddress
    });
    // Reset fields
    setAddressName('');
    setAddressPhone('');
    setAddressPincode('');
    setAddressText('');
    setAddressCity('');
    setAddressState('');
    setAddressLandmark('');
    setIsDefaultAddress(false);
    setIsAddressModalOpen(false);
  };

  // --- Settings Handlers ---
  const handleSaveSettings = () => {
    setSettings({
      emailNotifications,
      smsNotifications,
      pushNotifications,
      language: lang,
      currency,
      profileVisibility: visibility,
      dataSharing,
      activityTracking: tracking
    });
    showToast('Settings saved successfully!', 'success');
  };

  const handleResetSettings = () => {
    setEmailNotifications(true);
    setSmsNotifications(false);
    setPushNotifications(true);
    setLang('en');
    setCurrency('INR');
    setVisibility('friends');
    setDataSharing(false);
    setTracking(true);
    showToast('Settings reset to default.', 'info');
  };

  // --- Order action handlers ---
  const handleTrackOrder = (order) => {
    alert(`Order Tracking\nTracking ID: ${order.trackingId}\nStatus: ${order.status.toUpperCase()}\nEstimated Delivery: ${order.estimatedDelivery}`);
  };

  const handleReorder = (order) => {
    reorder(order.id);
    navigate('/checkout');
  };

  const filteredOrders = orderFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === orderFilter);

  return (
    <div className="store-page">
      <Header />

      <div className="container" style={{ marginTop: '40px', marginBottom: '8px' }}>
        <h1 className="page-title">
          <i className="fas fa-user-cog" style={{ color: 'var(--primary)', marginRight: '10px' }}></i>
          My Account Dashboard
        </h1>

        <div className="dashboard-page">
          <div className="dashboard-container">
            
            {/* Sidebar */}
            <div className="dashboard-sidebar">
              <div className="dashboard-user">
                <div className="user-avatar" id="userAvatar">
                  {currentUser.profilePic ? (
                    <img src={currentUser.profilePic} alt="Profile" className="sidebar-profile-pic" />
                  ) : (
                    <div className="sidebar-avatar-placeholder">
                      <i className="fas fa-user-circle"></i>
                    </div>
                  )}
                </div>
                <h3>{currentUser.name || 'Guest User'}</h3>
                <p>Welcome to Teddy Haven</p>
              </div>
              
              <nav className="dashboard-menu">
                <button 
                  onClick={() => handleTabClick('profile')} 
                  className={`dashboard-menu-item ${activeTab === 'profile' ? 'active' : ''}`}
                >
                  <i className="fas fa-user"></i>
                  <span>My Profile</span>
                </button>
                <button 
                  onClick={() => handleTabClick('orders')} 
                  className={`dashboard-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
                >
                  <i className="fas fa-box"></i>
                  <span>My Orders</span>
                  {orders.length > 0 && (
                    <span className="menu-badge">{orders.length}</span>
                  )}
                </button>
                <button 
                  onClick={() => handleTabClick('addresses')} 
                  className={`dashboard-menu-item ${activeTab === 'addresses' ? 'active' : ''}`}
                >
                  <i className="fas fa-address-book"></i>
                  <span>Address Book</span>
                </button>
                <button 
                  onClick={() => handleTabClick('wishlist')} 
                  className={`dashboard-menu-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                >
                  <i className="fas fa-heart"></i>
                  <span>My Wishlist</span>
                  {wishlist.length > 0 && (
                    <span className="menu-badge">{wishlist.length}</span>
                  )}
                </button>
                <button 
                  onClick={() => handleTabClick('settings')} 
                  className={`dashboard-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
                >
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </button>
              </nav>
            </div>

            {/* Main Panel Content */}
            <div className="dashboard-content" id="accountContent">
            
            {/* 1. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="account-section">
                <h2 style={{ borderBottom: '2px solid var(--gray)', paddingBottom: '10px', marginBottom: '20px' }}>
                  <i className="fas fa-user-circle"></i> Profile Details
                </h2>

                <div className="profile-header" style={{ display: 'flex', gap: '20px', marginBottom: '35px' }}>
                  <div className="profile-avatar" style={{ position: 'relative' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: '#ccc' }}>
                      {currentUser.profilePic ? (
                        <img src={currentUser.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <i className="fas fa-user-circle"></i>
                      )}
                    </div>
                    <input 
                      type="file" 
                      id="profilePicFile" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={handlePhotoUpload}
                    />
                    <button 
                      className="btn-change-photo"
                      onClick={() => document.getElementById('profilePicFile').click()}
                      style={{ width: '100%', marginTop: '8px', padding: '4px', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      <i className="fas fa-camera"></i> {currentUser.profilePic ? 'Change' : 'Upload'} Photo
                    </button>
                  </div>
                  <div className="profile-info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2>{currentUser.name || 'Guest User'}</h2>
                    <p style={{ color: '#666', marginTop: '5px' }}><i className="fas fa-envelope"></i> {currentUser.email || 'No email provided'}</p>
                    <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '5px' }}><i className="fas fa-calendar-alt"></i> Member since {currentUser.joinDate}</p>
                  </div>
                </div>

                {!isEditingProfile ? (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <strong>Full Name:</strong>
                        <p>{currentUser.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <strong>Email Address:</strong>
                        <p>{currentUser.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <strong>Phone Number:</strong>
                        <p>{currentUser.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <strong>Default Address:</strong>
                        <p>{currentUser.address || 'Not provided'}</p>
                      </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => {
                      setProfileName(currentUser.name || '');
                      setProfileEmail(currentUser.email || '');
                      setProfilePhone(currentUser.phone || '');
                      setProfileAddress(currentUser.address || '');
                      setIsEditingProfile(true);
                    }}>
                      <i className="fas fa-edit"></i> Edit Profile
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                      <label className="form-label required">Full Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={profileName} 
                        onChange={(e) => setProfileName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label required">Email Address</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        value={profileEmail} 
                        onChange={(e) => setProfileEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label required">Phone Number</label>
                      <input 
                        type="tel" 
                        className="form-input" 
                        value={profilePhone} 
                        onChange={(e) => setProfilePhone(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label required">Address</label>
                      <textarea 
                        className="form-textarea" 
                        value={profileAddress} 
                        onChange={(e) => setProfileAddress(e.target.value)} 
                        required 
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="btn btn-primary">Save Changes</button>
                      <button type="button" className="btn btn-outline" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                    </div>
                  </form>
                )}

              </div>
            )}

            {/* 2. ORDERS HISTORY TAB */}
            {activeTab === 'orders' && (
              <div className="account-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--gray)', paddingBottom: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <h2><i className="fas fa-history"></i> Order History</h2>
                  
                  <div className="orders-filter" style={{ display: 'flex', gap: '5px' }}>
                    {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                      <button 
                        key={status}
                        className={`filter-btn ${orderFilter === status ? 'active' : ''}`}
                        onClick={() => setOrderFilter(status)}
                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
                    <i className="fas fa-box-open" style={{ fontSize: '3rem', color: '#ccc', marginBottom: '15px' }}></i>
                    <h3>No orders found</h3>
                    <p>You haven't placed any orders matching this status yet.</p>
                  </div>
                ) : (
                  <div className="orders-list">
                    {filteredOrders.map(order => (
                      <div className={`order-card status-${order.status}`} key={order.id} style={{ borderLeft: '5px solid ' + (order.status === 'delivered' ? '#2ed573' : order.status === 'cancelled' ? '#ff4757' : '#2575fc') }}>
                        <div className="order-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <h4>Order #{order.id}</h4>
                            <p className="order-date">Date: {order.date}</p>
                          </div>
                          <span className={`order-status ${order.status}`}>{order.status}</span>
                        </div>
                        <div className="order-items" style={{ margin: '15px 0' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                              {order.items.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '8px 0' }}>
                                    <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '10px' }}>({item.color} • {item.size})</span>
                                  </td>
                                  <td style={{ textAlign: 'right', padding: '8px 0' }}>{item.quantity} × ₹{item.price}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="order-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div><strong>Total: ₹{order.total}</strong></div>
                          <div className="order-actions" style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-outline btn-sm" onClick={() => setSelectedOrder(order)}>View Details</button>
                            {order.status === 'shipped' && <button className="btn btn-outline btn-sm" onClick={() => handleTrackOrder(order)}>Track</button>}
                            {order.status === 'processing' && <button className="btn btn-danger btn-sm" onClick={() => cancelOrder(order.id)}>Cancel</button>}
                            {(order.status === 'delivered' || order.status === 'cancelled') && (
                              <button className="btn btn-primary btn-sm" onClick={() => handleReorder(order)}>Reorder</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* 3. ADDRESS TAB */}
            {activeTab === 'addresses' && (
              <div className="account-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--gray)', paddingBottom: '10px', marginBottom: '20px' }}>
                  <h2><i className="fas fa-address-book"></i> Address Book</h2>
                  <button className="btn btn-primary btn-sm" onClick={() => setIsAddressModalOpen(true)}>
                    <i className="fas fa-plus"></i> Add Address
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="no-addresses" style={{ textAlign: 'center', padding: '40px' }}>
                    <i className="fas fa-map-marker-alt" style={{ fontSize: '3rem', color: '#ccc', marginBottom: '15px' }}></i>
                    <h3>No addresses saved yet</h3>
                    <p>Save addresses to speed up checkout next time.</p>
                  </div>
                ) : (
                  <div className="addresses-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {addresses.map(addr => (
                      <div className="address-card" key={addr.id} style={{ border: addr.isDefault ? '2px solid #2575fc' : '1px solid #ddd', padding: '15px', borderRadius: '8px', position: 'relative' }}>
                        {addr.isDefault && <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#eef4ff', color: '#2575fc', fontSize: '0.7rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>Default</span>}
                        <h4>{addr.name}</h4>
                        <p style={{ marginTop: '5px' }}>{addr.addressText}</p>
                        <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p>Phone: {addr.phone}</p>
                        <button 
                          onClick={() => deleteAddress(addr.id)} 
                          style={{ marginTop: '10px', background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}
                        >
                          Delete Address
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Address Modal Form Overlay */}
                {isAddressModalOpen && (
                  <div className="address-form-modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060, alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '500px', width: '90%' }}>
                      <h3><i className="fas fa-map-marker-alt"></i> Add New Address</h3>
                      <form onSubmit={handleAddressSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                        <div className="form-group">
                          <label>Full Name *</label>
                          <input type="text" className="form-input" value={addressName} onChange={(e) => setAddressName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label>Phone Number *</label>
                          <input type="tel" className="form-input" value={addressPhone} onChange={(e) => setAddressPhone(e.target.value)} required />
                        </div>
                        <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                          <div className="form-group" style={{ flex: 1 }}>
                            <label>Pincode *</label>
                            <input type="text" className="form-input" value={addressPincode} onChange={(e) => setAddressPincode(e.target.value)} required />
                          </div>
                          <div className="form-group" style={{ flex: 1 }}>
                            <label>Landmark (Optional)</label>
                            <input type="text" className="form-input" value={addressLandmark} onChange={(e) => setAddressLandmark(e.target.value)} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Street Address *</label>
                          <input type="text" className="form-input" value={addressText} onChange={(e) => setAddressText(e.target.value)} required />
                        </div>
                        <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                          <div className="form-group" style={{ flex: 1 }}>
                            <label>City *</label>
                            <input type="text" className="form-input" value={addressCity} onChange={(e) => setAddressCity(e.target.value)} required />
                          </div>
                          <div className="form-group" style={{ flex: 1 }}>
                            <label>State *</label>
                            <input type="text" className="form-input" value={addressState} onChange={(e) => setAddressState(e.target.value)} required />
                          </div>
                        </div>
                        <div className="form-check" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input type="checkbox" id="defaultAddr" checked={isDefaultAddress} onChange={(e) => setIsDefaultAddress(e.target.checked)} />
                          <label htmlFor="defaultAddr">Set as default address</label>
                        </div>
                        <div className="form-buttons" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                          <button type="submit" className="btn btn-primary">Save Address</button>
                          <button type="button" className="btn btn-outline" onClick={() => setIsAddressModalOpen(false)}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 4. WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="account-section">
                <h2 style={{ borderBottom: '2px solid var(--gray)', paddingBottom: '10px', marginBottom: '20px' }}>
                  <i className="fas fa-heart"></i> My Wishlist
                </h2>

                {wishlist.length === 0 ? (
                  <div className="empty-wishlist" style={{ textAlign: 'center', padding: '40px' }}>
                    <i className="fas fa-heart-broken" style={{ fontSize: '3rem', color: '#ccc', marginBottom: '15px' }}></i>
                    <h3>Your wishlist is empty</h3>
                    <p>Add items to your wishlist to view them here.</p>
                  </div>
                ) : (
                  <div className="wishlist-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                    {wishlist.map(product => {
                      const image = product.images && product.images.length > 0 ? product.images[0] : 'toddy/raj1.jpg';
                      return (
                        <div className="product-card" key={product.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                          <div>
                            <img src={image} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }} />
                            <h4 style={{ marginTop: '10px' }}>{product.name}</h4>
                            <p style={{ color: '#ff4757', fontWeight: 'bold', margin: '5px 0' }}>₹{product.price}</p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                            <button 
                              className="btn btn-primary btn-sm" 
                              onClick={() => {
                                addToCart(product.id, 1);
                                toggleWishlist(product.id);
                              }}
                            >
                              Add to Cart
                            </button>
                            <button className="btn btn-outline btn-sm" style={{ color: '#ff4757' }} onClick={() => toggleWishlist(product.id)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 5. SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="account-section">
                <h2 style={{ borderBottom: '2px solid var(--gray)', paddingBottom: '10px', marginBottom: '20px' }}>
                  <i className="fas fa-cog"></i> Settings
                </h2>

                <div className="settings-category" style={{ marginBottom: '25px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#2575fc', marginBottom: '15px' }}><i className="fas fa-bell"></i> Notifications</h3>
                  <div className="settings-options" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4>Email Notifications</h4>
                        <p style={{ fontSize: '0.8rem', color: '#666' }}>Receive orders update and promotional letters by email</p>
                      </div>
                      <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} />
                    </div>
                    <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4>SMS Notifications</h4>
                        <p style={{ fontSize: '0.8rem', color: '#666' }}>Receive billing details and delivery alerts by SMS</p>
                      </div>
                      <input type="checkbox" checked={smsNotifications} onChange={(e) => setSmsNotifications(e.target.checked)} />
                    </div>
                    <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4>Push Notifications</h4>
                        <p style={{ fontSize: '0.8rem', color: '#666' }}>Receive alerts directly on your browser device</p>
                      </div>
                      <input type="checkbox" checked={pushNotifications} onChange={(e) => setPushNotifications(e.target.checked)} />
                    </div>
                  </div>
                </div>

                <div className="settings-category" style={{ marginBottom: '25px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#2575fc', marginBottom: '15px' }}><i className="fas fa-globe"></i> Regional Settings</h3>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Language</label>
                      <select className="form-select" value={lang} onChange={(e) => setLang(e.target.value)} style={{ marginTop: '5px' }}>
                        <option value="en">English</option>
                        <option value="hi">Hindi (हिंदी)</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Currency</label>
                      <select className="form-select" value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ marginTop: '5px' }}>
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="settings-category" style={{ marginBottom: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#2575fc', marginBottom: '15px' }}><i className="fas fa-shield-alt"></i> Privacy Settings</h3>
                  <div className="settings-options" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4>Profile Visibility</h4>
                        <p style={{ fontSize: '0.8rem', color: '#666' }}>Who can see your profile data in leaderboard or groups</p>
                      </div>
                      <select value={visibility} onChange={(e) => setVisibility(e.target.value)} style={{ padding: '6px', borderRadius: '4px' }}>
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                    <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4>Data Sharing</h4>
                        <p style={{ fontSize: '0.8rem', color: '#666' }}>Share usage statistics to help us improve UI details</p>
                      </div>
                      <input type="checkbox" checked={dataSharing} onChange={(e) => setDataSharing(e.target.checked)} />
                    </div>
                    <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4>Activity Tracking</h4>
                        <p style={{ fontSize: '0.8rem', color: '#666' }}>Track products visited to provide customized recommendations</p>
                      </div>
                      <input type="checkbox" checked={tracking} onChange={(e) => setTracking(e.target.checked)} />
                    </div>
                  </div>
                </div>

                <div className="settings-actions" style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-primary" onClick={handleSaveSettings}>Save Settings</button>
                  <button className="btn btn-outline" onClick={handleResetSettings}>Reset Defaults</button>
                </div>
              </div>
            )}

            </div>

          </div>
        </div>
      </div>

      <Footer />

      {/* Standalone Order Details Modal */}
      {selectedOrder && (
        <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060, alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
              <h3>Order Details - #{selectedOrder.id}</h3>
              <span style={{ cursor: 'pointer', fontSize: '24px' }} onClick={() => setSelectedOrder(null)}>&times;</span>
            </div>
            <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <p><strong>Order Date:</strong> {selectedOrder.date}</p>
              <p><strong>Order Status:</strong> <span className={`order-status ${selectedOrder.status}`} style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold' }}>{selectedOrder.status}</span></p>
              <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
              {selectedOrder.trackingId && <p><strong>Tracking Number:</strong> {selectedOrder.trackingId}</p>}
              
              <h4 style={{ margin: '15px 0 8px 0', borderBottom: '1px solid #eee', paddingBottom: '3px', color: '#2575fc' }}>Items Ordered</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #eee', paddingBottom: '5px' }}>
                    <div>
                      <span><strong>{item.name}</strong></span>
                      <p style={{ fontSize: '0.8rem', color: '#666' }}>{item.color} | {item.size}</p>
                      <p style={{ fontSize: '0.8rem', color: '#666' }}>Quantity: {item.quantity}</p>
                    </div>
                    <div>₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              <h4 style={{ margin: '15px 0 8px 0', borderBottom: '1px solid #eee', paddingBottom: '3px', color: '#2575fc' }}>Shipping Address</h4>
              {selectedOrder.address ? (
                <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                  <p><strong>{selectedOrder.address.name}</strong></p>
                  <p>{selectedOrder.address.street}</p>
                  <p>{selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}</p>
                  <p>Phone: {selectedOrder.address.phone}</p>
                </div>
              ) : (
                <p>No address details available.</p>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '2px solid #eee', paddingTop: '10px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                <span>Total Paid:</span>
                <span>₹{selectedOrder.total}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button className="btn btn-outline" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CartModal />
      <WishlistModal />
      <UserPopup />
    </div>
  );
};

export default OrderHistory;
