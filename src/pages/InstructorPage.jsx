import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SequenceManual, AdvancedWireManual, SymbolManual, GridNumberManual, MorseSymbolManual, MemoryManual } from '../components/Round1Puzzles';

const InstructorPage = ({
    teamData,
    setCurrentView,
    selectModule,
    isRedCode
}) => {
    const [timeLeft, setTimeLeft] = useState(600);
    const gameStatus = teamData?.round1?.status;

    useEffect(() => {
        if (!teamData?.round1?.startTime) return;
        const interval = setInterval(() => {
            const start = new Date(teamData.round1.startTime).getTime();
            const now = new Date().getTime();
            const elapsed = Math.floor((now - start) / 1000);
            const remaining = 600 - elapsed;
            if (remaining <= 0) {
                setTimeLeft(0);
                clearInterval(interval);
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [teamData?.round1?.startTime]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (gameStatus === 'exploded' || timeLeft === 0) return <div className="game-over" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#ff3c3c' }}><h1>BOMB EXPLODED!</h1></div>;
    if (gameStatus === 'completed') return <div className="game-over" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#00ff66' }}><h1>BOMB DEFUSED!</h1></div>;

    const renderManual = (puzzle) => {
        switch (puzzle.puzzleType) {
            case 'grid_number': return <GridNumberManual data={puzzle.data} />;
            case 'sequence': return <SequenceManual data={puzzle.data} />;
            case 'symbols': return <SymbolManual data={puzzle.data} />;
            case 'advanced_wires': return <AdvancedWireManual />;
            case 'morse_symbols': return <MorseSymbolManual data={puzzle.data} />;
            case 'memory': return <MemoryManual />;
            default: return null;
        }
    };

    const activeIndex = teamData?.round1?.selectedModuleIndex ?? -1;
    const currentPuzzle = teamData?.round1?.puzzles?.[activeIndex];

    return (
        <div className="arena-floor">
            <div className="instructor-header">
                <div className="timer-led-big">{formatTime(timeLeft)}</div>

                <div className="protocol-selector-tabs">
                    {teamData?.round1?.puzzles?.map((p, i) => (
                        <div
                            key={i}
                            className={`protocol-tab ${i === activeIndex ? 'active' : ''} ${p.solved ? 'solved' : ''}`}
                            onClick={() => selectModule(i)}
                        >
                            MISSION_{String.fromCharCode(65 + i)}
                        </div>
                    ))}
                </div>
            </div>

            <motion.div key="internal" className="internal-arena" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="instruction-manual" style={{ background: '#111', padding: '4rem', border: '5px solid #222', boxSizing: 'border-box', width: '800px' }}>
                    <h2 className="green-text" style={{ textAlign: 'center', marginBottom: '2rem' }}>SECURE_PROTOCOL_MANUAL</h2>
                    <div className="manual-content">
                        {currentPuzzle ? renderManual(currentPuzzle) : (
                            <div style={{ textAlign: 'center', color: '#666', marginTop: '20%' }}>
                                <h2>WAITING FOR FOCUS...</h2>
                                <p>TELL DEFUSER TO SELECT A MODULE</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
            {isRedCode && <div className="red-overlay"><div className="freeze-text">FREEZE</div></div>}
        </div>
    );
};

export default InstructorPage;
