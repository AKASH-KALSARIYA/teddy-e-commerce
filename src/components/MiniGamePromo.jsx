import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const MiniGamePromo = () => {
  const { miniGameState, setMiniGameState, showToast } = useStore();
  const [selectedOption, setSelectedOption] = useState(null);

  const questions = [
    {
      text: 'Which teddy tag means best seller?',
      options: ['mini', 'premium', 'best-seller', 'giant'],
      answer: 'best-seller'
    },
    {
      text: 'Which accessory is best for a gift?',
      options: ['Backpack', 'Bow', 'Sticker', 'Ear Muffs'],
      answer: 'Bow'
    }
  ];

  const handlePlay = () => {
    if (!selectedOption) {
      showToast('Please choose an option to play.', 'warning');
      return;
    }
    const correct = selectedOption === questions[0].answer || selectedOption === questions[1]?.answer;
    setMiniGameState(prev => ({
      ...prev,
      score: prev.score + (correct ? 10 : 0),
      unlockedCoupon: correct ? 'TEDDY10' : prev.unlockedCoupon
    }));
    showToast(correct ? 'Nice! Coupon unlocked: TEDDY10' : 'Try again to unlock a coupon.', correct ? 'success' : 'error');
  };

  return (
    <section className="mini-game-promo" id="mini-game">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Unlock Coupons with a <span className="highlight">Mini Game</span></h2>
          <p className="section-subtitle">Play a quick question and grab discount codes for your next teddy.</p>
        </div>
        <div className="mini-game-card">
          <p>{questions[0].text}</p>
          <div className="mini-game-options">
            {questions[0].options.map(option => (
              <button
                key={option}
                type="button"
                className={selectedOption === option ? 'active' : ''}
                onClick={() => setSelectedOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={handlePlay}>Submit Answer</button>
          <div className="mini-game-stats">
            <span>Score: {miniGameState.score}</span>
            <span>Coupon: {miniGameState.unlockedCoupon || 'None yet'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MiniGamePromo;
