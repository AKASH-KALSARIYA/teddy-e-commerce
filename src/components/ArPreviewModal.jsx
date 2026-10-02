import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../context/StoreContext';

const ArPreviewModal = () => {
  const { arPreviewActive, toggleArPreview } = useStore();
  const videoRef = useRef(null);
  const [error, setError] = useState('');
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (!arPreviewActive) return;

    const openCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera preview is not supported in this browser.');
        return;
      }
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
      } catch (err) {
        setError('Unable to access the camera. Please allow camera permissions.');
      }
    };

    openCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [arPreviewActive, stream]);

  if (!arPreviewActive) return null;

  return (
    <div className="ar-preview-overlay" role="dialog" aria-modal="true" aria-label="AR preview">
      <div className="ar-preview-modal">
        <div className="ar-preview-header">
          <div>
            <strong>AR Teddy Preview</strong>
            <p>Point your phone camera to see the teddy in your space.</p>
          </div>
          <button className="ar-close-btn" onClick={toggleArPreview} aria-label="Close AR preview">×</button>
        </div>
        <div className="ar-preview-body">
          {error ? (
            <div className="ar-preview-error">{error}</div>
          ) : (
            <video ref={videoRef} autoPlay muted playsInline className="ar-preview-video" />
          )}
          <div className="ar-preview-overlay-guide">
            <span>Move your camera slowly to frame a flat surface.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArPreviewModal;
