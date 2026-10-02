import React from 'react';
import { useStore } from '../context/StoreContext';

const SavedCardsPanel = () => {
  const { savedCards, removeSavedCard } = useStore();

  if (!savedCards.length) return null;

  return (
    <section className="saved-cards-panel" id="saved-cards">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Saved <span className="highlight">Cards</span></h2>
          <p className="section-subtitle">Use saved cards for quicker checkout next time.</p>
        </div>
        <div className="saved-cards-grid">
          {savedCards.map(card => (
            <div key={card.id} className="saved-card">
              <div className="saved-card-top">
                <span>{card.cardType || 'Card'}</span>
                <button type="button" onClick={() => removeSavedCard(card.id)}>Remove</button>
              </div>
              <p>{card.cardHolder}</p>
              <p>{card.maskedNumber}</p>
              <small>Expires {card.expiry}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SavedCardsPanel;
