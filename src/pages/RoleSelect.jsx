import React from 'react';
import { Bomb, Shield } from 'lucide-react';

const RoleSelect = ({
    teamData,
    selectRole,
    startRound1,
    setCurrentView
}) => {
    return (
        <div className="lobby-view squid-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/bg.png" className="hero-bg-image" alt="background" />

            <h2 className="green-text" style={{ fontSize: '2.5rem', marginBottom: '3rem', zIndex: 10 }}>
                MISSION_READY: ROLE_SELECTION
            </h2>

            <div className="role-cards" style={{ display: 'flex', gap: '2rem', zIndex: 10 }}>
                <div className="role-card"
                    onClick={() => selectRole('defuser')}
                    style={{
                        background: teamData?.round1?.roleSelection?.member1 === 'defuser' ? 'rgba(0, 255, 102, 0.1)' : '#111',
                        border: teamData?.round1?.roleSelection?.member1 === 'defuser' ? '2px solid #00ff66' : '2px solid #333',
                        padding: '3rem', width: '300px', textAlign: 'center', cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}>
                    <Bomb size={64} color="#00ff66" />
                    <h3>BOMB DEFUSER</h3>
                    {teamData?.round1?.roleSelection?.member1 === 'defuser' && <p className="green-text" style={{ fontSize: '0.8rem', marginTop: '1rem' }}>SELECTED</p>}
                </div>

                <div className="role-card"
                    onClick={() => selectRole('giver')}
                    style={{
                        background: teamData?.round1?.roleSelection?.member1 === 'giver' ? 'rgba(0, 255, 102, 0.1)' : '#111',
                        border: teamData?.round1?.roleSelection?.member1 === 'giver' ? '2px solid #00ff66' : '2px solid #333',
                        padding: '3rem', width: '300px', textAlign: 'center', cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}>
                    <Shield size={64} color="#00ff66" />
                    <h3>INSTRUCTION GIVER</h3>
                    {teamData?.round1?.roleSelection?.member1 === 'giver' && <p className="green-text" style={{ fontSize: '0.8rem', marginTop: '1rem' }}>SELECTED</p>}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', zIndex: 10 }}>
                <button className="btn btn-secondary" onClick={() => setCurrentView('dashboard')} style={{ marginTop: '3rem', padding: '1.5rem 4rem', background: '#333', color: '#fff', fontWeight: 900 }}>Go Back</button>
                <button className="btn btn-primary" onClick={startRound1} style={{ marginTop: '3rem', padding: '1.5rem 4rem', background: '#00ff66', color: '#000', fontWeight: 900 }}>START MISSION</button>
            </div>
        </div>
    );
};

export default RoleSelect;
