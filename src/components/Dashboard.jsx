import React, { useState, useEffect } from 'react';
import { Award, Flame, CheckCircle, GraduationCap, ArrowRight, Zap, Play, Send } from 'lucide-react';
import { api } from '../api';

export default function Dashboard({ profile, roadmap, onNavigateToModule, onNavigateToTab, onUpdateProfileState }) {
    const [chatText, setChatText] = useState("");
    const [chatMessages, setChatMessages] = useState([
        { sender: 'assistant', text: `Hi ${profile.name}! I am your PathPilot AI Mentor. I have analyzed your skills and built a custom learning path for you to become a ${profile.targetGoal}. How can I help you today?` }
    ]);
    const [chatLoading, setChatLoading] = useState(false);

    // Active project tracking
    const [activeProject, setActiveProject] = useState(null);

    useEffect(() => {
        fetchActiveProject();
    }, []);

    const fetchActiveProject = async () => {
        try {
            const list = await api.getProjects();
            const active = list.find(p => p.status === 'IN_PROGRESS' || p.status === 'PAUSED');
            if (active) {
                const details = await api.getProjectDetails(active.id);
                setActiveProject(details);
            }
        } catch (err) {
            console.log("No active project found.", err);
        }
    };

    // Calculate overall progress percentage
    let totalModules = 0;
    let completedModules = 0;
    let nextBestAction = null;

    roadmap.forEach(phase => {
        phase.modules.forEach(mod => {
            totalModules++;
            if (mod.status === 'Completed') {
                completedModules++;
            }
            // First available or in-progress module is the Next Best Action
            if (!nextBestAction && (mod.status === 'Available' || mod.status === 'In_Progress')) {
                nextBestAction = mod;
            }
        });
    });

    // Fallback if all modules are completed
    if (!nextBestAction && roadmap.length > 0 && roadmap[0].modules.length > 0) {
        nextBestAction = roadmap[0].modules[0];
    }

    const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

    const handleSendChat = async (e) => {
        e.preventDefault();
        if (!chatText.trim() || chatLoading) return;

        const userMsg = chatText;
        setChatText("");
        setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setChatLoading(true);

        try {
            const aiMsg = await api.sendChatMessage(userMsg);
            setChatMessages(prev => [...prev, { sender: 'assistant', text: aiMsg.text }]);
        } catch (err) {
            setChatMessages(prev => [...prev, { sender: 'assistant', text: "Sorry, I couldn't reach the AI Mentor service. Please check if the backend is running." }]);
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '0' }}>
            
            {/* Welcome banner */}
            <div>
                <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', fontFamily: 'Outfit' }}>
                    Welcome back, {profile.name} 👋
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                    You are <strong style={{ color: 'var(--primary)' }}>{progressPercent}%</strong> of the way through your journey to becoming a <strong style={{ color: 'var(--primary)' }}>{profile.targetGoal}</strong>.
                </p>
            </div>

            {/* Metrics cards */}
            <div className="stats-grid">
                
                {/* Overall Progress */}
                <div className="card-premium stats-card-vertical">
                    <div className="stats-card-icon-container" style={{ backgroundColor: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>
                        <GraduationCap size={24} />
                    </div>
                    <div>
                        <div className="stats-card-label">Overall Progress</div>
                        <div className="stats-card-value">{progressPercent}%</div>
                        <div className="progress-container" style={{ width: '80px', marginTop: '6px' }}>
                            <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Daily Streak */}
                <div className="card-premium stats-card-vertical">
                    <div className="stats-card-icon-container" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: 'var(--warning)' }}>
                        <Flame size={24} />
                    </div>
                    <div>
                        <div className="stats-card-label">Daily Streak</div>
                        <div className="stats-card-value">{profile.streak} Day{profile.streak !== 1 ? 's' : ''}</div>
                        <div className="stats-card-subtext">Keep it up!</div>
                    </div>
                </div>

                {/* Modules Completed */}
                <div className="card-premium stats-card-vertical">
                    <div className="stats-card-icon-container" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--accent)' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <div className="stats-card-label">Modules Completed</div>
                        <div className="stats-card-value">{completedModules} / {totalModules}</div>
                        <div className="stats-card-subtext">{totalModules - completedModules} modules left</div>
                    </div>
                </div>

                {/* Assessment Avg */}
                <div className="card-premium stats-card-vertical">
                    <div className="stats-card-icon-container" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#a5b4fc' }}>
                        <Award size={24} />
                    </div>
                    <div>
                        <div className="stats-card-label">Assessment Avg</div>
                        <div className="stats-card-value">{profile.assessmentAverage}%</div>
                        <div className="stats-card-subtext">{profile.xp} XP Gained</div>
                    </div>
                </div>

            </div>

            {/* Active Project Card */}
            {activeProject && (
                <div className="card-premium" style={{ borderColor: 'rgba(16, 185, 129, 0.4)', background: 'linear-gradient(135deg, rgba(22, 33, 54, 0.8), rgba(16, 185, 129, 0.05))', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            🛠️ Current Active Project
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#6ee7b7' }}>
                            {activeProject.progress}% Complete
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 4px 0' }}>{activeProject.name}</h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0' }}>{activeProject.description}</p>
                        </div>
                        <button className="btn-primary" onClick={() => onNavigateToTab('projects')} style={{ fontSize: '11px', padding: '8px 16px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Resume Coding <ArrowRight size={12} />
                        </button>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', marginTop: '4px' }}>
                        <div style={{ height: '100%', width: `${activeProject.progress}%`, backgroundColor: '#10b981', transition: 'width 0.4s ease' }}></div>
                    </div>
                </div>
            )}

            {/* Next Best Action Card */}
            {nextBestAction && (
                <div className="card-premium" style={{ borderColor: '#CBD5E1', background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(37,99,235,0.02) 100%)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                        <span className="badge-item" style={{ backgroundColor: '#EFF6FF', border: '1px solid rgba(37,99,235,0.2)', color: '#2563EB', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>
                            <Zap size={10} /> {nextBestAction.estimatedDuration}
                        </span>
                        <span className="badge-item" style={{ backgroundColor: '#ECFDF5', border: '1px solid rgba(22,163,74,0.2)', color: '#16A34A', display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>
                            {nextBestAction.difficulty}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '20px' }}>🎯</span>
                        <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.05em', fontWeight: '700' }}>Next Best Action</h4>
                    </div>

                    <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                        {nextBestAction.topic}
                    </h2>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px', maxWidth: '800px' }}>
                        {nextBestAction.description}
                    </p>

                    <div style={{ padding: '12px 16px', backgroundColor: '#EFF6FF', borderLeft: '3px solid var(--primary)', borderRadius: '4px', marginBottom: '24px', fontSize: '13px', color: '#1E40AF', fontStyle: 'italic' }}>
                        <strong>Why recommended:</strong> "{nextBestAction.whyRecommended}"
                    </div>

                    <button className="btn-primary" onClick={() => onNavigateToModule(nextBestAction.id)}>
                        Continue Learning <Play size={14} fill="#fff" />
                    </button>
                </div>
            )}

            {/* Bottom Section Layout */}
            <div className="dashboard-grid" style={{ padding: '0', gridTemplateColumns: '1.2fr 1fr' }}>
                
                {/* Skill Development panel */}
                <div className="card-premium">
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', fontFamily: 'Outfit' }}>📈 Skill Profile & Gap Analysis</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                        Your current skill level compared to the target required level for a <strong>{profile.targetGoal}</strong>.
                    </p>
                    
                    <div className="skill-list">
                        {profile.skills.map((skill) => {
                            // target required level is generally intermediate (60%) or advanced (80%) for main skills
                            const isSOC = profile.targetGoal.toLowerCase().includes("soc");
                            const isJava = profile.targetGoal.toLowerCase().includes("java");
                            const isDS = profile.targetGoal.toLowerCase().includes("data");

                            let requiredLevel = 60; // default required
                            if (skill.name === 'Python' || skill.name === 'Linux' || skill.name === 'Java' || skill.name === 'OOP' || skill.name === 'Statistics') {
                                requiredLevel = 80; // Core requirements
                            }
                            
                            const gap = requiredLevel - skill.level;
                            const isHighGap = gap > 30;

                            return (
                                <div key={skill.name} className="skill-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '12px' }}>
                                    <div className="skill-info" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontWeight: '600' }}>{skill.name}</span>
                                            {isHighGap && (
                                                <span style={{ fontSize: '10px', color: '#fca5a5', backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                                                    HIGH GAP
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '12px' }}>
                                            <span style={{ color: skill.level >= requiredLevel ? 'var(--accent)' : 'var(--text-secondary)' }}>
                                                Current: {skill.level}%
                                            </span>
                                            <span style={{ color: 'var(--text-secondary)', margin: '0 6px' }}>/</span>
                                            <span>Req: {requiredLevel}%</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                                        <div className="skill-bar-outer" style={{ flex: '1', height: '8px' }}>
                                            <div 
                                                className="skill-bar-fill" 
                                                style={{ 
                                                    width: `${skill.level}%`,
                                                    background: isHighGap 
                                                        ? 'linear-gradient(90deg, #ef4444, #f59e0b)' 
                                                        : 'linear-gradient(90deg, var(--primary), var(--accent))'
                                                }}
                                            ></div>
                                        </div>
                                        <span style={{ fontSize: '11px', color: isHighGap ? '#ef4444' : 'var(--text-secondary)', width: '60px', textAlign: 'right', fontWeight: '500' }}>
                                            {isHighGap ? 'High Gap' : (gap <= 0 ? 'None' : 'Moderate')}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* AI Mentor Chat Widget */}
                <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', height: '420px', padding: '0' }}>
                    <div className="chat-header" style={{ padding: '16px 20px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }}></div>
                        <div>
                            <div style={{ fontWeight: '700', fontSize: '14px' }}>Ask Your AI Mentor</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Context-Aware Assistant</div>
                        </div>
                    </div>
                    
                    <div className="chat-messages" style={{ padding: '16px 20px', flex: '1', maxHeight: '280px', overflowY: 'auto' }}>
                        {chatMessages.map((msg, index) => (
                            <div key={index} className={`chat-bubble ${msg.sender}`} style={{ marginBottom: '8px', padding: '10px 14px', fontSize: '13px' }}>
                                {msg.text}
                            </div>
                        ))}
                        {chatLoading && (
                            <div className="chat-bubble assistant" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                Thinking...
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSendChat} className="chat-input-area" style={{ padding: '12px 20px' }}>
                        <input
                            type="text"
                            value={chatText}
                            onChange={(e) => setChatText(e.target.value)}
                            placeholder="Explain TCP/IP in simple terms..."
                            className="chat-input"
                            style={{ padding: '10px 14px', fontSize: '13px' }}
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '10px', borderRadius: 'var(--border-radius-sm)', width: '38px', height: '38px', justifyContent: 'center' }}>
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Badges and Activity Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="card-premium">
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', fontFamily: 'Outfit' }}>🏆 Earned Milestones & Badges</h3>
                    <div className="badge-list">
                        {profile.badges.map((badge, idx) => (
                            <span key={idx} className="badge-item" style={{ padding: '6px 12px', fontSize: '12px' }}>
                                🎖️ {badge}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="card-premium">
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', fontFamily: 'Outfit' }}>📋 Recent Activities</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '120px', overflowY: 'auto' }}>
                        {profile.recentActivities.map((act, idx) => (
                            <div key={idx} style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                <span style={{ color: 'var(--primary)' }}>•</span>
                                <span>{act}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
