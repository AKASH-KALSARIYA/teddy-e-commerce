import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const BirthdayReminderBanner = () => {
  const { birthdayDiscount, activateBirthdayReward, currentUser } = useStore();

  useEffect(() => {
    if (currentUser?.joinDate) {
      activateBirthdayReward(currentUser.joinDate);
    }
  }, [currentUser.joinDate]);

  if (!birthdayDiscount) return null;

  return (
    <div className="birthday-banner">
      <div className="container">
        <p>
          🎂 Happy Birthday discount activated! Use code <strong>BIRTHDAY{birthdayDiscount}</strong> to get {birthdayDiscount}% off today.
        </p>
      </div>
    </div>
  );
};

export default BirthdayReminderBanner;
