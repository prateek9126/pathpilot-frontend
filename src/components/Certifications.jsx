import React, { useState, useEffect } from 'react';
import { Award, ChevronLeft, CheckCircle, Clock, Star, ShieldAlert, Sparkles, BookOpen, Layers, Bot, Send, Trash2, HelpCircle, Columns, ExternalLink, Bookmark, Check, ShieldCheck, Tag, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { api } from '../api';

export default function Certifications({ profile, onUpdateProfileState, onNavigateToTab }) {
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // View state
    const [selectedCertId, setSelectedCertId] = useState(null);
    const [selectedCert, setSelectedCert] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // Filters state
    const [budgetPreset, setBudgetPreset] = useState("premium"); // "0", "500", "2000", "5000", "premium", "custom"
    const [maxBudget, setMaxBudget] = useState(1000000);
    const [categoryFilter, setCategoryFilter] = useState("All");

    // Chat assistant state
    const [chatQuery, setChatQuery] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);

    // Comparison state
    const [compareList, setCompareList] = useState([]);
    const [showComparison, setShowComparison] = useState(false);
    const [compareResults, setCompareResults] = useState([]);

    // Save certification list
    const [savedCertIds, setSavedCertIds] = useState({});

    // Update max budget based on preset selections
    useEffect(() => {
        if (budgetPreset === "0") {
            setMaxBudget(0);
        } else if (budgetPreset === "500") {
            setMaxBudget(500);
        } else if (budgetPreset === "2000") {
            setMaxBudget(2000);
        } else if (budgetPreset === "5000") {
            setMaxBudget(5000);
        } else if (budgetPreset === "premium") {
            setMaxBudget(1000000);
        }
    }, [budgetPreset]);

    // Fetch recommendations on filters change
    useEffect(() => {
        fetchCertifications();
    }, [maxBudget, categoryFilter, profile]);

    const fetchCertifications = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await api.getCertifications(maxBudget, categoryFilter);
            setCertifications(data);

            // Populate saved certifications flags
            const savedMap = {};
            data.forEach(c => {
                if (c.saved || c.status === "SAVED") {
                    savedMap[c.id] = true;
                }
            });
            setSavedCertIds(prev => ({ ...prev, ...savedMap }));
        } catch (err) {
            setError("Failed to load recommended certifications.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCert = async (id) => {
        setSelectedCertId(id);
        setDetailLoading(true);
        try {
            const c = await api.getCertDetails(id);
            setSelectedCert(c);
            // Reset chat messages
            setChatMessages([
                { sender: 'assistant', text: `Hi! I am your AI Certification Prep Assistant for the **${c.name}** exam.\n\nI can layout a study syllabus, mock-test you on required domains (**${c.requiredSkills.join(", ")}**), or explain complex concepts. Select a suggestion button below to start!` }
            ]);
        } catch (err) {
            setError("Failed to load certification details.");
        } finally {
            setDetailLoading(false);
        }
    };

    const handleBackToList = () => {
        setSelectedCertId(null);
        setSelectedCert(null);
        fetchCertifications();
    };

    const handleCustomBudgetChange = (e) => {
        const val = e.target.value;
        const num = val === "" ? 0 : Math.max(0, parseInt(val));
        setMaxBudget(num);
        setBudgetPreset("custom");
    };

    const handleSaveToggle = async (certId) => {
        const isSaved = !!savedCertIds[certId];
        try {
            if (isSaved) {
                await api.unsaveCert(certId);
                setSavedCertIds(prev => ({ ...prev, [certId]: false }));
            } else {
                await api.saveCert(certId);
                setSavedCertIds(prev => ({ ...prev, [certId]: true }));
            }
            if (selectedCert && selectedCert.id === certId) {
                // Refresh detail
                const updated = await api.getCertDetails(certId);
                setSelectedCert(updated);
            }
        } catch (err) {
            alert("Error toggling saved status.");
        }
    };

    const handleStartPrep = async () => {
        if (!selectedCert) return;
        try {
            const updated = await api.updateCertStatus(selectedCert.id, "PREPARING");
            setSelectedCert(updated);
            alert(`Preparation started! Follow the roadmap phases and validate your skills before attempting the exam. Standard assessment completions award 500 XP.`);
        } catch (err) {
            alert("Error starting preparation.");
        }
    };

    const handleToggleMilestone = async (idx) => {
        if (!selectedCert || selectedCert.status === "INTERESTED") return;
        try {
            const updated = await api.completeCertMilestone(selectedCert.id, idx);
            setSelectedCert(updated);
        } catch (err) {
            alert("Error updating milestones.");
        }
    };

    const handleUpdateStatus = async (status) => {
        if (!selectedCert) return;
        try {
            const updated = await api.updateCertStatus(selectedCert.id, status);
            setSelectedCert(updated);
            if (status === "COMPLETED") {
                // Award activity updates in parent
                if (onUpdateProfileState) {
                    const activeProfile = await api.getProfile();
                    onUpdateProfileState(activeProfile);
                }
            }
        } catch (err) {
            alert("Error updating status.");
        }
    };

    const handleAssistantChat = async (presetQuery = null) => {
        const query = presetQuery || chatQuery;
        if (!query.trim() || !selectedCert) return;

        const newMsg = { sender: 'user', text: query };
        setChatMessages(prev => [...prev, newMsg]);
        setChatQuery("");
        setChatLoading(true);

        try {
            const res = await api.sendCertAssistantMessage(selectedCert.id, query);
            setChatMessages(prev => [...prev, { sender: 'assistant', text: res.reply }]);
        } catch (err) {
            setChatMessages(prev => [...prev, { sender: 'assistant', text: "Unable to reach the AI certification assistant. Please check your network connection." }]);
        } finally {
            setChatLoading(false);
        }
    };

    // Compare actions
    const handleToggleCompare = (id) => {
        if (compareList.includes(id)) {
            setCompareList(prev => prev.filter(item => item !== id));
        } else {
            if (compareList.length >= 3) {
                alert("You can compare up to 3 certifications at a time.");
                return;
            }
            setCompareList(prev => [...prev, id]);
        }
    };

    const handleCompareAction = async () => {
        if (compareList.length < 2) {
            alert("Please select at least 2 certifications to compare.");
            return;
        }
        setLoading(true);
        try {
            const results = await api.compareCertifications(compareList);
            setCompareResults(results);
            setShowComparison(true);
        } catch (err) {
            alert("Failed to compare certifications.");
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'Beginner': return '#6ee7b7';
            case 'Intermediate': return '#fbd38d';
            case 'Advanced': return '#fca5a5';
            default: return 'var(--text-secondary)';
        }
    };

    const getMatchScoreColor = (score) => {
        if (score >= 90) return '#10b981';
        if (score >= 70) return 'var(--primary)';
        return '#f59e0b';
    };

    // Split certifications into lists
    // 1. Saved Certifications
    const savedCerts = certifications.filter(c => savedCertIds[c.id]);

    // 2. Recommended (First 3)
    const recommendedCerts = certifications.slice(0, 3);

    // 3. Genuinely Free Certifications (₹0)
    const freeCerts = certifications.filter(c => c.isFree || c.price === 0);

    // 4. Premium recommendations
    const premiumCerts = certifications.filter(c => !c.isFree && c.price > 0 && c.price <= maxBudget);

    const categories = [
        "All", "Software Development", "Cybersecurity", "Cloud", "AI & Machine Learning", "Data Science", "Networking", "Database", "DevOps", "Business & Management", "Other"
    ];

    if (showComparison) {
        return (
            <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <button className="btn-secondary" onClick={() => setShowComparison(false)} style={{ alignSelf: 'flex-start' }}>
                    <ChevronLeft size={16} /> Back to Certifications
                </button>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Outfit' }}>🏆 Certification Comparison Matrix</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Evaluate cost, validity, required study duration, and match scores side-by-side.</p>
                </div>

                <div className="card-premium" style={{ overflowX: 'auto', padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.15)' }}>
                                <th style={{ padding: '16px', fontWeight: '800', width: '200px' }}>Attribute</th>
                                {compareResults.map(c => (
                                    <th key={c.id} style={{ padding: '16px', fontWeight: '800' }}>{c.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-secondary)' }}>Provider</td>
                                {compareResults.map(c => (
                                    <td key={c.id} style={{ padding: '16px' }}><strong>{c.provider}</strong></td>
                                ))}
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-secondary)' }}>Cost</td>
                                {compareResults.map(c => (
                                    <td key={c.id} style={{ padding: '16px', fontWeight: '700', color: c.isFree ? '#10b981' : '#a5b4fc' }}>
                                        {c.isFree ? 'Free' : `₹${c.price}`}
                                    </td>
                                ))}
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-secondary)' }}>Difficulty</td>
                                {compareResults.map(c => (
                                    <td key={c.id} style={{ padding: '16px', color: getDifficultyColor(c.difficulty), fontWeight: '700' }}>
                                        {c.difficulty}
                                    </td>
                                ))}
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-secondary)' }}>Roadmap Match</td>
                                {compareResults.map(c => (
                                    <td key={c.id} style={{ padding: '16px', fontWeight: '800', color: getMatchScoreColor(c.matchScore) }}>
                                        {c.matchScore}% Match
                                    </td>
                                ))}
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-secondary)' }}>Validity / Expiration</td>
                                {compareResults.map(c => (
                                    <td key={c.id} style={{ padding: '16px' }}>{c.validity}</td>
                                ))}
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-secondary)' }}>Format</td>
                                {compareResults.map(c => (
                                    <td key={c.id} style={{ padding: '16px' }}>{c.examFormat}</td>
                                ))}
                            </tr>
                            <tr>
                                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-secondary)' }}>Industry Recognition</td>
                                {compareResults.map(c => (
                                    <td key={c.id} style={{ padding: '16px', fontWeight: '700', color: '#ff7a00' }}>{c.industryRecognition}</td>
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

            {/* ERROR DISPLAY */}
            {error && (
                <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid var(--danger)', borderRadius: '8px', marginBottom: '24px' }}>
                    {error}
                </div>
            )}

            {/* CERTIFICATION DETAILS VIEW */}
            {selectedCert ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    {/* Header Controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button className="btn-secondary" onClick={handleBackToList}>
                            <ChevronLeft size={16} /> Back to Recommendations
                        </button>
                        
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {/* Save Toggle */}
                            <button className="btn-secondary" onClick={() => handleSaveToggle(selectedCert.id)}>
                                <Bookmark size={14} fill={savedCertIds[selectedCert.id] ? 'var(--primary)' : 'none'} color={savedCertIds[selectedCert.id] ? 'var(--primary)' : 'var(--text-primary)'} />
                                {savedCertIds[selectedCert.id] ? 'Saved' : 'Save Certification'}
                            </button>

                            {/* Start Prep Lifecycle */}
                            {selectedCert.status === "INTERESTED" || selectedCert.status === "SAVED" ? (
                                <button className="btn-primary" onClick={handleStartPrep} style={{ padding: '10px 24px' }}>
                                    Start Preparation 🚀
                                </button>
                            ) : null}

                            {selectedCert.status === "PREPARING" && (
                                <>
                                    <button className="btn-secondary" onClick={() => handleUpdateStatus("EXAM_SCHEDULED")}>
                                        <Calendar size={14} /> Schedule Exam
                                    </button>
                                    <button className="btn-primary" onClick={() => handleUpdateStatus("COMPLETED")}>
                                        <Check size={14} /> Mark as Passed
                                    </button>
                                </>
                            )}

                            {selectedCert.status === "EXAM_SCHEDULED" && (
                                <>
                                    <button className="btn-primary" onClick={() => handleUpdateStatus("COMPLETED")}>
                                        <Award size={14} /> Pass Certification Exam
                                    </button>
                                    <button className="btn-secondary" onClick={() => handleUpdateStatus("PREPARING")}>
                                        Cancel Schedule
                                    </button>
                                </>
                            )}

                            {selectedCert.status === "COMPLETED" && (
                                <span style={{ padding: '8px 16px', backgroundColor: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: '1px solid #10b981', borderRadius: '6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <ShieldCheck size={16} /> Certified (Completed & +500 XP)
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Title block */}
                    <div className="card-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>
                                {selectedCert.category}
                            </span>
                            <h1 style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'Outfit' }}>{selectedCert.name}</h1>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                <span>Provider: <strong>{selectedCert.provider}</strong></span>
                                <span>•</span>
                                <span>Exam Price: <strong style={{ color: selectedCert.isFree ? '#10b981' : 'var(--text-primary)' }}>{selectedCert.isFree ? 'Free' : `₹${selectedCert.price}`}</strong></span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(99,102,241,0.05)', padding: '16px 24px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '28px', fontWeight: '900', color: getMatchScoreColor(selectedCert.matchScore) }}>
                                {selectedCert.matchScore}%
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>
                                Roadmap Match
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="card-premium">
                        <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>Description</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', margin: '0' }}>{selectedCert.description}</p>
                    </div>

                    {/* Progress tracking */}
                    {selectedCert.status !== "INTERESTED" && selectedCert.status !== "SAVED" && (
                        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                <span>🎓 Preparation Roadmap Progress</span>
                                <strong>{selectedCert.progress}% Completed</strong>
                            </div>
                            <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${selectedCert.progress}%`, backgroundColor: '#10b981', transition: 'width 0.4s ease' }} />
                            </div>
                        </div>
                    )}

                    {/* Grid split: Left Curriculum, Right Prep Assistant */}
                    <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '32px' }}>
                        
                        {/* LEFT COLUMN: SYLLABUS & METRICS */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            
                            {/* Why Recommend */}
                            <div style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(0, 0, 0, 0.1))', borderLeft: '3px solid var(--primary)', borderRadius: '4px' }}>
                                <h4 style={{ fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#ff7a00' }}>
                                    <Sparkles size={14} /> Personal Fit Assessment
                                </h4>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                    {selectedCert.whyRecommended}
                                </p>
                            </div>

                            {/* Skills You Will Validate */}
                            <div className="card-premium">
                                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>🎯 Skills You Will Validate</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', marginBottom: '6px' }}>You already know ✅</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {selectedCert.existingSkills && selectedCert.existingSkills.map(s => (
                                                <span key={s} className="badge-item" style={{ borderColor: 'rgba(16,185,129,0.3)', backgroundColor: 'rgba(16,185,129,0.05)', color: '#6ee7b7' }}>{s}</span>
                                            ))}
                                            {(!selectedCert.existingSkills || selectedCert.existingSkills.length === 0) && (
                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>None yet</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '700', marginBottom: '6px' }}>You need to learn 📚</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                                            {selectedCert.skillsToLearn && selectedCert.skillsToLearn.map(s => (
                                                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span className="badge-item" style={{ borderColor: 'rgba(245,158,11,0.3)', color: '#fbd38d' }}>{s}</span>
                                                    <button 
                                                        onClick={() => onNavigateToTab('resources')}
                                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '10px', cursor: 'pointer', textDecoration: 'underline', padding: '0' }}
                                                    >
                                                        Learn {s}
                                                    </button>
                                                </div>
                                            ))}
                                            {(!selectedCert.skillsToLearn || selectedCert.skillsToLearn.length === 0) && (
                                                <span style={{ fontSize: '11px', color: '#6ee7b7' }}>Prerequisites met! You have completed all topic modules.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Value metrics */}
                            <div className="card-premium">
                                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>📊 Industry Value Indicators</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                    <div style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '6px', textAlign: 'center' }}>
                                        <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Recognition</span>
                                        <strong style={{ fontSize: '14px', color: '#ff7a00' }}>{selectedCert.industryRecognition}</strong>
                                    </div>
                                    <div style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '6px', textAlign: 'center' }}>
                                        <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Validity Period</span>
                                        <strong style={{ fontSize: '14px' }}>{selectedCert.validity}</strong>
                                    </div>
                                    <div style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '6px', textAlign: 'center' }}>
                                        <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Format</span>
                                        <strong style={{ fontSize: '12px' }}>{selectedCert.examFormat}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Preparation Roadmap */}
                            <div className="card-premium">
                                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Clock size={18} /> Certification Prep Roadmap
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '20px' }}>
                                    {selectedCert.status === "INTERESTED" || selectedCert.status === "SAVED" ? "⚠️ Start preparation to begin tracking your milestones." : "Check off steps as you complete study domains."}
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {selectedCert.preparationRoadmap && selectedCert.preparationRoadmap.map((step, idx) => {
                                        const parts = step.split(':');
                                        const title = parts[0];
                                        const desc = parts[1] || "";
                                        const completed = selectedCert.completedPhases && selectedCert.completedPhases[idx];

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
                                                    opacity: (selectedCert.status === "INTERESTED" || selectedCert.status === "SAVED") ? 0.6 : 1
                                                }}
                                            >
                                                <input 
                                                    type="checkbox"
                                                    checked={!!completed}
                                                    disabled={selectedCert.status === "INTERESTED" || selectedCert.status === "SAVED"}
                                                    onChange={() => handleToggleMilestone(idx)}
                                                    style={{ marginTop: '3px', accentColor: '#10b981', cursor: 'pointer' }}
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

                            {/* Why get this */}
                            {selectedCert.benefits && selectedCert.benefits.length > 0 && (
                                <div className="card-premium">
                                    <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>🚀 Why Get This Certification?</h3>
                                    <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                        {selectedCert.benefits.map(b => (
                                            <li key={b}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </div>

                        {/* RIGHT COLUMN: AI PREP ASSISTANT */}
                        <div>
                            <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', height: '550px', padding: '0', position: 'sticky', top: '24px' }}>
                                
                                <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(0,0,0,0.15)' }}>
                                    <Bot size={18} color="var(--primary)" />
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '13px' }}>🤖 AI Prep Assistant</strong>
                                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Exam: {selectedCert.name}</span>
                                    </div>
                                </div>

                                {/* Chat log messages */}
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
                                            <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1s infinite' }}></span>
                                            <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }}></span>
                                            <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }}></span>
                                        </div>
                                    )}
                                </div>

                                {/* Suggestions */}
                                <div style={{ padding: '10px 16px', display: 'flex', gap: '6px', overflowX: 'auto', borderTop: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                                    <button 
                                        onClick={() => handleAssistantChat("Create a 30-day study plan")}
                                        style={{ padding: '6px 10px', fontSize: '10px', borderRadius: '20px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                                    >
                                        📅 30-day study plan
                                    </button>
                                    <button 
                                        onClick={() => handleAssistantChat("Test me with practice questions")}
                                        style={{ padding: '6px 10px', fontSize: '10px', borderRadius: '20px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                                    >
                                        📝 Generate quiz
                                    </button>
                                    <button 
                                        onClick={() => handleAssistantChat("Explain my weak topics")}
                                        style={{ padding: '6px 10px', fontSize: '10px', borderRadius: '20px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                                    >
                                        🔍 Explain Gaps
                                    </button>
                                </div>

                                {/* Form input */}
                                <form 
                                    onSubmit={(e) => { e.preventDefault(); handleAssistantChat(); }}
                                    style={{ display: 'flex', borderTop: '1px solid var(--border-color)', padding: '12px 16px', gap: '8px' }}
                                >
                                    <input 
                                        type="text"
                                        value={chatQuery}
                                        onChange={(e) => setChatQuery(e.target.value)}
                                        placeholder="Ask a certification question..."
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
                
                // LIST VIEW
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    {/* Header controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '8px' }}>
                                🏆 Certifications For You
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                Discover certifications that match your skills, career goals, roadmap, and budget constraints.
                            </p>
                        </div>
                        {compareList.length >= 2 && (
                            <button className="btn-primary" onClick={handleCompareAction} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Columns size={16} /> Compare Selected ({compareList.length})
                            </button>
                        )}
                    </div>

                    {/* Custom Budget Row + Category Toggles */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        
                        {/* Budget Panel */}
                        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '700' }}>💰 Maximum Certification Budget</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                                <button type="button" className={budgetPreset === "0" ? "btn-primary" : "btn-secondary"} onClick={() => setBudgetPreset("0")} style={{ padding: '8px', fontSize: '11px', justifyContent: 'center' }}>₹0</button>
                                <button type="button" className={budgetPreset === "500" ? "btn-primary" : "btn-secondary"} onClick={() => setBudgetPreset("500")} style={{ padding: '8px', fontSize: '11px', justifyContent: 'center' }}>₹500</button>
                                <button type="button" className={budgetPreset === "2000" ? "btn-primary" : "btn-secondary"} onClick={() => setBudgetPreset("2000")} style={{ padding: '8px', fontSize: '11px', justifyContent: 'center' }}>₹2k</button>
                                <button type="button" className={budgetPreset === "5000" ? "btn-primary" : "btn-secondary"} onClick={() => setBudgetPreset("5000")} style={{ padding: '8px', fontSize: '11px', justifyContent: 'center' }}>₹5k</button>
                                <button type="button" className={budgetPreset === "premium" ? "btn-primary" : "btn-secondary"} onClick={() => setBudgetPreset("premium")} style={{ padding: '8px', fontSize: '11px', justifyContent: 'center' }}>Premium</button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <input 
                                    type="number" 
                                    value={maxBudget > 50000 ? "" : maxBudget}
                                    onChange={handleCustomBudgetChange}
                                    placeholder="Enter Custom Max Budget (e.g. 15000)"
                                    style={{ flex: '1', padding: '8px 12px', fontSize: '12px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                                />
                            </div>
                        </div>

                        {/* Category Dropdown */}
                        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>🏷️ Industry Domain Category</label>
                            <select 
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '13px' }}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat === 'All' ? '🌐 All Categories' : cat}</option>
                                ))}
                            </select>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Filters certifications dynamically by their engineering domain.</span>
                        </div>

                    </div>

                    {/* SECTION: SAVED CERTIFICATIONS */}
                    {savedCerts.length > 0 && (
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
                                <Bookmark size={18} fill="var(--primary)" /> Saved Certifications
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                {savedCerts.map(cert => (
                                    <CertCard 
                                        key={cert.id} 
                                        cert={cert} 
                                        saved={!!savedCertIds[cert.id]}
                                        onSaveToggle={() => handleSaveToggle(cert.id)}
                                        onSelect={() => handleSelectCert(cert.id)}
                                        compareList={compareList}
                                        onToggleCompare={handleToggleCompare}
                                        getDifficultyColor={getDifficultyColor}
                                        getMatchScoreColor={getMatchScoreColor}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION: RECOMMENDED FOR YOU */}
                    {recommendedCerts.length > 0 && (
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ff7a00' }}>
                                <Sparkles size={20} /> ⭐ Recommended For You
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                {recommendedCerts.map(cert => (
                                    <CertCard 
                                        key={cert.id} 
                                        cert={cert} 
                                        saved={!!savedCertIds[cert.id]}
                                        onSaveToggle={() => handleSaveToggle(cert.id)}
                                        onSelect={() => handleSelectCert(cert.id)}
                                        compareList={compareList}
                                        onToggleCompare={handleToggleCompare}
                                        getDifficultyColor={getDifficultyColor}
                                        getMatchScoreColor={getMatchScoreColor}
                                        showWhy={true}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION: BEST FREE CERTIFICATIONS */}
                    {freeCerts.length > 0 && (
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                                <Award size={20} /> 🆓 Best Free Certifications (Free learning + Free Certificate)
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                {freeCerts.map(cert => (
                                    <CertCard 
                                        key={cert.id} 
                                        cert={cert} 
                                        saved={!!savedCertIds[cert.id]}
                                        onSaveToggle={() => handleSaveToggle(cert.id)}
                                        onSelect={() => handleSelectCert(cert.id)}
                                        compareList={compareList}
                                        onToggleCompare={handleToggleCompare}
                                        getDifficultyColor={getDifficultyColor}
                                        getMatchScoreColor={getMatchScoreColor}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION: PREMIUM CERTIFICATIONS */}
                    {maxBudget > 0 && premiumCerts.length > 0 && (
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc' }}>
                                <Award size={20} /> 🏆 Premium Certifications
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                {premiumCerts.map(cert => (
                                    <CertCard 
                                        key={cert.id} 
                                        cert={cert} 
                                        saved={!!savedCertIds[cert.id]}
                                        onSaveToggle={() => handleSaveToggle(cert.id)}
                                        onSelect={() => handleSelectCert(cert.id)}
                                        compareList={compareList}
                                        onToggleCompare={handleToggleCompare}
                                        getDifficultyColor={getDifficultyColor}
                                        getMatchScoreColor={getMatchScoreColor}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {certifications.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                            No certifications match your selected maximum budget and category filter. Try expanding your budget range.
                        </div>
                    )}

                </div>
            )}

        </div>
    );
}

// Inner Component: CertCard
function CertCard({ cert, saved, onSaveToggle, onSelect, compareList, onToggleCompare, getDifficultyColor, getMatchScoreColor, showWhy = false }) {
    return (
        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', minHeight: '340px' }}>
            
            <div>
                {/* Header indicators */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span style={{ fontSize: '10px', color: getDifficultyColor(cert.difficulty), fontWeight: '700', textTransform: 'uppercase' }}>
                        {cert.difficulty}
                    </span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: getMatchScoreColor(cert.matchScore) }}>
                            {cert.matchScore}% Match
                        </span>
                        <button 
                            onClick={onSaveToggle}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                        >
                            <Bookmark size={14} fill={saved ? 'var(--primary)' : 'none'} color={saved ? 'var(--primary)' : 'var(--text-secondary)'} />
                        </button>
                    </div>
                </div>

                {/* Provider and Name */}
                <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>
                    {cert.provider}
                </span>
                <h3 style={{ fontSize: '15px', fontWeight: '800', marginTop: '4px', marginBottom: '8px', lineHeight: '1.4', color: 'var(--text-primary)' }}>
                    {cert.name}
                </h3>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '54px' }}>
                    {cert.description || "Validate enterprise software development and cybersecurity operations skills."}
                </p>

                {/* Required Skills Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                    {cert.requiredSkills && cert.requiredSkills.map(s => (
                        <span key={s} className="badge-item" style={{ fontSize: '9px', padding: '1px 6px', border: 'none', backgroundColor: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
                            {s}
                        </span>
                    ))}
                </div>

                {showWhy && cert.whyRecommended && (
                    <div style={{ padding: '8px 10px', backgroundColor: 'rgba(99,102,241,0.02)', borderLeft: '2px solid var(--primary)', borderRadius: '2px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '14px', fontStyle: 'italic' }}>
                        {cert.whyRecommended}
                    </div>
                )}
            </div>

            {/* Bottom panel actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span>Validity: <strong>{cert.validity || 'Lifetime'}</strong></span>
                    <span style={{ color: cert.isFree ? '#10b981' : '#a5b4fc', fontWeight: '700' }}>
                        {cert.isFree ? 'Free Certificate' : `₹${cert.price}`}
                    </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <input 
                            type="checkbox" 
                            checked={compareList.includes(cert.id)} 
                            onChange={() => onToggleCompare(cert.id)}
                        />
                        Compare
                    </label>
                    <button className="btn-primary" onClick={onSelect} style={{ padding: '6px 12px', fontSize: '11px' }}>
                        View Cert
                    </button>
                </div>

            </div>

        </div>
    );
}
