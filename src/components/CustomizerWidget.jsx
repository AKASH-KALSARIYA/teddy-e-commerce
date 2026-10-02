import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const CustomizerWidget = () => {
  const { addToCart, showToast } = useStore();
  const [size, setSize] = useState('Medium (18")');
  const [color, setColor] = useState('Brown');
  const [accessory, setAccessory] = useState('Gift Hat');
  const [customName, setCustomName] = useState('');

  const sizes = ['Small (12")', 'Medium (18")', 'Large (24")'];
  const colors = ['Brown', 'Cream', 'Pink', 'Blue'];
  const accessories = ['Gift Hat', 'Sparkle Ribbon', 'Cute Bow', 'Mini Backpack'];

  const handleAddCustom = () => {
    addToCart(1, 1, size, color, 'toddy/raj13.avif');
    showToast(`Custom teddy added: ${size}, ${color}, ${accessory}`,'success');
  };

  return (
    <section className="customizer-widget">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Build Your Own <span className="highlight">Teddy</span></h2>
          <p className="section-subtitle">Customize size, color and accessories in a playful way.</p>
        </div>
        <div className="customizer-grid">
          <div className="customizer-preview">
            <div className="customizer-image">
              <img src="toddy/raj13.avif" alt="Custom Teddy Preview" />
            </div>
            <div className="customizer-summary">
              <p><strong>Size:</strong> {size}</p>
              <p><strong>Color:</strong> {color}</p>
              <p><strong>Accessory:</strong> {accessory}</p>
              <p><strong>Name Tag:</strong> {customName || 'No name yet'}</p>
            </div>
          </div>
          <div className="customizer-controls">
            <div className="option-row">
              <label>Size</label>
              <div className="option-buttons">
                {sizes.map(opt => (
                  <button key={opt} type="button" className={opt === size ? 'active' : ''} onClick={() => setSize(opt)}>{opt}</button>
                ))}
              </div>
            </div>
            <div className="option-row">
              <label>Color</label>
              <div className="option-buttons">
                {colors.map(opt => (
                  <button key={opt} type="button" className={opt === color ? 'active' : ''} onClick={() => setColor(opt)}>{opt}</button>
                ))}
              </div>
            </div>
            <div className="option-row">
              <label>Accessory</label>
              <select value={accessory} onChange={(e) => setAccessory(e.target.value)}>
                {accessories.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="option-row">
              <label>Gift Name</label>
              <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Enter a name tag" />
            </div>
            <button className="btn btn-primary btn-block" onClick={handleAddCustom}>Add Custom Teddy to Cart</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomizerWidget;
