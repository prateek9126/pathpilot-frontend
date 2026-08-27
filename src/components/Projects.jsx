import React, { useState, useEffect } from 'react';
import { Briefcase, ChevronLeft, CheckCircle, Clock, Award, ShieldAlert, Sparkles, BookOpen, Layers, Bot, Send, Trash2, HelpCircle, ArrowRight, Play, Pause, AlertOctagon, HelpCircle as HelpIcon, Columns } from 'lucide-react';
import { api } from '../api';

export default function Projects({ profile, onUpdateProfileState, onNavigateToTab }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // View state: list vs detail
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // AI Assistant state
    const [chatQuery, setChatQuery] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);

    // Project Comparison state
    const [compareList, setCompareList] = useState([]);
    const [showComparison, setShowComparison] = useState(false);
    const [compareResults, setCompareResults] = useState([]);

    // Features checkbox scope tracking
    const [enabledFeatures, setEnabledFeatures] = useState({});

    useEffect(() => {
        loadRecommendations();
    }, [profile]);

    const loadRecommendations = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await api.getProjects();
            setProjects(data);
        } catch (err) {
            setError("Failed to load recommended projects.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectProject = async (id) => {
        setSelectedProjectId(id);
        setDetailLoading(true);
        try {
            const p = await api.getProjectDetails(id);
            setSelectedProject(p);
            // Reset chat
            setChatMessages([
                { sender: 'assistant', text: `Hi ${profile.name || 'there'}! I am your AI Project Assistant for **${p.name}**.\n\nI can write your SQL schemas, draft starter files, configure directories, or answer debugging questions. Try clicking one of the quick suggestions below!` }
            ]);
            // Pre-fill features as selected
            const featuresMap = {};
            if (p.mvpFeatures) p.mvpFeatures.forEach(f => featuresMap[f] = true);
            setEnabledFeatures(featuresMap);
        } catch (err) {
            setError("Failed to load project details.");
        } finally {
            setDetailLoading(false);
        }
    };

    const handleBackToList = () => {
        setSelectedProjectId(null);
        setSelectedProject(null);
        loadRecommendations(); // refresh to update dashboard stats
    };

    const handleStartProject = async () => {
        if (!selectedProject) return;
        try {
            const updated = await api.startProject(selectedProject.id);
            setSelectedProject(updated);
            alert(`Project Started! Complete the Roadmap milestones sequentially to update your progress. 300 XP will be awarded upon full completion.`);
        } catch (err) {
            alert("Error starting project.");
        }
    };

    const handleToggleMilestone = async (idx) => {
        if (!selectedProject || selectedProject.status === "NOT_STARTED") return;
        try {
            const updated = await api.completeProjectMilestone(selectedProject.id, idx);
            setSelectedProject(updated);
        } catch (err) {
            alert("Error updating milestone.");
        }
    };

    const handleUpdateStatus = async (status) => {
        if (!selectedProject) return;
        try {
            const updated = await api.updateProjectStatus(selectedProject.id, status);
            setSelectedProject(updated);
        } catch (err) {
            alert("Error updating status.");
        }
    };

    const handleAssistantChat = async (presetQuery = null) => {
        const query = presetQuery || chatQuery;
        if (!query.trim() || !selectedProject) return;

        // User message
        const newMsg = { sender: 'user', text: query };
        setChatMessages(prev => [...prev, newMsg]);
        setChatQuery("");
        setChatLoading(true);

        try {
            const res = await api.sendProjectAssistantMessage(selectedProject.id, query);
            setChatMessages(prev => [...prev, { sender: 'assistant', text: res.reply }]);
        } catch (err) {
            setChatMessages(prev => [...prev, { sender: 'assistant', text: "Sorry, I couldn't reach the AI assistant. Please check your backend connection." }]);
        } finally {
            setChatLoading(false);
        }
    };

    // Comparison handlers
    const handleToggleCompare = (id) => {
        if (compareList.includes(id)) {
            setCompareList(prev => prev.filter(item => item !== id));
        } else {
            if (compareList.length >= 3) {
                alert("You can compare up to 3 projects at a time.");
                return;
            }
            setCompareList(prev => [...prev, id]);
        }
    };

    const handleCompareAction = async () => {
        if (compareList.length < 2) {
            alert("Please select at least 2 projects to compare.");
            return;
        }
        setDetailLoading(true);
        try {
            const results = await api.compareProjects(compareList);
            setCompareResults(results);
            setShowComparison(true);
        } catch (err) {
            alert("Failed to compare projects.");
        } finally {
            setDetailLoading(false);
        }
    };

    const handleToggleFeature = (feat) => {
        setEnabledFeatures(prev => ({
            ...prev,
            [feat]: !prev[feat]
        }));
    };

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'Beginner': return '#6ee7b7';
            case 'Intermediate': return '#fbd38d';
            case 'Advanced': return '#fca5a5';
            default: return 'var(--text-secondary)';
        }
    };

    // Calculate match score color
    const getMatchScoreColor = (score) => {
        if (score >= 90) return '#10b981';
        if (score >= 70) return 'var(--primary)';
        return '#f59e0b';
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '12px' }}>
                <div className="spin" style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Matching projects to your skill matrix...</span>
            </div>
        );
    }

    if (showComparison) {
        return (
            <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <button className="btn-secondary" onClick={() => setShowComparison(false)} style={{ alignSelf: 'flex-start' }}>
                    <ChevronLeft size={16} /> Back to Projects
                </button>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Outfit' }}>📊 Project Comparison Matrix</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Compare difficulty, stack, match scores, and time commitments side-by-side.</p>
                </div>

                <div className="card-premium" style={{ overflowX: 'auto', padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.15)' }}>
                                <th style={{ padding: '16px', fontWeight: '800', width: '200px' }}>Metric</th>
                                {compareResults.map(p => (
                                    <th key={p.id} style={{ padding: '16px', fontWeight: '800' }}>{p.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-secondary)' }}>Difficulty</td>
                                {compareResults.map(p => (
                                    <td key={p.id} style={{ padding: '16px', color: getDifficultyColor(p.difficulty), fontWeight: '700' }}>
                                        {p.difficulty === 'Beginner' ? '🟢' : (p.difficulty === 'Intermediate' ? '🟡' : '🔴')} {p.difficulty}
                                    </td>
                                ))}
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-secondary)' }}>Skill Match Score</td>
                                {compareResults.map(p => (
                                    <td key={p.id} style={{ padding: '16px', fontWeight: '800', color: getMatchScoreColor(p.matchScore) }}>
                                        {p.matchScore}% Match
                                    </td>
                                ))}
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-secondary)' }}>Duration</td>
                                {compareResults.map(p => (
                                    <td key={p.id} style={{ padding: '16px' }}>⏱️ {p.duration || '2 weeks'}</td>
                                ))}
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-secondary)' }}>Tech Stack</td>
                                {compareResults.map(p => (
                                    <td key={p.id} style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {p.technologyStack && Object.entries(p.technologyStack).map(([layer, tech]) => (
                                                <span key={layer} style={{ fontSize: '11px' }}>
                                                    <strong>{layer}:</strong> {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-secondary)' }}>Skills to Gain</td>
                                {compareResults.map(p => (
                                    <td key={p.id} style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {p.skillsToImprove && p.skillsToImprove.map(s => (
                                                <span key={s} className="badge-item" style={{ fontSize: '10px', padding: '2px 6px', border: 'none', backgroundColor: 'rgba(99,102,241,0.1)' }}>{s}</span>
                                            ))}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-secondary)' }}>Portfolio Value</td>
                                {compareResults.map(p => (
                                    <td key={p.id} style={{ padding: '16px', fontWeight: '700', color: '#ff7a00' }}>⭐ {p.portfolioValue || 'High'}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '0 32px', maxWidth: '1200px', margin: '0 auto' }}>

            {/* ERROR STATUS */}
            {error && (
                <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid var(--danger)', borderRadius: '8px', marginBottom: '24px' }}>
                    {error}
                </div>
            )}

            {/* DETAIL VIEW */}
            {selectedProject ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    {/* Header Controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button className="btn-secondary" onClick={handleBackToList}>
                            <ChevronLeft size={16} /> Back to Recommendations
                        </button>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {selectedProject.status === "NOT_STARTED" && (
                                <button className="btn-primary" onClick={handleStartProject} style={{ padding: '10px 24px' }}>
                                    Start Project 🚀
                                </button>
                            )}
                            {selectedProject.status === "IN_PROGRESS" && (
                                <>
                                    <button className="btn-secondary" onClick={() => handleUpdateStatus("PAUSED")}>
                                        <Pause size={14} /> Pause Project
                                    </button>
                                    <button className="btn-secondary" onClick={() => handleUpdateStatus("NOT_STARTED")} style={{ color: '#fca5a5' }}>
                                        <AlertOctagon size={14} /> Abandon Project
                                    </button>
                                </>
                            )}
                            {selectedProject.status === "PAUSED" && (
                                <>
                                    <button className="btn-primary" onClick={() => handleUpdateStatus("IN_PROGRESS")}>
                                        <Play size={14} /> Resume Project
                                    </button>
                                    <button className="btn-secondary" onClick={() => handleUpdateStatus("NOT_STARTED")} style={{ color: '#fca5a5' }}>
                                        <AlertOctagon size={14} /> Abandon Project
                                    </button>
                                </>
                            )}
                            {selectedProject.status === "COMPLETED" && (
                                <span style={{ padding: '8px 16px', backgroundColor: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: '1px solid #10b981', borderRadius: '6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <CheckCircle size={16} /> Fully Completed (300 XP Earned)
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Project Title Block */}
                    <div className="card-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>
                                {selectedProject.category}
                            </span>
                            <h1 style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'Outfit' }}>{selectedProject.name}</h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '800px', lineHeight: '1.5' }}>
                                {selectedProject.description}
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(99,102,241,0.05)', padding: '16px 24px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '28px', fontWeight: '900', color: getMatchScoreColor(selectedProject.matchScore) }}>
                                {selectedProject.matchScore}%
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>
                                Skill Match
                            </span>
                        </div>
                    </div>

                    {/* Progress indicator */}
                    {selectedProject.status !== "NOT_STARTED" && (
                        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                <span>🚀 Project Completion Progress</span>
                                <strong>{selectedProject.progress}% Completed</strong>
                            </div>
                            <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${selectedProject.progress}%`, backgroundColor: '#10b981', transition: 'width 0.4s ease' }} />
                            </div>
                        </div>
                    )}

                    {/* Grid split: Left Details, Right AI Assistant */}
                    <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '32px' }}>
                        
                        {/* LEFT COLUMN: CURRICULUM & DETAILS */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            
                            {/* Why Recommend */}
                            <div style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(0, 0, 0, 0.1))', borderLeft: '3px solid var(--primary)', borderRadius: '4px' }}>
                                <h4 style={{ fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#ff7a00' }}>
                                    <Sparkles size={14} /> Why We Recommend This Project
                                </h4>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                    {selectedProject.whyRecommended}
                                </p>
                            </div>

                            {/* Skills breakdown */}
                            <div className="card-premium">
                                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Award size={18} /> Skill Prerequisites Audit
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', marginBottom: '6px' }}>Already Have ✅</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {selectedProject.existingSkills && selectedProject.existingSkills.map(s => (
                                                <span key={s} className="badge-item" style={{ borderColor: 'rgba(16,185,129,0.3)', backgroundColor: 'rgba(16,185,129,0.05)', color: '#6ee7b7' }}>{s}</span>
                                            ))}
                                            {(!selectedProject.existingSkills || selectedProject.existingSkills.length === 0) && (
                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>None yet</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '700', marginBottom: '6px' }}>Need to Learn 📚</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                                            {selectedProject.skillsToLearn && selectedProject.skillsToLearn.map(s => (
                                                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span className="badge-item" style={{ borderColor: 'rgba(245,158,11,0.3)', color: '#fbd38d' }}>{s}</span>
                                                    <button 
                                                        onClick={() => onNavigateToTab('resources')}
                                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '10px', cursor: 'pointer', textDecoration: 'underline', padding: '0' }}
                                                    >
                                                        Find Resources
                                                    </button>
                                                </div>
                                            ))}
                                            {(!selectedProject.skillsToLearn || selectedProject.skillsToLearn.length === 0) && (
                                                <span style={{ fontSize: '11px', color: '#6ee7b7' }}>All prerequisites met! You are ready to code.</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', marginBottom: '6px' }}>Will Improve / Gain 🚀</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {selectedProject.skillsToImprove && selectedProject.skillsToImprove.map(s => (
                                                <span key={s} className="badge-item" style={{ borderColor: 'rgba(99,102,241,0.3)', color: '#a5b4fc' }}>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tech Stack list */}
                            <div className="card-premium">
                                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Layers size={18} /> Technology Stack Configuration
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                    {selectedProject.technologyStack && Object.entries(selectedProject.technologyStack).map(([layer, tech]) => (
                                        <div key={layer} style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                            <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{layer}</span>
                                            <span style={{ fontSize: '13px', fontWeight: '700' }}>{tech}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Interactive Project Roadmap */}
                            <div className="card-premium">
                                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Clock size={18} /> Step-by-Step Project Roadmap
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '20px' }}>
                                    {selectedProject.status === "NOT_STARTED" ? "⚠️ Start the project to begin tracking your milestones." : "Check off phases as you code to update your progress."}
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {selectedProject.roadmap && selectedProject.roadmap.map((step, idx) => {
                                        const parts = step.split(':');
                                        const title = parts[0];
                                        const desc = parts[1] || "";
                                        const completed = selectedProject.completedPhases && selectedProject.completedPhases[idx];

                                        return (
                                            <div 
                                                key={idx}
                                                style={{ 
                                                    display: 'flex', 
                                                    gap: '12px', 
                                                    padding: '12px 16px', 
                                                    backgroundColor: completed ? 'rgba(16,185,129,0.03)' : 'rgba(0,0,0,0.1)', 
                                                    border: '1px solid', 
                                                    borderColor: completed ? 'rgba(16,185,129,0.2)' : 'var(--border-color)', 
                                                    borderRadius: '6px',
                                                    alignItems: 'flex-start',
                                                    opacity: selectedProject.status === "NOT_STARTED" ? 0.6 : 1
                                                }}
                                            >
                                                <input 
                                                    type="checkbox"
                                                    checked={!!completed}
                                                    disabled={selectedProject.status === "NOT_STARTED"}
                                                    onChange={() => handleToggleMilestone(idx)}
                                                    style={{ marginTop: '3px', accentColor: '#10b981', cursor: selectedProject.status === "NOT_STARTED" ? 'default' : 'pointer' }}
                                                />
                                                <div>
                                                    <strong style={{ display: 'block', fontSize: '13px', color: completed ? '#6ee7b7' : 'var(--text-primary)' }}>{title}</strong>
                                                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>{desc}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Suggested Features Checklist */}
                            {selectedProject.mvpFeatures && selectedProject.mvpFeatures.length > 0 && (
                                <div className="card-premium">
                                    <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>💡 Custom Scope Checklist</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div>
                                            <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', marginBottom: '6px' }}>MVP Features (Required)</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {selectedProject.mvpFeatures.map(f => (
                                                    <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                                                        <input type="checkbox" checked={!!enabledFeatures[f]} onChange={() => handleToggleFeature(f)} style={{ accentColor: 'var(--primary)' }} />
                                                        {f}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {selectedProject.advancedFeatures && selectedProject.advancedFeatures.length > 0 && (
                                            <div>
                                                <div style={{ fontSize: '11px', color: '#ff7a00', fontWeight: '700', marginBottom: '6px' }}>Advanced Features (Recommended)</div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {selectedProject.advancedFeatures.map(f => (
                                                        <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                                                            <input type="checkbox" checked={!!enabledFeatures[f]} onChange={() => handleToggleFeature(f)} style={{ accentColor: 'var(--primary)' }} />
                                                            {f}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {selectedProject.aiFeatures && selectedProject.aiFeatures.length > 0 && (
                                            <div>
                                                <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '700', marginBottom: '6px' }}>AI Integration Features</div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {selectedProject.aiFeatures.map(f => (
                                                        <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                                                            <input type="checkbox" checked={!!enabledFeatures[f]} onChange={() => handleToggleFeature(f)} style={{ accentColor: 'var(--primary)' }} />
                                                            {f}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Project Uniqueness */}
                            {selectedProject.basicVersion && (
                                <div className="card-premium">
                                    <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>✨ Basic vs Unique Evolution</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                                        <div style={{ padding: '10px 14px', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '6px', borderLeft: '2px solid var(--text-secondary)' }}>
                                            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Basic Version</span>
                                            <p style={{ fontSize: '12px', marginTop: '4px', color: 'var(--text-secondary)' }}>{selectedProject.basicVersion}</p>
                                        </div>
                                        <div style={{ padding: '10px 14px', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '6px', borderLeft: '2px solid var(--primary)' }}>
                                            <span style={{ fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: '700' }}>Advanced Version</span>
                                            <p style={{ fontSize: '12px', marginTop: '4px' }}>{selectedProject.advancedVersion}</p>
                                        </div>
                                        <div style={{ padding: '10px 14px', backgroundColor: 'rgba(99,102,241,0.05)', borderRadius: '6px', borderLeft: '2px solid #ff7a00', border: '1px solid rgba(255,122,0,0.15)' }}>
                                            <span style={{ fontSize: '10px', color: '#ff7a00', textTransform: 'uppercase', fontWeight: '700' }}>Portfolio Unique Version</span>
                                            <p style={{ fontSize: '12px', marginTop: '4px', color: '#fbd38d' }}>{selectedProject.uniqueVersion}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Benefits */}
                            {selectedProject.benefits && selectedProject.benefits.length > 0 && (
                                <div className="card-premium">
                                    <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>🚀 Career Benefits</h3>
                                    <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                        {selectedProject.benefits.map(b => (
                                            <li key={b}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </div>

                        {/* RIGHT COLUMN: AI PROJECT ASSISTANT */}
                        <div>
                            <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', height: '600px', padding: '0', position: 'sticky', top: '24px' }}>
                                
                                {/* Assistant Header */}
                                <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(0,0,0,0.15)' }}>
                                    <Bot size={18} color="var(--primary)" />
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '13px' }}>🤖 AI Project Assistant</strong>
                                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Trained on requirements for {selectedProject.name}</span>
                                    </div>
                                </div>

                                {/* Chat Logs Area */}
                                <div style={{ flex: '1', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {chatMessages.map((msg, idx) => (
                                        <div 
                                            key={idx}
                                            style={{ 
                                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                                backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                                                padding: '12px 14px',
                                                borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                                                maxWidth: '85%',
                                                fontSize: '12px',
                                                lineHeight: '1.5',
                                                whiteSpace: 'pre-wrap'
                                            }}
                                        >
                                            {msg.text}
                                        </div>
                                    ))}
                                    {chatLoading && (
                                        <div style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '12px 14px', borderRadius: '12px 12px 12px 0', display: 'flex', gap: '4px' }}>
                                            <span className="dot" style={{ width: '4px', height: '4px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1s infinite' }}></span>
                                            <span className="dot" style={{ width: '4px', height: '4px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }}></span>
                                            <span className="dot" style={{ width: '4px', height: '4px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }}></span>
                                        </div>
                                    )}
                                </div>

                                {/* Assistant presets chips */}
                                <div style={{ padding: '10px 16px', display: 'flex', gap: '6px', overflowX: 'auto', borderTop: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                                    <button 
                                        onClick={() => handleAssistantChat("Explain this project details")}
                                        style={{ padding: '6px 10px', fontSize: '10px', borderRadius: '20px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                                    >
                                        💡 Explain Project
                                    </button>
                                    <button 
                                        onClick={() => handleAssistantChat("Show file folder structure")}
                                        style={{ padding: '6px 10px', fontSize: '10px', borderRadius: '20px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                                    >
                                        📁 Folder structure
                                    </button>
                                    <button 
                                        onClick={() => handleAssistantChat("Generate starter code")}
                                        style={{ padding: '6px 10px', fontSize: '10px', borderRadius: '20px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                                    >
                                        ⚙️ Starter Code
                                    </button>
                                    <button 
                                        onClick={() => handleAssistantChat("Generate database schema")}
                                        style={{ padding: '6px 10px', fontSize: '10px', borderRadius: '20px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                                    >
                                        💾 SQL Schema
                                    </button>
                                </div>

                                {/* Input actions form */}
                                <form 
                                    onSubmit={(e) => { e.preventDefault(); handleAssistantChat(); }}
                                    style={{ display: 'flex', borderTop: '1px solid var(--border-color)', padding: '12px 16px', gap: '8px' }}
                                >
                                    <input 
                                        type="text"
                                        value={chatQuery}
                                        onChange={(e) => setChatQuery(e.target.value)}
                                        placeholder="Ask a technical question..."
                                        style={{ flex: '1', padding: '8px 12px', fontSize: '12px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                                    />
                                    <button type="submit" className="btn-primary" style={{ padding: '8px 12px' }}>
                                        <Send size={14} />
                                    </button>
                                </form>

                            </div>
                        </div>

                    </div>

                </div>
            ) : (
                
                // RECOMMENDATIONS LIST VIEW
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '8px' }}>
                                🛠️ Projects For You
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                Build real-world projects based on your skills, goals, and learning roadmap.
                            </p>
                        </div>
                        {compareList.length >= 2 && (
                            <button className="btn-primary" onClick={handleCompareAction} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Columns size={16} /> Compare Selected ({compareList.length})
                            </button>
                        )}
                    </div>

                    {/* Six Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        {projects.map((proj) => (
                            <div key={proj.id} className="card-premium" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', minHeight: '320px' }}>
                                
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '10px', color: getDifficultyColor(proj.difficulty), fontWeight: '700', textTransform: 'uppercase' }}>
                                            {proj.difficulty === 'Beginner' ? '🟢' : (proj.difficulty === 'Intermediate' ? '🟡' : '🔴')} {proj.difficulty}
                                        </span>
                                        <span style={{ fontSize: '12px', fontWeight: '800', color: getMatchScoreColor(proj.matchScore) }}>
                                            {proj.matchScore}% Match
                                        </span>
                                    </div>

                                    <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px', lineHeight: '1.4' }}>{proj.name}</h3>
                                    
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '54px' }}>
                                        {proj.description || "Develop core software components, databases, and configuration settings appropriate to this track."}
                                    </p>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                                        {proj.requiredSkills && proj.requiredSkills.map(s => (
                                            <span key={s} className="badge-item" style={{ fontSize: '9px', padding: '2px 6px', border: 'none', backgroundColor: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                                        <span>⏱️ Duration: <strong>{proj.duration || '2 weeks'}</strong></span>
                                        <span>Value: <strong>{proj.portfolioValue || 'High'}</strong></span>
                                    </div>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={compareList.includes(proj.id)} 
                                                onChange={() => handleToggleCompare(proj.id)}
                                            />
                                            Compare
                                        </label>
                                        <button className="btn-primary" onClick={() => handleSelectProject(proj.id)} style={{ padding: '8px 16px', fontSize: '11px' }}>
                                            View Project
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                </div>
            )}

        </div>
    );
}
