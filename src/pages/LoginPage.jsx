import React from 'react';

const LoginPage = ({ handleLogin, authTeamName, error, setAuthStep, authStep }) => (
    <div className="squid-container">
        <img src="/bg.png" className="hero-bg-image" alt="background" />
        <div className="auth-card">
            <h2 style={{ color: 'var(--squid-pink)', marginBottom: '2rem', textAlign: 'center' }}>
                {authStep === 'adminPassword' ? 'ADMIN VERIFICATION' : 'ACCESS GRANTED: ENTER PASSWORD'}
            </h2>
            {error && <p style={{ color: '#ff3c3c', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <p style={{ marginBottom: '1rem', opacity: 0.7 }}>Team: {authTeamName}</p>
                <input name="password" type="password" className="squid-input" placeholder="ENTER PASSWORD" required autoFocus />
                <button className="btn-squid">{authStep === 'adminPassword' ? 'AUTHORIZE' : 'LOGIN'}</button>
                <button type="button" onClick={() => setAuthStep('teamName')} style={{ background: 'none', border: 'none', color: '#888', width: '100%', marginTop: '1rem' }}>BACK</button>
            </form>
        </div>
    </div>
);

export default LoginPage;
