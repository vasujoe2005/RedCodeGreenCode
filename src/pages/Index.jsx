import React from 'react';

const Index = ({ handleProceed }) => (
    <div className="squid-container">
        <img src="/bg.png" className="hero-bg-image" alt="background" />
        <div style={{ textAlign: 'center', zIndex: 10 }}>
            <div className="geometric-shapes">
                <div className="shape circle"></div>
                <div className="shape triangle"></div>
                <div className="shape square"></div>
            </div>
            <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '10px' }}>
                RED LIGHT <span style={{ color: 'var(--squid-pink)' }}>GREEN LIGHT</span>
            </h1>
            <button className="btn-squid btn-proceed" onClick={handleProceed}>PROCEED TO PLAY</button>
        </div>
    </div>
);

export default Index;
