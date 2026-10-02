import React from 'react';
import { useStore } from '../context/StoreContext';

const LoyaltyCard = () => {
  const { rewardsPoints, currentUser } = useStore();

  return (
    <section className="loyalty-card" id="rewards">
      <div className="container">
        <div className="loyalty-panel">
          <div>
            <h2>Rewards Points</h2>
            <p>{currentUser.name ? `${currentUser.name},` : 'Hey there,'} you have <strong>{rewardsPoints}</strong> points available.</p>
          </div>
          <div className="rewards-actions">
            <button className="btn btn-primary">Redeem Points</button>
            <button className="btn btn-secondary">View Rewards</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoyaltyCard;
