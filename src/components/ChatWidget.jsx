import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const ChatWidget = () => {
  const { isChatOpen, closeChat, chatMessages, sendChatMessage } = useStore();
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isChatOpen) {
      inputRef.current?.focus();
    }
  }, [isChatOpen]);

  if (!isChatOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    sendChatMessage(trimmed);
    setMessage('');
  };

  return (
    <div className="chat-widget-overlay" role="dialog" aria-modal="true" aria-label="Live chat support">
      <div className="chat-widget">
        <div className="chat-widget-header">
          <div>
            <strong>Live Support</strong>
            <p>Ask about teddy recommendations, gift wrap, or product care.</p>
          </div>
          <button className="chat-close-btn" onClick={closeChat} aria-label="Close chat">×</button>
        </div>
        <div className="chat-widget-messages">
          {chatMessages.map((item) => (
            <div key={item.id} className={`chat-message ${item.author === 'Bot' ? 'bot' : 'user'}`}>
              <span className="chat-author">{item.author}</span>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
        <form className="chat-widget-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            aria-label="Type a message"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;
