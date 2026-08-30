import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowRight, Check, X, ShieldAlert, Sparkles, Award, Layers, Bot, Send, Columns, Info, Search, HelpCircle, CheckCircle, AlertTriangle, Building, Briefcase } from 'lucide-react';
import { api } from '../api';

export default function CareerOverview({ profile, onUpdateProfileState, onNavigateToTab }) {
    const [overviewData, setOverviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Switch Planner State
    const [switchTarget, setSwitchTarget] = useState("AI/ML Engineering");
    const [transitionPlan, setTransitionPlan] = useState(null);
    const [transitionLoading, setTransitionLoading] = useState(false);

    // AI Advisor state
    const [chatQuery, setChatQuery] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);

    // Companies Hiring state
    const [companyTarget, setCompanyTarget] = useState("Full-Stack Development");
    const [companyJobs, setCompanyJobs] = useState([]);
    const [selectedCompanySkills, setSelectedCompanySkills] = useState(null);
    const [selectedCompanyName, setSelectedCompanyName] = useState("");

    // Skill Search Explorer state
    const [skillSearch, setSkillSearch] = useState("Python");
    const [skillResult, setSkillResult] = useState(null);
    const [switchingGoal, setSwitchingGoal] = useState("");

    const handleSwitchPath = async (careerName) => {
        let targetGoal = careerName;
        if (careerName === "Cybersecurity") {
            targetGoal = "Cybersecurity SOC Analyst";
        } else if (careerName === "Full-Stack Development") {
            targetGoal = "Java Backend Developer";
        } else if (careerName === "AI/ML Engineering") {
            targetGoal = "AI/ML Engineer";
        }
        
        setSwitchingGoal(careerName);
        try {
            const updatedProfilePayload = {
                ...profile,
                targetGoal: targetGoal
            };
            const updatedProfile = await api.updateProfile(updatedProfilePayload);
            const updatedRoadmap = await api.getRoadmap();
            onUpdateProfileState(updatedProfile, updatedRoadmap);
            onNavigateToTab("path");
        } catch (err) {
            console.error("Failed to switch career path", err);
        } finally {
            setSwitchingGoal("");
        }
    };

    // Dynamic Skill Match Calculations
    const calculateMatch = (careerName, requiredSkills, baseTransitionTime) => {
        const userSkills = profile.skills || [];
        let matchedCount = 0;
        let totalLevelSum = 0;
        
        requiredSkills.forEach(reqSkill => {
            const userSkill = userSkills.find(s => 
                s.name.toLowerCase().includes(reqSkill.toLowerCase()) || 
                reqSkill.toLowerCase().includes(s.name.toLowerCase())
            );
            if (userSkill && userSkill.level > 0) {
                matchedCount++;
                totalLevelSum += userSkill.level;
            }
        });
        
        const overlapFraction = requiredSkills.length > 0 ? matchedCount / requiredSkills.length : 0;
        const avgMatchedLevel = matchedCount > 0 ? totalLevelSum / matchedCount : 0;
        
        let matchScore = 25;
        if (matchedCount > 0) {
            matchScore = 40 + Math.round(overlapFraction * 40) + Math.round((avgMatchedLevel / 100) * 20);
        }
        
        matchScore = Math.min(98, Math.max(15, matchScore));
        
        let transition = baseTransitionTime;
        if (matchScore >= 80) {
            transition = "1–2 months";
        } else if (matchScore >= 60) {
            transition = "3–4 months";
        } else if (matchScore >= 40) {
            transition = "5–6 months";
        } else {
            transition = "7–9 months";
        }
        
        let explanation = "";
        if (matchedCount > 0) {
            const matchedSkillNames = requiredSkills
                .filter(reqSkill => userSkills.some(s => s.name.toLowerCase().includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(s.name.toLowerCase())))
                .slice(0, 3);
            explanation = `Strong match with your programming and problem-solving skills in ${matchedSkillNames.join(" and ")}.`;
        } else {
            explanation = `Good base analytics alignment, requires learning core competencies in this field.`;
        }
        
        return {
            name: careerName,
            matchScore,
            transition,
            explanation
        };
    };

    const targetGoalLower = (profile.targetGoal || "").toLowerCase();
    
    const isCurrentGoal = (careerName) => {
        const goal = targetGoalLower;
        const n = careerName.toLowerCase();
        if (goal.includes("cyber") && n.includes("cyber")) return true;
        if ((goal.includes("java") || goal.includes("backend") || goal.includes("software") || goal.includes("web")) && n.includes("full-stack")) return true;
        if (goal.includes("data") && n.includes("data")) return true;
        if ((goal.includes("ml") || goal.includes("machine") || goal.includes("ai")) && n.includes("ai/ml")) return true;
        return false;
    };

    const careersList = [
        { name: "Frontend Development", skills: ["HTML", "CSS", "JavaScript", "React"], baseTime: "5–6 months" },
        { name: "Full-Stack Development", skills: ["Java", "Spring Boot", "SQL", "React", "JavaScript"], baseTime: "5–6 months" },
        { name: "Data Science", skills: ["Python", "SQL", "Statistics", "Machine Learning"], baseTime: "5–6 months" },
        { name: "AI/ML Engineering", skills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow/PyTorch"], baseTime: "5–6 months" },
        { name: "Cloud/DevOps", skills: ["Linux", "Networking", "Docker", "AWS/Azure"], baseTime: "5–6 months" },
        { name: "Cybersecurity", skills: ["Linux", "Networking", "SIEM", "Python"], baseTime: "5–6 months" }
    ];

    const alternatives = careersList
        .filter(c => !isCurrentGoal(c.name))
        .map(c => calculateMatch(c.name, c.skills, c.baseTime));

    // Market demand data (interactive chart values)
    const marketDemand = [
        { name: "Software Engineering", value: 100, trend: "Stable" },
        { name: "Data Engineering", value: 85, trend: "Growing" },
        { name: "AI/ML Engineering", value: 95, trend: "Rapidly Growing" },
        { name: "Cloud/DevOps", value: 80, trend: "Growing" },
        { name: "Cybersecurity", value: 75, trend: "Stable" },
        { name: "Data Analytics", value: 70, trend: "Stable" },
        { name: "Frontend Development", value: 65, trend: "Stable" }
    ];

    // Company-Skill matrix
    const companyMatrix = [
        { company: "PaySafe Solutions", web: "High", data: "High", ai: "Medium", cloud: "High", cyber: "Low", skills: ["Java", "Spring Boot", "SQL", "React", "AWS"] },
        { company: "InfoSec Guard", web: "Low", data: "Medium", ai: "High", cloud: "Medium", cyber: "High", skills: ["Python", "SIEM", "Linux", "Elasticsearch"] },
        { company: "ML Alpha Lab", web: "Medium", data: "High", ai: "Very High", cloud: "High", cyber: "Medium", skills: ["Python", "PyTorch", "SQL", "Docker", "Kubernetes"] }
    ];

    // Beginner career explorer paths (Static helper)
    const beginnerPaths = [
        { name: "Software Development", desc: "Write, test, and maintain code for apps and APIs.", diff: "Medium", friend: "⭐⭐⭐⭐⭐", proj: "CRUD APIs, CLI utilities" },
        { name: "Data Analytics", desc: "Clean and analyze data to find trends and build report charts.", diff: "Medium", friend: "⭐⭐⭐⭐", proj: "BI Dashboards, Excel analysis" },
        { name: "Cybersecurity", desc: "Secure networks, audit system logs, and monitor threat alerts.", diff: "Medium-High", friend: "⭐⭐⭐", proj: "Log analyzers, secure scripts" },
        { name: "Cloud/DevOps", desc: "Automate build deployments and configure cloud structures.", diff: "High", friend: "⭐⭐", proj: "CI/CD playbooks, Docker builds" }
    ];

    useEffect(() => {
        loadOverview();
    }, [profile]);

    useEffect(() => {
        loadTransitionPlan();
    }, [switchTarget, profile]);

    useEffect(() => {
        loadCompanyJobs();
    }, [companyTarget]);

    useEffect(() => {
        handleSkillSearch();
    }, [skillSearch]);

    const loadOverview = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await api.getCareerOverview();
            setOverviewData(data);
            
            // Set initial AI advisor message
            setChatMessages([
                { sender: 'assistant', text: `Hi! I am your **AI Career Advisor**. I have analyzed your target goal of **${profile.targetGoal}** and your current skills.\n\nI can outline career pivots, review skill demand, or advise if you should stay or switch paths. Try clicking a suggestion below!` }
            ]);
        } catch (err) {
            setError("Failed to load career overview data.");
        } finally {
            setLoading(false);
        }
    };

    const loadTransitionPlan = async () => {
        setTransitionLoading(true);
        try {
            const data = await api.getCareerTransitionPlan(switchTarget);
            setTransitionPlan(data);
        } catch (err) {
            console.log("Error loading transition plan", err);
        } finally {
            setTransitionLoading(false);
        }
    };

    const loadCompanyJobs = async () => {
        try {
            const data = await api.getCompanyOpenings(companyTarget);
            setCompanyJobs(data);
        } catch (err) {
            console.log("Error loading company jobs", err);
        }
    };

    const handleSkillSearch = async () => {
        if (!skillSearch.trim()) return;
        try {
            const data = await api.searchSkillDemand(skillSearch);
            setSkillResult(data);
        } catch (err) {
            console.log("Error searching skill demand", err);
        }
    };

    const handleAdvisorChat = async (presetQuery = null) => {
        const query = presetQuery || chatQuery;
        if (!query.trim()) return;

        const newMsg = { sender: 'user', text: query };
        setChatMessages(prev => [...prev, newMsg]);
        setChatQuery("");
        setChatLoading(true);

        try {
            const res = await api.sendCareerAdvisorMessage(query);
            setChatMessages(prev => [...prev, { sender: 'assistant', text: res.reply }]);
        } catch (err) {
            setChatMessages(prev => [...prev, { sender: 'assistant', text: "Unable to reach the AI Career Advisor. Please check if your backend is running." }]);
        } finally {
            setChatLoading(false);
        }
    };

    const handleCompanyClick = (company) => {
        setSelectedCompanyName(company.company);
        setSelectedCompanySkills(company.skills);
    };

    if (loading || !overviewData) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '12px' }}>
                <div className="spin" style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Compiling career analytics and demand signals...</span>
            </div>
        );
    }

    return (
        <div style={{ padding: '0', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Header */}
            <div>
                <h1 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '8px' }}>
                    📊 Career Intelligence Overview
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Explore career trajectories, market demand patterns, hiring companies, and switch roadmap planners customized to your skills.
                </p>
            </div>

            {/* Split layout: Left Career Overview, Right AI Advisor */}
            <div style={{ display: 'grid', gridTemplateColumns: '7.5fr 4.5fr', gap: '32px' }}>
                
                {/* LEFT COLUMN: CAREER INTELLIGENCE DASHBOARD */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    {/* CURRENT CAREER TRAJECTORY */}
                    <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                🎯 Your Current Career Trajectory
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Level: <strong>{profile.currentLevel}</strong></span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0' }}>{profile.targetGoal}</h2>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                    You are currently building a foundation for a career in {profile.targetGoal}.
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '300px', justifyContent: 'flex-end' }}>
                                {profile.skills && profile.skills.slice(0, 4).map(s => (
                                    <span key={s.name} className="badge-item" style={{ fontSize: '10px', padding: '2px 8px', border: 'none', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                                        {s.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* STAY OR SWITCH RECOMMENDATION */}
                    {overviewData.staySwitch && (
                        <div className="card-premium" style={{ borderColor: 'rgba(255,122,0,0.3)', background: 'linear-gradient(135deg, #FFFFFF, rgba(255,122,0,0.02))' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', color: '#D97706', marginBottom: '12px' }}>
                                <AlertTriangle size={16} /> 🤔 Should You Stay or Switch?
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                                <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                                    <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700', textTransform: 'uppercase' }}>Continue Path</span>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.5' }}>
                                        {overviewData.staySwitch.stayAdvice}
                                    </p>
                                </div>
                                <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                                    <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>Switch Path</span>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.5' }}>
                                        {overviewData.staySwitch.switchAdvice}
                                    </p>
                                </div>
                            </div>
                            <div style={{ padding: '10px 12px', backgroundColor: 'rgba(255,122,0,0.05)', borderRadius: '4px', fontSize: '12px', color: '#B45309', borderLeft: '3px solid #ff7a00', fontStyle: 'italic', lineHeight: '1.4' }}>
                                <strong>AI Recommendation:</strong> "{overviewData.staySwitch.recommendation}"
                            </div>
                        </div>
                    )}

                    {/* Alternatives grid removed - moved to the right column as part of redesign */}

                    {/* DYNAMIC TRANSITION ROADMAP PLANNER */}
                    <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'Outfit' }}>🛠️ Transition Roadmap Planner</h3>
                            <div>
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginRight: '8px' }}>Switch to:</span>
                                <select 
                                    value={switchTarget} 
                                    onChange={(e) => setSwitchTarget(e.target.value)}
                                    style={{ padding: '6px 10px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '12px' }}
                                >
                                    <option value="Frontend Development">Frontend Development</option>
                                    <option value="Full-Stack Development">Full-Stack Development</option>
                                    <option value="Data Science">Data Science</option>
                                    <option value="AI/ML Engineering">AI/ML Engineering</option>
                                    <option value="Cybersecurity SOC Analyst">Cybersecurity SOC Analyst</option>
                                    <option value="Cloud/DevOps">Cloud/DevOps</option>
                                </select>
                            </div>
                        </div>

                        {transitionLoading ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>Loading switch roadmap...</div>
                        ) : transitionPlan && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                                        <span style={{ fontSize: '11px', color: '#15803D', fontWeight: '700', textTransform: 'uppercase' }}>Skills You Already Have ✅</span>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                                            {transitionPlan.alreadyHave.map(s => (
                                                <span key={s} className="badge-item" style={{ fontSize: '9px', border: '1px solid rgba(22,163,74,0.2)', backgroundColor: '#ECFDF5', color: '#15803D', padding: '2px 6px', borderRadius: '4px' }}>{s}</span>
                                            ))}
                                            {transitionPlan.alreadyHave.length === 0 && <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>None yet</span>}
                                        </div>
                                    </div>
                                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                                        <span style={{ fontSize: '11px', color: '#B45309', fontWeight: '700', textTransform: 'uppercase' }}>Skills You Need to Learn 📚</span>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                                            {transitionPlan.needToLearn.map(s => (
                                                <span key={s} className="badge-item" style={{ fontSize: '9px', border: '1px solid rgba(245,158,11,0.2)', backgroundColor: '#FFFBEB', color: '#B45309', padding: '2px 6px', borderRadius: '4px' }}>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', padding: '0 4px' }}>
                                    <span>Estimated Transition Period: <strong>{transitionPlan.estimatedMonths}</strong></span>
                                    <span>Difficulty: <strong>{transitionPlan.difficulty}</strong></span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px' }}>
                                    <strong style={{ fontSize: '12px' }}>🗺️ Transition Learning Steps</strong>
                                    {transitionPlan.roadmap.map((step, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            <span>{idx + 1}.</span>
                                            <span>{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* COMPARATIVE CAREER MATRIX */}
                    <div className="card-premium">
                        <h3 style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '16px' }}>⚖️ Career Pathways Comparison</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                                        <th style={{ padding: '10px', color: 'var(--text-primary)' }}>Category</th>
                                        <th style={{ padding: '10px', color: 'var(--text-primary)' }}>Web Developer</th>
                                        <th style={{ padding: '10px', color: 'var(--text-primary)' }}>Data Scientist</th>
                                        <th style={{ padding: '10px', color: 'var(--text-primary)' }}>AI/ML Engineer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>Difficulty</td>
                                        <td style={{ padding: '10px', color: 'var(--text-primary)' }}>Medium</td>
                                        <td style={{ padding: '10px', color: 'var(--text-primary)' }}>High</td>
                                        <td style={{ padding: '10px', color: '#DC2626', fontWeight: '600' }}>Very High</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>Coding Required</td>
                                        <td style={{ padding: '10px', color: 'var(--text-primary)' }}>High</td>
                                        <td style={{ padding: '10px', color: 'var(--text-primary)' }}>High</td>
                                        <td style={{ padding: '10px', color: 'var(--text-primary)' }}>Very High</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>Math Required</td>
                                        <td style={{ padding: '10px', color: 'var(--text-primary)' }}>Low</td>
                                        <td style={{ padding: '10px', color: '#D97706', fontWeight: '600' }}>High</td>
                                        <td style={{ padding: '10px', color: '#D97706', fontWeight: '600' }}>High</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>Beginner Friendly</td>
                                        <td style={{ padding: '10px', color: 'var(--text-primary)' }}>⭐⭐⭐⭐⭐</td>
                                        <td style={{ padding: '10px', color: 'var(--text-primary)' }}>⭐⭐⭐</td>
                                        <td style={{ padding: '10px', color: 'var(--text-primary)' }}>⭐⭐</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>Market Demand</td>
                                        <td style={{ padding: '10px', color: 'var(--text-primary)' }}>High</td>
                                        <td style={{ padding: '10px', color: 'var(--text-primary)' }}>High</td>
                                        <td style={{ padding: '10px', color: '#16A34A', fontWeight: '600' }}>Very High</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* MARKET DEMAND TELEMETRY CHART */}
                    <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'Outfit' }}>📊 Market Demand Snapshot</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '2px' }}>Relative job market postings index. Last Updated: August 2026. Market data changes over time.</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {marketDemand.map(item => (
                                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ width: '150px', fontSize: '12px', color: 'var(--text-secondary)' }}>{item.name}</span>
                                    <div style={{ flex: '1', height: '10px', backgroundColor: '#E2E8F0', borderRadius: '5px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${item.value}%`, backgroundColor: 'var(--primary)' }} />
                                    </div>
                                    <span style={{ width: '100px', fontSize: '11px', textAlign: 'right', color: item.trend.includes('Rapidly') ? '#D97706' : 'var(--text-secondary)', fontWeight: item.trend.includes('Rapidly') ? '600' : '400' }}>{item.trend}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SKILL DEMAND SEARCH EXPLORER */}
                    <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'Outfit' }}>🔥 In-Demand Skill Explorer</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '2px' }}>Search a technology to audit its industry transferability index.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                type="text"
                                value={skillSearch}
                                onChange={(e) => setSkillSearch(e.target.value)}
                                placeholder="Search skill (e.g. Python, SQL, Java)..."
                                style={{ flex: '1', padding: '8px 12px', fontSize: '12px', backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                            />
                        </div>
                        {skillResult && (
                            <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>Skill: {skillResult.skill}</strong>
                                    <span style={{ color: '#D97706', fontWeight: '700' }}>Demand: {skillResult.demand}</span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', margin: '0', lineHeight: '1.4' }}>{skillResult.transferability}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Unlocked Roles:</span>
                                    {skillResult.roles && skillResult.roles.map(r => (
                                        <span key={r} className="badge-item" style={{ fontSize: '9px', border: '1px solid rgba(37,99,235,0.2)', backgroundColor: '#EFF6FF', color: '#2563EB', padding: '2px 6px', borderRadius: '4px' }}>{r}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* COMPANIES HIRING SECTION */}
                    <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'Outfit' }}>🏢 Companies Hiring By Career</h3>
                            <select 
                                value={companyTarget}
                                onChange={(e) => setCompanyTarget(e.target.value)}
                                style={{ padding: '6px 10px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '12px' }}
                            >
                                <option value="Cybersecurity SOC Analyst">Cybersecurity SOC Analyst</option>
                                <option value="Java Backend Developer">Java Backend Developer</option>
                                <option value="Data Scientist">Data Scientist</option>
                            </select>
                        </div>

                        {/* Company Card list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {companyJobs.map((job, idx) => (
                                <div key={idx} style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-primary)' }}>{job.role}</strong>
                                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{job.company} • {job.location}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '250px', justifyContent: 'flex-end' }}>
                                        {job.skills.split(',').map(s => (
                                            <span key={s} className="badge-item" style={{ fontSize: '9px', padding: '2px 6px', border: '1px solid var(--border-color)', backgroundColor: '#FFFFFF', color: 'var(--text-secondary)', borderRadius: '4px' }}>{s.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {companyJobs.length === 0 && <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>No active mock openings seeded for this path.</div>}
                        </div>

                        {/* Skill Matrix Grid */}
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                            <strong style={{ display: 'block', fontSize: '13px', marginBottom: '10px', color: 'var(--text-primary)' }}>🔎 Company Skill Demand Grid (Click row to explore)</strong>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                                            <th style={{ padding: '8px', color: 'var(--text-primary)' }}>Company</th>
                                            <th style={{ padding: '8px', color: 'var(--text-primary)' }}>Web</th>
                                            <th style={{ padding: '8px', color: 'var(--text-primary)' }}>Data</th>
                                            <th style={{ padding: '8px', color: 'var(--text-primary)' }}>AI/ML</th>
                                            <th style={{ padding: '8px' }}>Cloud</th>
                                            <th style={{ padding: '8px' }}>Cyber</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {companyMatrix.map((comp, idx) => (
                                            <tr 
                                                key={idx} 
                                                onClick={() => handleCompanyClick(comp)}
                                                style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', backgroundColor: selectedCompanyName === comp.company ? '#EFF6FF' : 'transparent' }}
                                            >
                                                <td style={{ padding: '8px', fontWeight: '700', color: 'var(--text-primary)' }}>{comp.company}</td>
                                                <td style={{ padding: '8px', color: comp.web === 'High' ? '#16A34A' : 'var(--text-secondary)', fontWeight: comp.web === 'High' ? '600' : '400' }}>{comp.web}</td>
                                                <td style={{ padding: '8px', color: comp.data === 'High' ? '#16A34A' : 'var(--text-secondary)', fontWeight: comp.data === 'High' ? '600' : '400' }}>{comp.data}</td>
                                                <td style={{ padding: '8px', color: comp.ai.includes('Very') ? '#D97706' : 'var(--text-secondary)', fontWeight: comp.ai.includes('Very') ? '600' : '400' }}>{comp.ai}</td>
                                                <td style={{ padding: '8px', color: comp.cloud === 'High' ? '#16A34A' : 'var(--text-secondary)', fontWeight: comp.cloud === 'High' ? '600' : '400' }}>{comp.cloud}</td>
                                                <td style={{ padding: '8px', color: comp.cyber === 'High' ? '#16A34A' : 'var(--text-secondary)', fontWeight: comp.cyber === 'High' ? '600' : '400' }}>{comp.cyber}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {selectedCompanySkills && (
                                <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#EFF6FF', borderLeft: '2px solid var(--primary)', borderRadius: '4px', fontSize: '12px', color: '#1E40AF' }}>
                                    <strong>{selectedCompanyName} Frequently Looks For:</strong>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                                        {selectedCompanySkills.map(s => (
                                            <span key={s} className="badge-item" style={{ border: '1px solid rgba(37,99,235,0.2)', backgroundColor: '#EFF6FF', color: '#2563EB', padding: '2px 6px', borderRadius: '4px' }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* BEGINNER EXPLORER PATHS */}
                    {profile.currentLevel === 'Beginner' && (
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#16A34A' }}>
                                🌱 You're Just Getting Started
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                {beginnerPaths.map((p) => (
                                    <div key={p.name} className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                                            <strong style={{ color: 'var(--text-primary)' }}>{p.name}</strong>
                                            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Friendliness: {p.friend}</span>
                                        </div>
                                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0', lineHeight: '1.4' }}>{p.desc}</p>
                                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                            Project types: <em>{p.proj}</em>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* RIGHT COLUMN: OTHER CAREER OPTIONS */}
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '24px' }}>
                        <div className="card-premium" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Bot size={20} color="var(--primary)" />
                            <div>
                                <h3 style={{ fontSize: '15px', fontWeight: '800', fontFamily: 'Outfit', margin: 0 }}>🔀 Other Career Options For You</h3>
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Based on your target goal and current skills compatibility.</span>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {alternatives.map((alt) => (
                                <div 
                                    key={alt.name} 
                                    className="card-premium" 
                                    onClick={() => handleSwitchPath(alt.name)}
                                    style={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        gap: '8px', 
                                        padding: '16px', 
                                        backgroundColor: '#FFFFFF',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <strong style={{ fontSize: '14px', color: '#0F172A' }}>{alt.name}</strong>
                                        <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--primary)' }}>
                                            {switchingGoal === alt.name ? "Regenerating..." : `${alt.matchScore}% Match`}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Transition: {alt.transition}</div>
                                    
                                    {/* Progress Bar */}
                                    <div style={{ width: '100%', height: '6px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden', margin: '4px 0' }}>
                                        <div style={{ width: `${alt.matchScore}%`, height: '100%', backgroundColor: '#2563EB', borderRadius: '3px' }}></div>
                                    </div>
                                    
                                    <p style={{ fontSize: '11px', color: '#64748B', margin: '0', lineHeight: '1.4' }}>
                                        {alt.explanation}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
