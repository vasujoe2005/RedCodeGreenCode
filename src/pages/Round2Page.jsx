import React from 'react';

const Round2Page = ({ setCurrentView }) => (
    <div className="round2-view squid-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/bg.png" className="hero-bg-image" alt="background" />
        <div style={{ textAlign: 'center', zIndex: 10 }}>
            <h1 style={{ color: 'var(--squid-pink)', fontSize: '4rem' }}>ROUND 2 LOCKED</h1>
            <p style={{ fontSize: '1.5rem', opacity: 0.7 }}>Awaiting Admin Permission to start the Marbles of Fate.</p>
            <button className="btn-squid" onClick={() => setCurrentView('dashboard')} style={{ marginTop: '2rem' }}>RETURN TO DASHBOARD</button>
        </div>
    </div>
);

export default Round2Page;
