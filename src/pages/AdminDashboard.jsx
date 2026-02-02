import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminDashboard = ({ socket, isRedCode, handleLogout, gameState }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [view, setView] = useState('main'); // 'main', 'details_r1', 'details_r2', 'users'

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch(`${API_URL}/api/leaderboard`);
                const data = await res.json();
                setLeaderboard(data);
            } catch (err) { console.error(err); }
        };
        fetchLeaderboard();

        socket.on('adminLeaderboardUpdate', (data) => setLeaderboard(data));

        return () => {
            socket.off('adminLeaderboardUpdate');
        };
    }, [socket]);

    const handleAdminAction = (round, action) => {
        socket.emit('adminAction', { round, action });
    };

    const toggleGameLight = () => {
        socket.emit('toggleRedLight', { status: isRedCode ? 'GREEN' : 'RED' });
    };

    const handleResetBomb = (teamId, teamName) => {
        if (window.confirm(`Are you sure you want to RESET the bomb for team ${teamName}? This will wipe their current progress.`)) {
            socket.emit('resetTeamBomb', { teamId });
        }
    };

    const renderRoundControls = (round) => {
        const state = round === 1 ? gameState.round1 : gameState.round2;

        if (!state.isStarted) {
            return (
                <button className="squid-btn-large" onClick={() => handleAdminAction(round, 'start')}>
                    START_EVENT
                </button>
            );
        }

        if (state.isPaused) {
            return (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    <button className="admin-action-btn view" onClick={() => setView(round === 1 ? 'details_r1' : 'details_r2')}>
                        VIEW_DETAILS
                    </button>
                    <button className="admin-action-btn restart" onClick={() => { if (window.confirm('Restart all games?')) handleAdminAction(round, 'restart') }}>
                        RESTART
                    </button>
                    <button className="admin-action-btn resume" onClick={() => handleAdminAction(round, 'resume')}>
                        RESUME
                    </button>
                </div>
            );
        }

        return (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button className="admin-action-btn pause" onClick={() => handleAdminAction(round, 'pause')}>
                    PAUSE_GAME
                </button>
                <button className="admin-action-btn stop" onClick={() => { if (window.confirm('Force stop this round for ALL TEAMS?')) handleAdminAction(round, 'stop') }}>
                    STOP_GAME
                </button>
                <button className="admin-action-btn view" onClick={() => setView(round === 1 ? 'details_r1' : 'details_r2')}>
                    VIEW_DETAILS
                </button>
            </div>
        );
    };

    return (
        <div className="admin-view" style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
            <header className="admin-header">
                <div className="admin-brand">
                    <h1 className="red-text" style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900 }}>ADMIN_CORE</h1>
                </div>

                <nav className="admin-nav">
                    <button className={`admin-nav-btn ${view === 'main' ? 'active' : ''}`} onClick={() => setView('main')}>OVERVIEW</button>
                    <button className={`admin-nav-btn ${view === 'users' ? 'active' : ''}`} onClick={() => setView('users')}>ALL_TEAMS</button>
                </nav>

                <div className="admin-actions" style={{ display: 'flex', gap: '1rem' }}>
                    <button className={`red-green-toggle ${isRedCode ? 'green' : 'red'}`} onClick={toggleGameLight}>
                        {isRedCode ? 'GREEN_LIGHT' : 'RED_LIGHT'}
                    </button>
                    <button className="admin-nav-btn logout-btn" onClick={() => window.confirm("Logout?") && handleLogout()} style={{ borderColor: '#ff3c3c', color: '#ff3c3c' }}>
                        LOGOUT
                    </button>
                </div>
            </header>

            <main className="admin-page-content" style={{ padding: '2rem' }}>
                {view === 'main' && (
                    <div className="admin-main-grid">
                        <div className="admin-card round-card">
                            <h2>ROUND_01: BOMB_DEFUSAL</h2>
                            <p>Control the primary event state. Start, pause, or monitor pulse levels.</p>
                            <div className="control-container">
                                {renderRoundControls(1)}
                            </div>
                        </div>

                        <div className="admin-card round-card">
                            <h2>ROUND_02: BLIND_TRUST</h2>
                            <p>Manage code debugging challenges. Only qualified teams can participate.</p>
                            <div className="control-container">
                                {renderRoundControls(2)}
                            </div>
                        </div>
                    </div>
                )}

                {(view === 'details_r1' || view === 'details_r2') && (
                    <div className="leaderboard-view">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <button className="squid-btn-small" onClick={() => setView('main')}>BACK</button>
                            <h2 style={{ margin: 0 }}>{view === 'details_r1' ? 'ROUND_01_LEADERBOARD' : 'ROUND_02_QUALIFIERS'}</h2>
                        </div>

                        <div className="detailed-leaderboard">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>RANK</th>
                                        <th>TEAM</th>
                                        <th>LIVES</th>
                                        <th>SOLVED</th>
                                        <th>Status</th>
                                        <th>Time Taken</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard
                                        .filter(team => view === 'details_r1' || team.round1Progress?.status === 'completed')
                                        .map((team, idx) => {
                                            const time = (team.round1Progress?.endTime && team.round1Progress?.startTime)
                                                ? Math.floor((new Date(team.round1Progress.endTime) - new Date(team.round1Progress.startTime)) / 1000)
                                                : 0;
                                            return (
                                                <tr key={team._id} style={{ opacity: team.round1Progress?.status === 'exploded' ? 0.6 : 1 }}>
                                                    <td>#{idx + 1}</td>
                                                    <td>{team.teamName}</td>
                                                    <td>
                                                        <span style={{ color: team.round1Progress?.lives <= 1 ? '#ff3c3c' : '#00ff66' }}>
                                                            {'❤️'.repeat(team.round1Progress?.lives || 0)}
                                                        </span>
                                                    </td>
                                                    <td>{team.round1Progress?.puzzles?.filter(p => p.solved).length}/3</td>
                                                    <td style={{ color: team.round1Progress?.status === 'exploded' ? '#ff3c3c' : (team.round1Progress?.status === 'completed' ? '#00ff66' : '#fff') }}>
                                                        {team.round1Progress?.status?.toUpperCase()}
                                                    </td>
                                                    <td>{time ? `${Math.floor(time / 60)}m ${time % 60}s` : 'N/A'}</td>
                                                    <td>
                                                        <button
                                                            className="squid-btn-small"
                                                            style={{ fontSize: '0.7rem', padding: '0.5rem 1rem', background: '#ff3c3c', border: '1px solid maroon' }}
                                                            onClick={() => handleResetBomb(team._id || team.teamName, team.teamName)}
                                                        >
                                                            RESET
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {view === 'users' && (
                    <div className="user-view">
                        <h2 style={{ marginBottom: '2rem' }}>REGISTERED_TEAMS_DATA</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>TEAM_NAME</th>
                                    <th>MEMBER_1</th>
                                    <th>MEMBER_2</th>
                                    <th>SCORE</th>
                                    <th>REG_DATE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map(team => (
                                    <tr key={team._id}>
                                        <td style={{ fontWeight: 900 }}>{team.teamName}</td>
                                        <td>{team.member1?.name} ({team.member1?.regNo})</td>
                                        <td>{team.member2?.name} ({team.member2?.regNo})</td>
                                        <td><span className="score-badge">{team.score || 0}</span></td>
                                        <td>{new Date(team.registrationTime).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <style>{`
                .admin-main-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    margin-top: 2rem;
                }
                .admin-card {
                    background: rgba(20, 20, 20, 0.8);
                    border: 1px solid #333;
                    border-radius: 20px;
                    padding: 3rem;
                    text-align: center;
                    transition: all 0.3s ease;
                }
                .admin-card:hover {
                    border-color: var(--squid-pink);
                    background: rgba(30, 30, 30, 0.9);
                    transform: translateY(-5px);
                }
                .admin-card h2 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    color: var(--squid-pink);
                    letter-spacing: 2px;
                }
                .admin-card p {
                    color: #888;
                    margin-bottom: 2rem;
                }
                .control-container {
                    display: flex;
                    justify-content: center;
                    min-height: 80px;
                    align-items: center;
                }
                .squid-btn-large {
                    background: var(--squid-pink);
                    color: #fff;
                    border: none;
                    padding: 1.5rem 3rem;
                    font-size: 1.5rem;
                    font-weight: 900;
                    border-radius: 50px;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 0 20px rgba(237, 30, 121, 0.3);
                }
                .squid-btn-large:hover {
                    background: #ff2d88;
                    box-shadow: 0 0 30px rgba(237, 30, 121, 0.5);
                    transform: scale(1.05);
                }
                .admin-action-btn {
                    padding: 1rem 2rem;
                    border-radius: 12px;
                    font-weight: 800;
                    cursor: pointer;
                    border: 2px solid transparent;
                    transition: all 0.2s;
                }
                .admin-action-btn.view { background: #333; color: #fff; border-color: #555; }
                .admin-action-btn.view:hover { background: #444; }
                .admin-action-btn.pause { background: transparent; color: #ff3c3c; border-color: #ff3c3c; }
                .admin-action-btn.pause:hover { background: #ff3c3c; color: #fff; }
                .admin-action-btn.resume { background: #00ff66; color: #000; }
                .admin-action-btn.restart { background: transparent; color: #aaa; border-color: #444; }
                .admin-action-btn.restart:hover { color: #fff; border-color: #fff; }
                .admin-action-btn.stop { background: transparent; color: #ff6600; border-color: #ff6600; }
                .admin-action-btn.stop:hover { background: #ff6600; color: #fff; }

                .admin-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0 10px;
                }
                .admin-table th {
                    text-align: left;
                    padding: 1rem;
                    color: #666;
                    font-size: 0.8rem;
                    letter-spacing: 1px;
                }
                .admin-table td {
                    padding: 1.5rem 1rem;
                    background: #111;
                }
                .admin-table tr td:first-child { border-radius: 12px 0 0 12px; }
                .admin-table tr td:last-child { border-radius: 0 12px 12px 0; }
                .score-badge {
                    background: var(--squid-mint);
                    color: #000;
                    padding: 0.2rem 0.8rem;
                    border-radius: 4px;
                    font-weight: 900;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
