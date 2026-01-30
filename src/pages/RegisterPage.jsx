import React from 'react';

const RegisterPage = ({ handleRegister, authTeamName, error, setAuthStep }) => (
    <div className="squid-container">
        <img src="/bg.png" className="hero-bg-image" alt="background" />
        <div className="auth-card">
            <h2 style={{ color: 'var(--squid-pink)', marginBottom: '2rem', textAlign: 'center' }}>
                NEW PLAYER: REGISTRATION
            </h2>

            {error && <p style={{ color: '#ff3c3c', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

            <form onSubmit={handleRegister}>
                <p style={{ marginBottom: '1rem', opacity: 0.7 }}>Registering Team: {authTeamName}</p>
                <input name="password" type="password" className="squid-input" placeholder="SET TEAM PASSWORD" required />
                <div className="registration-grid">
                    <div className="member-reg">
                        <h4 style={{ color: 'var(--squid-mint)', marginBottom: '0.5rem' }}>MEMBER 1</h4>
                        <input name="m1Name" className="squid-input" placeholder="NAME" required />
                        <input name="m1Reg" className="squid-input" placeholder="REG NUMBER" required />
                        <input name="m1Email" className="squid-input" placeholder="EMAIL" required />
                    </div>
                    <div className="member-reg">
                        <h4 style={{ color: 'var(--squid-mint)', marginBottom: '0.5rem' }}>MEMBER 2</h4>
                        <input name="m2Name" className="squid-input" placeholder="NAME" required />
                        <input name="m2Reg" className="squid-input" placeholder="REG NUMBER" required />
                        <input name="m2Email" className="squid-input" placeholder="EMAIL" required />
                    </div>
                </div>
                <button className="btn-squid">INITIATE GAME</button>
                <button type="button" onClick={() => setAuthStep('teamName')} style={{ background: 'none', border: 'none', color: '#888', width: '100%', marginTop: '1rem' }}>BACK</button>
            </form>
        </div>
    </div>
);

export default RegisterPage;
