import React, { createContext, useContext, useState, useEffect } from 'react';
import { productsData } from '../data/products';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

const safeParse = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    if (val && val !== 'null' && val !== 'undefined') {
      const parsed = JSON.parse(val);
      if (parsed !== null && parsed !== undefined) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(`Error parsing localStorage key "${key}":`, e);
  }
  return fallback;
};

export const StoreProvider = ({ children }) => {
  // --- UI States for Modals ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- Auth State ---
  const [currentUser, setCurrentUser] = useState(() => {
    // Check both 'currentUser' (from main.js) and 'teddyHavenUser' (from account.js)
    const storedAuth = localStorage.getItem('currentUser');
    const storedUser = localStorage.getItem('teddyHavenUser');
    
    if (storedAuth && storedAuth !== 'null' && storedAuth !== 'undefined') {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        if (parsedAuth) {
          const allUsers = JSON.parse(localStorage.getItem('teddyHavenUsers')) || [];
          const found = allUsers.find(u => u.id === parsedAuth.id || u.email === parsedAuth.email);
          if (found) {
            return { ...found, isLoggedIn: true };
          }
        }
      } catch (e) {
        console.error("Error parsing storedAuth:", e);
      }
    }
    
    if (storedUser && storedUser !== 'null' && storedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) return parsedUser;
      } catch (e) {
        console.error("Error parsing storedUser:", e);
      }
    }
    return {
      name: "",
      email: "",
      phone: "",
      address: "",
      joinDate: new Date().toISOString().split('T')[0],
      profilePic: null,
      isLoggedIn: false,
      isProfileComplete: false
    };
  });

  const [usersList, setUsersList] = useState(() => {
    return safeParse('teddyHavenUsers', []);
  });

  // --- Cart State ---
  const [cart, setCart] = useState(() => {
    return safeParse('teddyHavenCart', []);
  });

  // --- Wishlist State ---
  const [wishlist, setWishlist] = useState(() => {
    return safeParse('teddyHavenWishlist', []);
  });

  // --- Addresses State ---
  const [addresses, setAddresses] = useState(() => {
    return safeParse('teddyHavenAddresses', []);
  });

  // --- Orders State ---
  const [orders, setOrders] = useState(() => {
    const teddyOrders = safeParse('teddyHavenOrders', []);
    const userOrders = safeParse('userOrders', []);
    if (teddyOrders.length === 0 && userOrders.length === 0) {
      return [
        {
          id: "TH-2024-00123",
          date: "2024-01-15",
          customerName: "Rahul Sharma",
          phone: "9876543210",
          email: "rahul@example.com",
          items: [
            { 
              id: 1, 
              name: "Classic Brown Bear", 
              price: 1299, 
              quantity: 1, 
              image: "toddy/raj1.jpg",
              color: "Brown",
              size: "Medium (18\")"
            },
            { 
              id: 3, 
              name: "Mini Love Bear", 
              price: 799, 
              quantity: 2, 
              image: "toddy/raj7.jpg",
              color: "Pink",
              size: "Mini (6\")"
            }
          ],
          total: 2897,
          status: "delivered",
          trackingId: "TRK789012345",
          address: {
            name: "Rahul Sharma",
            street: "123 Main Street, Andheri West",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400053",
            phone: "9876543210"
          },
          paymentMethod: "Credit Card",
          estimatedDelivery: "2024-01-18"
        },
        {
          id: "TH-2024-00122",
          date: "2024-01-10",
          customerName: "Rahul Sharma",
          phone: "9876543210",
          email: "rahul@example.com",
          items: [
            { 
              id: 2, 
              name: "Giant Cuddle Bear", 
              price: 2499, 
              quantity: 1, 
              image: "toddy/raj4.jpg",
              color: "Beige",
              size: "X-Large (36\")"
            }
          ],
          total: 2499,
          status: "shipped",
          trackingId: "TRK123456789",
          address: {
            name: "Rahul Sharma",
            street: "456 Park Avenue",
            city: "Delhi",
            state: "Delhi",
            pincode: "110001",
            phone: "9876543210"
          },
          paymentMethod: "UPI",
          estimatedDelivery: "2024-01-13"
        },
        {
          id: "TH-2024-00121",
          date: "2024-01-05",
          customerName: "Rahul Sharma",
          phone: "9876543210",
          email: "rahul@example.com",
          items: [
            { 
              id: 4, 
              name: "Premium Soft Bear", 
              price: 1899, 
              quantity: 1, 
              image: "toddy/raj10.jpg",
              color: "Cream",
              size: "Large (24\")"
            },
            { 
              id: 5, 
              name: "Rainbow Bear", 
              price: 1699, 
              quantity: 1, 
              image: "toddy/raj13.avif",
              color: "Rainbow",
              size: "Medium (18\")"
            }
          ],
          total: 3598,
          status: "processing",
          trackingId: null,
          address: {
            name: "Rahul Sharma",
            street: "789 Business Park, Bandra Kurla Complex",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400051",
            phone: "9876543210"
          },
          paymentMethod: "Credit Card",
          estimatedDelivery: "2024-01-12"
        }
      ];
    }
    const combined = [...teddyOrders, ...userOrders];
    return combined.slice(0, 30);
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    return safeParse('teddyHavenRecentlyViewed', []);
  });

  // --- Settings State ---
  const [settings, setSettings] = useState(() => {
    return safeParse('teddyHavenSettings', {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      language: 'en',
      currency: 'INR',
      profileVisibility: 'friends',
      dataSharing: false,
      activityTracking: true
    });
  });

  const [themeMode, setThemeMode] = useState(() => safeParse('teddyHavenThemeMode', 'light'));
  const [highContrast, setHighContrast] = useState(() => safeParse('teddyHavenHighContrast', false));
  const [rewardsPoints, setRewardsPoints] = useState(() => safeParse('teddyHavenRewardsPoints', 420));
  const [birthdayDiscount, setBirthdayDiscount] = useState(() => safeParse('teddyHavenBirthdayDiscount', 20));
  const [savedCards, setSavedCards] = useState(() => safeParse('teddyHavenSavedCards', []));
  const [voiceNotes, setVoiceNotes] = useState(() => safeParse('teddyHavenVoiceNotes', []));
  const [compareList, setCompareList] = useState(() => safeParse('teddyHavenCompareList', []));
  const [miniGameState, setMiniGameState] = useState(() => safeParse('teddyHavenMiniGame', { unlockedCoupon: null, score: 0 }));
  const [storeLocations] = useState(() => safeParse('teddyHavenStoreLocations', [
    {
      id: 1,
      name: 'Teddy Haven Market Street',
      city: 'Mumbai',
      address: 'Andheri West, Mumbai',
      phone: '022-1234-5678',
      distance: '2.8 km'
    },
    {
      id: 2,
      name: 'Teddy Haven City Plaza',
      city: 'Delhi',
      address: 'Connaught Place, New Delhi',
      phone: '011-9876-5432',
      distance: '1.9 km'
    },
    {
      id: 3,
      name: 'Teddy Haven Mall',
      city: 'Bengaluru',
      address: 'MG Road, Bengaluru',
      phone: '080-4567-8901',
      distance: '3.4 km'
    }
  ]));
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState(() => safeParse('teddyHavenChatMessages', [
    { id: 1, author: 'Bot', text: 'Hi! Need help choosing a teddy? I can suggest matching styles.' }
  ]));
  const [arPreviewActive, setArPreviewActive] = useState(false);
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);
  const [personalizationData, setPersonalizationData] = useState(() => safeParse('teddyHavenPersonalization', {}));

  // --- Sell Offer State ---
  const [sellOffer, setSellOffer] = useState({
    active: false,
    discount: 20,
    endsAt: null
  });

  const activateSellOffer = () => {
    const now = new Date();
    const isActive = sellOffer.active && sellOffer.endsAt && new Date(sellOffer.endsAt) > now;

    if (isActive) {
      setSellOffer({ active: false, discount: 0, endsAt: null });
      showToast('Sell Offer deactivated.', 'warning');
      return;
    }

    const offerEnd = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
    setSellOffer({
      active: true,
      discount: 25,
      endsAt: offerEnd.toISOString()
    });
    showToast('Sell Offer activated! 25% off for 10 minutes.', 'success');
  };

  // --- Toast State ---
  const [toasts, setToasts] = useState([]);

  // --- Persistence Syncs ---
  useEffect(() => {
    localStorage.setItem('teddyHavenUsers', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('currentUser', currentUser.isLoggedIn ? JSON.stringify({ id: currentUser.id, email: currentUser.email }) : null);
    localStorage.setItem('teddyHavenUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('teddyHavenCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('teddyHavenWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('teddyHavenAddresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('teddyHavenOrders', JSON.stringify(orders));
    localStorage.setItem('userOrders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('teddyHavenSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('teddyHavenThemeMode', JSON.stringify(themeMode));
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('teddyHavenHighContrast', JSON.stringify(highContrast));
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('teddyHavenRewardsPoints', JSON.stringify(rewardsPoints));
  }, [rewardsPoints]);

  useEffect(() => {
    localStorage.setItem('teddyHavenBirthdayDiscount', JSON.stringify(birthdayDiscount));
  }, [birthdayDiscount]);

  useEffect(() => {
    localStorage.setItem('teddyHavenSavedCards', JSON.stringify(savedCards));
  }, [savedCards]);

  useEffect(() => {
    localStorage.setItem('teddyHavenVoiceNotes', JSON.stringify(voiceNotes));
  }, [voiceNotes]);

  useEffect(() => {
    localStorage.setItem('teddyHavenCompareList', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    localStorage.setItem('teddyHavenMiniGame', JSON.stringify(miniGameState));
  }, [miniGameState]);

  useEffect(() => {
    localStorage.setItem('teddyHavenChatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('teddyHavenRecentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('teddyHavenPersonalization', JSON.stringify(personalizationData));
  }, [personalizationData]);

  const addRecentlyViewed = (productId) => {
    setRecentlyViewed(prev => {
      const next = prev.filter(id => id !== productId);
      return [productId, ...next].slice(0, 6);
    });
  };

  // --- Toast Function ---
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleContrast = () => {
    setHighContrast(prev => !prev);
  };

  const addSavedCard = (card) => {
    setSavedCards(prev => [...prev, { id: Date.now(), ...card }]);
    showToast('Card saved successfully!', 'success');
  };

  const removeSavedCard = (cardId) => {
    setSavedCards(prev => prev.filter(card => card.id !== cardId));
    showToast('Saved card removed', 'warning');
  };

  const addVoiceNote = (note) => {
    setVoiceNotes(prev => [{ id: Date.now(), ...note }, ...prev]);
    showToast('Voice note saved!', 'success');
  };

  const addCompareItem = (productId) => {
    setCompareList(prev => {
      const next = prev.includes(productId) ? prev : [...prev, productId];
      return next.slice(0, 4);
    });
    showToast('Added to compare list', 'success');
  };

  const removeCompareItem = (productId) => {
    setCompareList(prev => prev.filter(id => id !== productId));
  };

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  const sendChatMessage = (message) => {
    const newMessage = { id: Date.now(), author: 'User', text: message };
    setChatMessages(prev => [...prev, newMessage]);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now() + 1, author: 'Bot', text: 'Sure! I recommend our Premium Soft Bear for a luxurious cuddle experience.' }]);
    }, 900);
  };

  const setPersonalization = (key, value) => {
    setPersonalizationData(prev => ({ ...prev, [key]: value }));
  };

  const getRecommendations = () => {
    if (!personalizationData?.preferredMood) {
      return productsData.slice(0, 4);
    }
    return productsData.filter(p => p.tags.some(tag => tag.includes(personalizationData.preferredMood)))
      .slice(0, 4);
  };

  const activateBirthdayReward = (birthDate) => {
    const today = new Date().toISOString().slice(5, 10);
    const userBirthday = birthDate ? new Date(birthDate).toISOString().slice(5, 10) : null;
    if (userBirthday === today) {
      setBirthdayDiscount(25);
      showToast('Happy Birthday! 25% discount applied.', 'success');
    }
  };

  const activateVoiceSearch = () => {
    setVoiceSearchActive(true);
  };

  const deactivateVoiceSearch = () => {
    setVoiceSearchActive(false);
  };

  const toggleArPreview = () => {
    setArPreviewActive(prev => !prev);
  };

  // --- Auth Handlers ---
  const login = (email, password) => {
    const user = usersList.find(u => u.email === email);
    if (!user) {
      showToast("User not found", "error");
      return { success: false, message: "User not found" };
    }
    if (user.password !== password) {
      showToast("Incorrect password", "error");
      return { success: false, message: "Incorrect password" };
    }

    const updatedUser = {
      ...user,
      isLoggedIn: true,
      isProfileComplete: !!(user.name && user.email && user.phone && user.address)
    };
    setCurrentUser(updatedUser);
    showToast("Login successful!", "success");
    return { success: true, message: "Login successful!" };
  };

  const signup = (firstName, lastName, email, phone, password) => {
    const existingUser = usersList.find(u => u.email === email);
    if (existingUser) {
      showToast("User already exists", "error");
      return { success: false, message: "User with this email already exists" };
    }

    const newUser = {
      id: Date.now(),
      name: `${firstName} ${lastName}`,
      email: email,
      phone: phone,
      password: password,
      address: "",
      joinDate: new Date().toISOString().split('T')[0],
      profilePic: null,
      wishlist: [],
      addresses: [],
      orders: []
    };

    setUsersList(prev => [...prev, newUser]);
    
    // Auto-login
    const loggedUser = {
      ...newUser,
      isLoggedIn: true,
      isProfileComplete: false
    };
    setCurrentUser(loggedUser);
    showToast("Signup successful!", "success");
    return { success: true };
  };

  const logout = () => {
    setCurrentUser({
      name: "",
      email: "",
      phone: "",
      address: "",
      joinDate: new Date().toISOString().split('T')[0],
      profilePic: null,
      isLoggedIn: false,
      isProfileComplete: false
    });
    showToast("Logged out successfully", "success");
  };

  const updateProfile = (profileData) => {
    const updated = {
      ...currentUser,
      ...profileData,
      isProfileComplete: !!(profileData.name && profileData.email && profileData.phone && profileData.address)
    };
    setCurrentUser(updated);

    // Also update usersList
    setUsersList(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...profileData } : u));
    showToast("Profile saved successfully!", "success");
  };

  const updateProfilePic = (picUrl) => {
    setCurrentUser(prev => ({ ...prev, profilePic: picUrl }));
    setUsersList(prev => prev.map(u => u.id === currentUser.id ? { ...u, profilePic: picUrl } : u));
    showToast("Profile photo updated successfully!", "success");
  };

  // --- Cart Handlers ---
  const addToCart = (productId, quantity = 1, size = "Medium (18\")", color = "Brown", customImage = null) => {
    const product = productsData.find(p => p.id === productId);
    if (!product) {
      showToast("Product not found!", "error");
      return;
    }
    if (product.inStock === false) {
      showToast("This product is out of stock!", "error");
      return;
    }

    const existingIndex = cart.findIndex(item => 
      item.id === productId && 
      item.size === size && 
      item.color === color
    );

    if (existingIndex !== -1) {
      setCart(prev => {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      });
    } else {
      setCart(prev => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: quantity,
          size: size,
          color: color,
          image: customImage || (product.images && product.images.length > 0 ? product.images[0] : 'toddy/raj1.jpg')
        }
      ]);
    }

    showToast(`${product.name} added to cart!`, "success");
  };

  const buyNow = (productId, quantity = 1, size = "Medium (18\")", color = "Brown", customImage = null) => {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    // Clear cart and add only this item
    setCart([
      {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: quantity,
        size: size,
        color: color,
        image: customImage || (product.images && product.images.length > 0 ? product.images[0] : 'toddy/raj1.jpg')
      }
    ]);
  };

  const removeFromCart = (productId, size, color) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.size === size && item.color === color)));
    showToast("Item removed from cart", "warning");
  };

  const updateQuantity = (productId, size, color, change) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId && item.size === size && item.color === color) {
          const newQty = item.quantity + change;
          if (newQty < 1) {
            showToast("Item removed from cart", "warning");
            return null; // Will filter out
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // --- Wishlist Handlers ---
  const toggleWishlist = (productId) => {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const exists = wishlist.some(item => item.id === productId);
    if (exists) {
      setWishlist(prev => prev.filter(item => item.id !== productId));
      showToast("Removed from wishlist", "warning");
    } else {
      setWishlist(prev => [...prev, product]);
      showToast("Added to wishlist!", "success");
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const moveAllToCart = () => {
    if (wishlist.length === 0) return;
    
    wishlist.forEach(product => {
      addToCart(product.id, 1, "Medium (18\")", "Brown");
    });
    setWishlist([]);
    showToast("All items moved to cart", "success");
  };

  // --- Address Book Handlers ---
  const addAddress = (address) => {
    const newAddress = {
      id: Date.now(),
      ...address
    };
    if (address.isDefault) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(newAddress));
    } else {
      setAddresses(prev => [...prev, newAddress]);
    }
    showToast("Address saved successfully!", "success");
  };

  const deleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    showToast("Address deleted", "warning");
  };

  // --- Order History Handlers ---
  const addOrder = (orderData) => {
    const newOrder = {
      id: orderData.id || 'TH-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      items: orderData.items || cart,
      total: orderData.total,
      status: 'processing',
      trackingId: 'TRK' + Math.floor(100000000 + Math.random() * 900000000),
      address: orderData.address,
      paymentMethod: orderData.paymentMethod || 'COD',
      estimatedDelivery: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      customerName: orderData.customerName || currentUser.name || 'Guest User',
      phone: orderData.phone,
      email: orderData.email
    };

    setOrders(prev => [newOrder, ...prev].slice(0, 30));
    showToast("Order placed successfully!", "success");
    return newOrder.id;
  };

  const cancelOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
    showToast("Order cancelled successfully", "success");
  };

  const reorder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    order.items.forEach(item => {
      addToCart(item.id, item.quantity, item.size, item.color, item.image);
    });
  };

  const shareProduct = async (productId) => {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    const shareUrl = `${window.location.origin}${window.location.pathname}#/product/${productId}`;
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Teddy Haven - ${product.description.substring(0, 100)}...`,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        showToast('Link copied to clipboard!', 'success');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  // --- Cart Calculations ---
  useEffect(() => {
    document.body.dataset.theme = themeMode;
    document.body.dataset.contrast = highContrast ? 'high' : 'normal';
  }, [themeMode, highContrast]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = subtotal * 0.2; // 20% discount
  const shipping = subtotal >= 999 ? 0 : (cart.length > 0 ? 99 : 0);
  const total = subtotal - discount + shipping;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      currentUser,
      usersList,
      login,
      signup,
      logout,
      updateProfile,
      updateProfilePic,

      cart,
      addToCart,
      buyNow,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartSubtotal: subtotal,
      cartDiscount: discount,
      cartShipping: shipping,
      cartTotal: total,

      wishlist,
      toggleWishlist,
      isInWishlist,
      moveAllToCart,

      addresses,
      addAddress,
      deleteAddress,

      orders,
      addOrder,
      cancelOrder,
      reorder,
      shareProduct,

      recentlyViewed,
      addRecentlyViewed,

      settings,
      setSettings,

      themeMode,
      toggleTheme,
      highContrast,
      toggleContrast,
      rewardsPoints,
      birthdayDiscount,
      savedCards,
      addSavedCard,
      removeSavedCard,
      voiceNotes,
      addVoiceNote,
      compareList,
      addCompareItem,
      removeCompareItem,
      miniGameState,
      setMiniGameState,
      storeLocations,
      isChatOpen,
      openChat,
      closeChat,
      chatMessages,
      sendChatMessage,
      arPreviewActive,
      toggleArPreview,
      voiceSearchActive,
      activateVoiceSearch,
      deactivateVoiceSearch,
      personalizationData,
      setPersonalization,
      getRecommendations,
      activateBirthdayReward,

      sellOffer,
      activateSellOffer,

      toasts,
      showToast,
      removeToast,

      isCartOpen,
      setIsCartOpen,
      isWishlistOpen,
      setIsWishlistOpen,
      isUserPopupOpen,
      setIsUserPopupOpen,
      isSettingsOpen,
      setIsSettingsOpen
    }}>
      {children}

      {/* Global Toast Notification System */}
      <div className="toast-container" id="toastContainer">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type} show`}>
            <i className={`fas fa-${t.type === 'success' ? 'check-circle' : t.type === 'error' ? 'exclamation-circle' : t.type === 'warning' ? 'exclamation-triangle' : 'info-circle'} toast-icon`}></i>
            <div className="toast-content">
              <p>{t.message}</p>
            </div>
            <button className="toast-close" onClick={() => removeToast(t.id)}>&times;</button>
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
};
