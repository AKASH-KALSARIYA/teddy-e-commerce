import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';

const VoiceSearchWidget = () => {
  const { voiceSearchActive, deactivateVoiceSearch } = useStore();
  const [message, setMessage] = useState('Start speaking to search teddy bears.');

  useEffect(() => {
    if (!voiceSearchActive || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      if (voiceSearchActive) {
        setMessage('Your browser does not support voice search.');
      }
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(`You said: ${transcript}`);
      window.location.href = `#/store?search=${encodeURIComponent(transcript)}`;
      deactivateVoiceSearch();
    };

    recognition.onerror = (event) => {
      setMessage('Voice recognition failed. Try again.');
    };

    recognition.start();
    return () => recognition.abort();
  }, [voiceSearchActive]);

  if (!voiceSearchActive) return null;

  return (
    <div className="voice-search-widget">
      <div className="voice-search-card">
        <button className="voice-search-close" onClick={deactivateVoiceSearch}>×</button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default VoiceSearchWidget;
