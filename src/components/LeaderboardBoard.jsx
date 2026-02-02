import React from 'react';
import { motion } from 'framer-motion';

const LeaderboardBoard = ({ leaderboard, currentTeamName, setCurrentView }) => {
    return (
        <div className="leaderboard-modal" style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.98)', zIndex: 100000, display: 'flex',
            flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem',
            overflowY: 'auto'
        }}>
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{ color: 'var(--squid-mint)', fontSize: '3rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '5px' }}
            >
                MISSION_COMPLETE: LEADERBOARD
            </motion.h1>

            <div className="leaderboard-table-container" style={{ width: '100%', maxWidth: '900px' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                    <thead>
                        <tr style={{ color: '#666', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Rank</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Team</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Hearts</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Solved</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((team, idx) => {
                            const isMe = team.teamName === currentTeamName;
                            const time = (team.round1Progress?.endTime && team.round1Progress?.startTime)
                                ? Math.floor((new Date(team.round1Progress.endTime) - new Date(team.round1Progress.startTime)) / 1000)
                                : null;

                            return (
                                <motion.tr
                                    key={team._id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    style={{
                                        background: isMe ? 'rgba(0, 255, 102, 0.1)' : '#111',
                                        border: isMe ? '1px solid var(--squid-mint)' : '1px solid #222',
                                        color: team.round1Progress?.status === 'exploded' ? '#666' : '#fff'
                                    }}
                                >
                                    <td style={{ padding: '1.2rem 1rem', borderRadius: '8px 0 0 8px', fontWeight: 900 }}>#{idx + 1}</td>
                                    <td style={{ padding: '1.2rem 1rem', fontWeight: isMe ? 900 : 400 }}>
                                        {team.teamName} {isMe && <span style={{ fontSize: '0.7rem', color: 'var(--squid-mint)', marginLeft: '10px' }}>[YOU]</span>}
                                    </td>
                                    <td style={{ padding: '1.2rem 1rem', textAlign: 'center' }}>
                                        <span style={{ color: team.round1Progress?.lives <= 1 ? '#ff3c3c' : '#00ff66' }}>
                                            {'❤️'.repeat(team.round1Progress?.lives || 0)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.2rem 1rem', textAlign: 'center' }}>
                                        {team.round1Progress?.puzzles?.filter(p => p.solved).length}/3
                                    </td>
                                    <td style={{ padding: '1.2rem 1rem', textAlign: 'right', borderRadius: '0 8px 8px 0', fontFamily: 'var(--font-mono)' }}>
                                        {time ? `${Math.floor(time / 60)}m ${time % 60}s` : (team.round1Progress?.status === 'exploded' ? 'BOOMED' : '---')}
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <button
                className="btn-squid"
                onClick={() => setCurrentView('dashboard')}
                style={{ marginTop: '3rem', background: '#333', color: '#fff' }}
            >
                RETURN_TO_LOBBY
            </button>
        </div>
    );
};

export default LeaderboardBoard;
