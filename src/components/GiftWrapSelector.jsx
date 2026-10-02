import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const GiftWrapSelector = () => {
  const [selectedWrap, setSelectedWrap] = useState('Classic Pink');
  const [message, setMessage] = useState('');
  const options = ['Classic Pink', 'Royal Blue', 'Golden Glow', 'Nature Green'];
  const { showToast } = useStore();

  const handleSave = () => {
    showToast(`Gift wrap selected: ${selectedWrap}`, 'success');
  };

  return (
    <section className="gift-wrap-section" id="gift-wrap">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Gift Wrap <span className="highlight">Options</span></h2>
          <p className="section-subtitle">Choose custom wrapping and add a message for the recipient.</p>
        </div>
        <div className="gift-wrap-grid">
          <div className="wrap-options">
            {options.map(option => (
              <button key={option} type="button" className={option === selectedWrap ? 'active' : ''} onClick={() => setSelectedWrap(option)}>
                {option}
              </button>
            ))}
          </div>
          <div className="wrap-message-box">
            <textarea
              placeholder="Write a custom gift message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
            <button className="btn btn-primary btn-block" onClick={handleSave}>Save Gift Wrap</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftWrapSelector;
