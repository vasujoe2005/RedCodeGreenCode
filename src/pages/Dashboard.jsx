import React from 'react';

const Dashboard = ({ setCurrentView, gameState }) => {
    const r1Started = gameState?.round1?.isStarted;
    const r2Started = gameState?.round2?.isStarted;

    return (
        <div className="dashboard-wrapper squid-container" style={{ minHeight: '100vh', padding: '6rem 2rem 2rem' }}>
            <img src="/bg.png" className="hero-bg-image" alt="background" />

            <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', textAlign: 'center', zIndex: 10 }}>
                <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '4rem', letterSpacing: '5px' }}>
                    CHOOSE YOUR <span style={{ color: 'var(--squid-pink)' }}>FATE</span>
                </h2>

                <div className="rounds-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                    {/* Round 1 Card */}
                    <div className="round-card-large" style={{
                        background: 'rgba(20, 20, 20, 0.8)',
                        border: `2px solid ${r1Started ? 'var(--squid-mint)' : '#333'}`,
                        padding: '3rem', borderRadius: '20px', backdropFilter: 'blur(10px)', textAlign: 'left',
                        opacity: r1Started ? 1 : 0.7
                    }}>
                        <h3 style={{ color: r1Started ? 'var(--squid-mint)' : '#888', fontSize: '2rem', marginBottom: '1.5rem' }}>ROUND 01: LOGIC ARENA</h3>
                        <p style={{ opacity: 0.8, fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                            Step into a high-stakes bomb defusal simulation. Cooperation is the only way to survive the countdown.
                        </p>

                        {!r1Started && (
                            <p style={{ color: '#ff3c3c', fontWeight: 800, marginBottom: '1rem' }}>ASK ADMIN TO START THE GAME</p>
                        )}

                        <button
                            className="btn-squid"
                            disabled={!r1Started}
                            onClick={() => setCurrentView('role_select')}
                            style={{ background: r1Started ? 'var(--squid-mint)' : '#222', color: r1Started ? '#000' : '#444' }}
                        >
                            {r1Started ? 'STEP INTO THE GAME' : 'RESTRICTED_ACCESS'}
                        </button>
                    </div>

                    {/* Round 2 Card */}
                    <div className="round-card-large" style={{
                        background: 'rgba(20, 20, 20, 0.8)',
                        border: `2px solid ${r2Started ? 'var(--squid-pink)' : '#333'}`,
                        padding: '3rem', borderRadius: '20px', backdropFilter: 'blur(10px)', textAlign: 'left',
                        opacity: r2Started ? 1 : 0.7
                    }}>
                        <h3 style={{ color: r2Started ? 'var(--squid-pink)' : '#888', fontSize: '1.8rem', marginBottom: '1.5rem' }}>ROUND 02: BLIND TRUST</h3>
                        <p style={{ opacity: 0.8, fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                            The ultimate test of binary trust. Collaboration is the only way to survive.
                        </p>

                        {!r2Started && (
                            <p style={{ color: '#ff3c3c', fontWeight: 800, marginBottom: '1rem' }}>ASK ADMIN TO START THE GAME</p>
                        )}

                        <button
                            className="btn-squid"
                            disabled={!r2Started}
                            onClick={() => setCurrentView('role_select_r2')}
                            style={{ background: r2Started ? 'var(--squid-pink)' : '#222', color: r2Started ? '#fff' : '#444' }}
                        >
                            {r2Started ? 'ACCEPT THE INVITATION' : 'RESTRICTED_ACCESS'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
