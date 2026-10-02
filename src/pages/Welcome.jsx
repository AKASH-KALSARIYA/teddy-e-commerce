import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const Welcome = () => {
  const navigate = useNavigate();
  const btnRef = useRef(null);
  const canvasRef = useRef(null);
  const creatorCardRef = useRef(null);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const initParticles = () => {
      if (window.particlesJS) {
        window.particlesJS('particles-js', {
          particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.4, random: true },
            size: { value: 2, random: true },
            line_linked: {
              enable: true,
              distance: 120,
              color: '#ffffff',
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1.5,
              direction: 'none',
              random: true,
              straight: false,
              out_mode: 'out',
              bounce: false,
            },
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: { enable: true, mode: 'repulse' },
              onclick: { enable: true, mode: 'push' },
            },
          },
          retina_detect: true,
        });
      }
    };

    if (!window.particlesJS) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
      script.async = true;
      script.onload = initParticles;
      document.body.appendChild(script);
    } else {
      initParticles();
    }

    const card = creatorCardRef.current;
    const handleCardClick = () => {
      if (!card) return;
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (card) card.style.transform = 'scale(1)';
      }, 150);
    };
    if (card) card.addEventListener('click', handleCardClick);

    const onKey = (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        startApp();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      if (card) card.removeEventListener('click', handleCardClick);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (!('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window)) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length) {
        setVoices(available);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
    if (!window.speechSynthesis.onvoiceschanged) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', loadVoices);
      if (window.speechSynthesis.onvoiceschanged === loadVoices) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0b1b);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.6);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const ambient = new THREE.AmbientLight(0xffffff, 0.45);
    const keyLight = new THREE.PointLight(0x75c7ff, 1.2, 12);
    keyLight.position.set(2.4, 2.2, 2.8);
    const fillLight = new THREE.PointLight(0xff87c5, 0.8, 12);
    fillLight.position.set(-2.4, 1.5, 2.2);
    const rimLight = new THREE.PointLight(0xffffff, 0.5, 16);
    rimLight.position.set(0, -3, 5);
    scene.add(ambient, keyLight, fillLight, rimLight);

    const teddyGroup = new THREE.Group();
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0xf3c085,
      roughness: 0.35,
      metalness: 0.05,
      clearcoat: 0.25,
      clearcoatRoughness: 0.2,
    });

    const head = new THREE.Mesh(new THREE.SphereGeometry(1.18, 64, 64), headMaterial);
    teddyGroup.add(head);

    const earGeometry = new THREE.SphereGeometry(0.42, 32, 32);
    const leftEar = new THREE.Mesh(earGeometry, headMaterial);
    leftEar.position.set(-0.9, 0.86, 0);
    const rightEar = new THREE.Mesh(earGeometry, headMaterial);
    rightEar.position.set(0.9, 0.86, 0);
    teddyGroup.add(leftEar, rightEar);

    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x202020, roughness: 0.4, metalness: 0.1 });
    const eyeGeo = new THREE.SphereGeometry(0.11, 24, 24);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMaterial);
    leftEye.position.set(-0.45, 0.18, 1.02);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMaterial);
    rightEye.position.set(0.45, 0.18, 1.02);
    teddyGroup.add(leftEye, rightEye);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24), new THREE.MeshStandardMaterial({ color: 0x442b1a, roughness: 0.45, metalness: 0.02 }));
    nose.position.set(0, -0.24, 1.03);
    teddyGroup.add(nose);

    const detail = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.06, 20, 60), new THREE.MeshStandardMaterial({ color: 0x442b1a, roughness: 0.65, metalness: 0.03 }));
    detail.rotation.x = Math.PI / 2;
    detail.position.set(0, -0.32, 0.85);
    teddyGroup.add(detail);

    scene.add(teddyGroup);

    const grid = new THREE.Mesh(
      new THREE.CircleGeometry(2.1, 64),
      new THREE.MeshStandardMaterial({ color: 0x16233f, roughness: 0.9, metalness: 0.15 })
    );
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -1.95;
    scene.add(grid);

    const animate = () => {
      teddyGroup.rotation.y += 0.006;
      teddyGroup.rotation.x = Math.sin(Date.now() * 0.0006) * 0.08;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  const startApp = () => {
    const btn = btnRef.current;
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="btn-icon" style="animation: rocketFly 0.5s infinite">🔊</span> Speaking...';
    }

    const text = 'बिरू चल तेरे को अपना वेबसाइट से बेस्ट शॉपिंग कराता हूँ।';
    const synth = window.speechSynthesis;

    const getVoice = () => {
      if (!('speechSynthesis' in window)) return null;
      const list = voices.length ? voices : synth.getVoices();
      if (!list || !list.length) return null;
      return (
        list.find((v) => /^(hi|hi-)/i.test(v.lang)) ||
        list.find((v) => /hindi/i.test(v.lang) || /hindi/i.test(v.name)) ||
        list[0]
      );
    };

    const speakText = () => {
      if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
        return false;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voice = getVoice();
      if (voice) utterance.voice = voice;

      utterance.onend = () => {
        navigate('/store');
      };

      utterance.onerror = () => {
        navigate('/store');
      };

      synth.cancel();
      synth.speak(utterance);
      return true;
    };

    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setTimeout(() => navigate('/store'), 600);
    } else {
      const voice = getVoice();
      if (voice) {
        speakText();
      } else {
        let attempts = 0;
        const retry = setInterval(() => {
          attempts += 1;
          const available = synth.getVoices();
          if (available.length) {
            clearInterval(retry);
            setVoices(available);
            speakText();
          } else if (attempts >= 10) {
            clearInterval(retry);
            speakText();
          }
        }, 250);
      }
    }

    const holo = document.querySelector('.logo-hologram');
    if (holo) holo.style.animation = 'hologramPulse 0.5s infinite';
  };

  return (
    <div className="welcome-page-body">
      <style>{`* {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body, #root {
          min-height: 100%;
          background: #0b0b1b;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: white;
          overflow-x: hidden;
        }
        #particles-js {
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: -2;
          opacity: 0.35;
        }
        .glowing-circles {
          position: fixed;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
        }
        .glow-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(50px);
          opacity: 0.28;
        }
        .glow-circle:nth-child(1) {
          width: 360px;
          height: 360px;
          background: radial-gradient(circle, rgba(0, 210, 255, 0.65), transparent 60%);
          top: 8%;
          left: 6%;
          animation: floatGlow 18s infinite ease-in-out;
        }
        .glow-circle:nth-child(2) {
          width: 420px;
          height: 420px;
          background: radial-gradient(circle, rgba(255, 0, 128, 0.55), transparent 60%);
          bottom: 12%;
          right: 8%;
          animation: floatGlow 22s infinite ease-in-out reverse;
        }
        .glow-circle:nth-child(3) {
          width: 260px;
          height: 260px;
          background: radial-gradient(circle, rgba(255, 235, 59, 0.45), transparent 60%);
          top: 42%;
          left: 75%;
          animation: floatGlow 20s infinite ease-in-out;
        }
        .welcome-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 32px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .content {
          width: 100%;
          max-width: 900px;
          padding: 96px 42px 48px 280px;
          background: rgba(9, 15, 30, 0.95);
          border-radius: 36px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 42px 130px rgba(0, 0, 0, 0.34);
          backdrop-filter: blur(26px);
          animation: contentAppear 1s ease 0.4s both;
          margin: 0 auto;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .logo-container {
          margin-bottom: 0;
          position: absolute;
          top: 24px;
          left: 24px;
          display: flex;
          justify-content: flex-start;
          animation: hologramAppear 1.4s ease;
          width: 240px;
          height: 240px;
          pointer-events: none;
          z-index: 8;
        }
        .logo-hologram {
          width: 100%;
          height: 100%;
          border-radius: 34px;
          background: radial-gradient(circle at top left, rgba(0, 210, 255, 0.16), transparent 45%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.03));
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: 0 32px 72px rgba(0, 0, 0, 0.22), inset 0 0 20px rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          backdrop-filter: blur(20px);
        }
        .logo-icon {
          display: none;
        }
        .three-canvas {
          width: 100%;
          height: 100%;
          display: block;
          border-radius: 34px;
        }
        .main-title {
          font-size: 3.2rem;
          margin-bottom: 16px;
          background: linear-gradient(120deg, #ffffff, #00d2ff, #ff0080);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.9px;
          line-height: 1.08;
        }
        .subtitle {
          font-size: 1.25rem;
          margin-bottom: 34px;
          color: rgba(255, 255, 255, 0.78);
          max-width: 680px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.7;
        }
        .creator-card {
          background: rgba(255, 255, 255, 0.06);
          padding: 24px 28px;
          border-radius: 24px;
          display: inline-flex;
          align-items: center;
          gap: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.16);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          max-width: 760px;
          width: 100%;
          margin: 0 auto 32px;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .creator-card:hover {
          transform: translateY(-3px);
          border-color: rgba(255, 255, 255, 0.16);
        }
        .creator-image-container {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 0 20px rgba(0, 210, 255, 0.2);
        }
        .creator-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .creator-card:hover .creator-image {
          transform: scale(1.06);
        }
        .creator-text {
          text-align: left;
          position: relative;
          z-index: 2;
        }
        .creator-label {
          font-size: 0.82rem;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          margin-bottom: 6px;
          color: rgba(255, 255, 255, 0.66);
        }
        .creator-name {
          font-size: 1.95rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.6px;
          margin: 6px 0;
          line-height: 1.05;
        }
        .creator-subtitle {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.72);
          letter-spacing: 0.6px;
          margin-top: 6px;
          padding-left: 12px;
          position: relative;
        }
        .creator-subtitle::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 6px;
          height: 2px;
          background: linear-gradient(90deg, #ff0080, #00d2ff);
          transform: translateY(-50%);
        }
        .get-started-btn {
          background: rgba(255, 255, 255, 0.14);
          color: #ffffff;
          padding: 18px 42px;
          font-size: 1.15rem;
          font-weight: 700;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          cursor: pointer;
          margin: 0 auto;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.24);
          transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          min-width: 240px;
          z-index: 10;
          backdrop-filter: blur(18px);
        }
        .get-started-btn:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, rgba(255, 74, 149, 0.95), rgba(0, 210, 255, 0.95));
          box-shadow: 0 20px 55px rgba(0, 0, 0, 0.28);
        }
        .get-started-btn:active {
          transform: translateY(0);
        }
        .get-started-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .btn-icon {
          font-size: 1.55rem;
          transition: transform 0.3s ease;
        }
        .get-started-btn:hover .btn-icon {
          transform: translateY(-1px);
        }
        .footer-note {
          margin-top: 28px;
          color: rgba(255, 255, 255, 0.68);
          font-size: 0.95rem;
          line-height: 1.7;
          padding: 0 14px;
          max-width: 580px;
          margin-left: auto;
          margin-right: auto;
        }

        @keyframes hologramPulse {
          0% {
            box-shadow: 0 0 60px rgba(0,209,255,0.7), 0 0 100px rgba(255,0,128,0.5), inset 0 0 20px rgba(255,255,255,0.3);
          }
          100% {
            box-shadow: 0 0 80px rgba(0,209,255,0.9), 0 0 140px rgba(255,0,128,0.7), inset 0 0 30px rgba(255,255,255,0.5);
          }
        }
        @keyframes rotate3D {
          0% { transform: rotateY(0deg) rotateX(0deg); }
          100% { transform: rotateY(360deg) rotateX(10deg); }
        }
        @keyframes floatGlow {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-30px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.9); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes shine {
          0% { transform: rotate(45deg) translateX(-100%); }
          100% { transform: rotate(45deg) translateX(100%); }
        }
        @keyframes hologramAppear {
          from { opacity: 0; transform: translateY(-50px) scale(0.5); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes contentAppear {
          from { opacity: 0; transform: translateY(30px); filter: blur(5px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes btnAppear {
          from { opacity: 0; transform: scale(0.8) translateY(50px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes btnGlow {
          0%, 100% { box-shadow: 0 0 25px rgba(255,0,128,0.7), 0 0 50px rgba(0,210,255,0.5), inset 0 0 15px rgba(255,255,255,0.3); }
          50% { box-shadow: 0 0 35px rgba(255,0,128,0.9), 0 0 70px rgba(0,210,255,0.7), inset 0 0 20px rgba(255,255,255,0.4); }
        }
        @keyframes btnShine {
          0% { transform: rotate(45deg) translateX(-100%) translateY(-100%); }
          100% { transform: rotate(45deg) translateX(100%) translateY(100%); }
        }
        @keyframes rocketFly {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(-5deg); }
          75% { transform: translateY(8px) rotate(5deg); }
        }
        @keyframes floatImage {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media (max-width: 900px) {
          .welcome-container { padding: 24px 16px; }
          .content { padding: 34px 28px; }
          .main-title { font-size: 2.6rem; }
          .subtitle { font-size: 1.25rem; }
          .creator-card { flex-direction: column; text-align: center; gap: 18px; padding: 22px 24px; }
          .creator-text { text-align: center; }
          .creator-name { font-size: 1.85rem; }
          .creator-image-container { width: 88px; height: 88px; }
          .get-started-btn { padding: 16px 34px; font-size: 1.08rem; min-width: 220px; }
          .logo-hologram { width: 120px; height: 120px; }
          .logo-icon { font-size: 3.2rem; }
          .footer-note { max-width: 100%; }
        }
        @media (max-width: 560px) {
          .content { padding: 28px 20px; border-radius: 24px; }
          .main-title { font-size: 2rem; }
          .subtitle { font-size: 1.05rem; }
          .logo-hologram { width: 100px; height: 100px; }
          .logo-icon { font-size: 2.7rem; }
          .creator-card { padding: 18px 16px; gap: 14px; }
          .creator-image-container { width: 78px; height: 78px; }
          .get-started-btn { padding: 14px 30px; font-size: 0.98rem; min-width: 200px; gap: 10px; }
          .btn-icon { font-size: 1.35rem; }
        }
        @media (max-height: 620px) {
          .welcome-container { padding: 18px 12px; }
          .content { padding: 22px 18px; }
          .creator-card { margin: 18px 0; }
          .get-started-btn { margin: 18px auto; }
        }
      `}</style>

      <div id="particles-js"></div>
      <div className="glowing-circles">
        <div className="glow-circle"></div>
        <div className="glow-circle"></div>
        <div className="glow-circle"></div>
      </div>
      <div className="welcome-container">
        <div className="logo-container">
          <div className="logo-hologram">
            <canvas ref={canvasRef} className="three-canvas" />
          </div>
        </div>
        <div className="content">
          <h1 className="main-title">Welcome to Our Teddy Bear</h1>
          <h2 className="subtitle">Use to shop Teddy Products Easily</h2>
          <div className="creator-card" ref={creatorCardRef}>
            <div className="creator-image-container">
              <img src="/toddy/raj13.avif" alt="Akash Kalsariya" className="creator-image" />
            </div>
            <div className="creator-text">
              <div className="creator-label">Crafted with Passion By</div>
              <div className="creator-name">AKASH KALSARIYA</div>
              <div className="creator-subtitle">Full Stack Developer & UI/UX Designer</div>
            </div>
          </div>
          <button className="get-started-btn" onClick={startApp} id="startBtn" ref={btnRef}>
            <span className="btn-icon">🚀</span>
            Let's Get Started
          </button>
          <div className="footer-note">
            <p>UserFriendly use to easy buy products based on AI Technology</p>
            <p style={{ marginTop: '10px', fontSize: '0.8rem', opacity: 0.7 }}>
              Click the button above to continue
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
