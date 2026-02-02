import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism-tomorrow.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Play, Send, Terminal, AlertCircle, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const Round2Page = ({ teamData, socket, setCurrentView, memberIdentifier }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState(null);

    // Round 2 roles: Whisperer (Eyes) and Blind Coder (Hands)
    const activeRole = teamData?.round2Progress?.roleSelection?.[memberIdentifier] || 'whisperer';
    const isQualifed = teamData?.round1?.status === 'completed';

    const problems = teamData?.round2Progress?.problems || [];
    const currentProblem = problems[activeTab];

    useEffect(() => {
        if (!isQualifed) return;
        if (currentProblem) {
            setCode(currentProblem.buggyCode);
        }
    }, [activeTab, teamData, activeRole, isQualifed]);

    const handleRun = async () => {
        setIsRunning(true);
        setOutput("Compiling and Running...\n");
        setResults(null);

        try {
            const testCase = currentProblem.testCases[0];
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/execute`, {
                language: currentProblem.language,
                code: code,
                stdin: testCase.input
            });

            const runOutput = res.data.run.output;
            setOutput(runOutput);

            const isCorrect = runOutput.trim() === testCase.expected.trim();
            setResults({ success: isCorrect, message: isCorrect ? "Test Case Passed!" : "Wrong Answer" });
        } catch (err) {
            setOutput("Error: " + err.message);
        }
        setIsRunning(false);
    };

    const handleSubmit = async () => {
        setIsRunning(true);
        let allPassed = true;
        let feedback = [];

        for (const tc of currentProblem.testCases) {
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/execute`, {
                    language: currentProblem.language,
                    code: code,
                    stdin: tc.input
                });
                const out = res.data.run.output.trim();
                const passed = out === tc.expected.trim();
                if (!passed) allPassed = false;
                feedback.push({ input: tc.input, passed });
            } catch (e) {
                allPassed = false;
            }
        }

        if (allPassed) {
            socket.emit('solveRound2Problem', { teamId: teamData._id, problemIndex: activeTab, code });
            setResults({ success: true, message: "CONGRATULATIONS! MISSION_CLEARED." });
        } else {
            setResults({ success: false, message: "CRITICAL_FAILURE: LOGIC_MISMATCH" });
        }
        setIsRunning(false);
    };

    if (!isQualifed) {
        return (
            <div className="game-over" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#ff3c3c' }}>
                <Lock size={80} style={{ marginBottom: '2rem' }} />
                <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>ACCESS_DENIED</h1>
                <p style={{ color: '#666', marginTop: '1rem' }}>Only teams that defused the bomb in Round 1 can enter the Blind Trust Arena.</p>
                <button className="btn-squid" onClick={() => setCurrentView('dashboard')} style={{ marginTop: '2rem' }}>RETURN_TO_LOBBY</button>
            </div>
        );
    }

    return (
        <div className="round2-portal">
            <div className="portal-sidebar">
                <div className="portal-logo">
                    <Code className="logo-icon" />
                    <span>BLIND_TRUST</span>
                </div>
                <div className="problem-list">
                    {problems.map((p, i) => (
                        <div
                            key={p.id}
                            className={`problem-item ${activeTab === i ? 'active' : ''} ${p.solved ? 'solved' : ''}`}
                            onClick={() => setActiveTab(i)}
                        >
                            <div className="status-dot" />
                            <div className="problem-info">
                                <span className="p-title">{p.title}</span>
                                <span className="p-lang">{p.language.toUpperCase()}</span>
                            </div>
                            {p.solved && <CheckCircle className="solve-icon" size={16} />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="portal-main">
                <div className="portal-header">
                    <div className="active-problem-title">
                        <h2>{currentProblem?.title}</h2>
                        <div className="difficulty-badge">CLASS_A</div>
                    </div>
                    <div className="role-indicator">
                        {activeRole === 'blind_coder' ? <EyeOff /> : <Eye />}
                        <span>ROLE: {activeRole === 'blind_coder' ? 'BLIND_CODER' : 'WHISPERER'}</span>
                    </div>
                </div>

                <div className="portal-content-grid">
                    <div className="description-pane" style={{
                        filter: activeRole === 'blind_coder' ? 'blur(8px)' : 'none',
                        pointerEvents: activeRole === 'blind_coder' ? 'none' : 'auto',
                        opacity: activeRole === 'blind_coder' ? 0.5 : 1
                    }}>
                        <h3><Terminal size={18} /> PROBLEM_SPEC</h3>
                        <div className="p-desc">
                            {currentProblem?.description}
                        </div>
                        <div className="bug-clue-box">
                            <h4>WHISPER_MARKER</h4>
                            <p>Guide your partner. Use precise coordinates. Do not reveal the exact code.</p>
                        </div>
                    </div>

                    <div className="editor-pane">
                        <div className="editor-toolbar">
                            <div className="lang-tag">{currentProblem?.language}</div>
                            <div className="editor-actions">
                                <button className="run-btn" onClick={handleRun} disabled={isRunning || activeRole === 'whisperer'}>
                                    <Play size={16} /> TEST_RUN
                                </button>
                                <button className="submit-btn" onClick={handleSubmit} disabled={isRunning || activeRole === 'whisperer'}>
                                    <Send size={16} /> FINAL_SUBMIT
                                </button>
                            </div>
                        </div>

                        <div className="editor-wrapper">
                            <Editor
                                value={code}
                                onValueChange={code => activeRole === 'blind_coder' ? setCode(code) : null}
                                highlight={code => highlight(code, languages[currentProblem?.language] || languages.js)}
                                padding={20}
                                className="code-editor"
                                readOnly={activeRole === 'whisperer'}
                                style={{
                                    fontFamily: '"Fira code", "Fira Mono", monospace',
                                    fontSize: 14,
                                    minHeight: '100%',
                                    opacity: activeRole === 'whisperer' ? 0.8 : 1,
                                    pointerEvents: activeRole === 'whisperer' ? 'none' : 'auto'
                                }}
                            />
                        </div>

                        <div className="console-area">
                            <div className="console-header">
                                <span>TERMINAL_OUTPUT</span>
                                {results && (
                                    <span className={`res-tag ${results.success ? 'pass' : 'fail'}`}>
                                        {results.message}
                                    </span>
                                )}
                            </div>
                            <div className="console-output">
                                {output || "Standby for signal..."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Round2Page;
