import React from 'react';
import { useStore } from '../context/StoreContext';

const StoreLocator = () => {
  const { storeLocations } = useStore();

  return (
    <section className="store-locator" id="store-locator">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Find a <span className="highlight">Store Near You</span></h2>
          <p className="section-subtitle">Visit our pickup locations or order online for fast delivery.</p>
        </div>
        <div className="locator-grid">
          {storeLocations.map(location => (
            <div key={location.id} className="locator-card">
              <h3>{location.name}</h3>
              <p>{location.address}</p>
              <p><strong>{location.city}</strong></p>
              <p>Phone: {location.phone}</p>
              <p>Distance: {location.distance}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreLocator;
