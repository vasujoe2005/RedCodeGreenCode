import React from 'react';

const TeamIdentify = ({ handleCheckTeam, error }) => (
    <div className="squid-container">
        <img src="/bg.png" className="hero-bg-image" alt="background" />
        <div className="auth-card">
            <h2 style={{ color: 'var(--squid-pink)', marginBottom: '2rem', textAlign: 'center' }}>
                IDENTIFY YOURSELF
            </h2>
            {error && <p style={{ color: '#ff3c3c', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
            <form onSubmit={handleCheckTeam}>
                <input name="teamName" className="squid-input" placeholder="ENTER TEAM NAME" required autoFocus />
                <button className="btn-squid">CONTINUE</button>
            </form>
        </div>
    </div>
);

export default TeamIdentify;
