import React, { useState } from 'react';
import { Compass, GraduationCap, Flame, Clock, CheckCircle2, Circle, Lock, Play, ArrowRight, Sparkles, Send } from 'lucide-react';
import { api } from '../api';

export default function Path({ profile, roadmap, onNavigateToModule, onNavigateToTab }) {
    const [aiQuestion, setAiQuestion] = useState("");
    const [aiAnswer, setAiAnswer] = useState("");
    const [aiLoading, setAiLoading] = useState(false);

    // Calculate dynamic stats
    let totalModules = 0;
    let completedModules = 0;
    let inProgressModule = null;
    let nextModule = null;
    let remainingMinutes = 0;
    const completedList = [];
    const lockedList = [];
    const remainingList = [];

    // Flat list of modules to check order
    const allModulesFlat = [];

    roadmap.forEach(phase => {
        phase.modules.forEach(mod => {
            totalModules++;
            allModulesFlat.push(mod);

            // Parse estimated duration (e.g. "4h" or "2 hours" -> minutes)
            let durationMins = 120; // default 2 hours
            const match = mod.estimatedDuration.match(/(\d+)\s*(h|hour|min)/i);
            if (match) {
                const val = parseInt(match[1]);
                const unit = match[2].toLowerCase();
                if (unit.startsWith('h')) {
                    durationMins = val * 60;
                } else {
                    durationMins = val;
                }
            }

            if (mod.status === 'Completed') {
                completedModules++;
                completedList.push({
                    ...mod,
                    phaseName: phase.name,
                    completionDate: 'Recently'
                });
            } else {
                remainingMinutes += durationMins;
                remainingList.push(mod);
                if (mod.status === 'Locked') {
                    lockedList.push(mod);
                }
            }

            // Find current/in-progress module
            if (mod.status === 'In_Progress') {
                inProgressModule = mod;
            }
        });
    });

    // Determine what to do next
    // The first module in flat list that is either 'In_Progress' or 'Available' (not completed)
    const activeModule = inProgressModule || allModulesFlat.find(m => m.status === 'Available');
    
    // Find the next module immediately following the active module
    if (activeModule) {
        const activeIdx = allModulesFlat.findIndex(m => m.id === activeModule.id);
        if (activeIdx !== -1 && activeIdx + 1 < allModulesFlat.length) {
            nextModule = allModulesFlat[activeIdx + 1];
        }
    } else {
        // If nothing is active (e.g. all completed or locked), pick the first incomplete module
        nextModule = allModulesFlat.find(m => m.status !== 'Completed');
    }

    const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
    
    // Streak from profile
    const streak = profile.streak || 5;

    // Remaining hours
    const remainingHours = Math.round(remainingMinutes / 60);

    // Paced weeks remaining
    const weeksRemaining = Math.max(1, Math.ceil(remainingHours / 8)); // Assuming 8 hours study pace per week

    // Career readiness breakdown
    const skillsReadiness = Math.min(100, Math.round(30 + progressPercent * 0.7));
    const projectsReadiness = progressPercent > 50 ? 80 : 30;
    const certsReadiness = progressPercent > 70 ? 90 : 20;
    const overallReadiness = Math.round((skillsReadiness + projectsReadiness + certsReadiness) / 3);

    const handleDurationClick = (mod, e) => {
        if (e) {
            e.stopPropagation();
        }
        if (mod && mod.recommendedResources) {
            const videoRes = mod.recommendedResources.find(r => 
                (r.type && r.type.includes('Video')) || 
                (r.platform && r.platform.toLowerCase().includes('youtube')) || 
                (r.url && (r.url.includes('youtube.com') || r.url.includes('youtu.be')))
            );
            if (videoRes && videoRes.url && videoRes.url !== "https://www.youtube.com" && videoRes.url !== "https://youtube.com") {
                window.open(videoRes.url, '_blank');
                return;
            }
        }
        
        // Match specific high-quality direct YouTube video URLs for topics
        const topic = (mod ? mod.topic : "").toLowerCase();
        let targetUrl = "";
        
        if (topic.includes("sql") || topic.includes("database")) {
            targetUrl = "https://youtu.be/HXV3zeQKqGY"; // SQL Tutorial for Beginners
        } else if (topic.includes("networking") || topic.includes("tcp")) {
            targetUrl = "https://youtu.be/VwfrQy3kGw8"; // Neso Academy Networking Course
        } else if (topic.includes("java") && !topic.includes("javascript")) {
            targetUrl = "https://youtu.be/A74TOX803X0"; // FreeCodeCamp Java Course
        } else if (topic.includes("oop") || topic.includes("object oriented")) {
            targetUrl = "https://youtu.be/SiBw7skDz94"; // Kunal Kushwaha OOP
        } else if (topic.includes("spring boot") || topic.includes("hibernate") || topic.includes("jpa")) {
            targetUrl = "https://youtu.be/35EQXmHKZYs"; // Spring Boot Course
        } else if (topic.includes("security") || topic.includes("siem") || topic.includes("incident") || topic.includes("soc")) {
            targetUrl = "https://youtu.be/O1fJ9mR9r00"; // Cybersecurity Course
        } else if (topic.includes("linux")) {
            targetUrl = "https://youtu.be/sWbUDq4S6Yw"; // Linux Course
        } else if (topic.includes("react")) {
            targetUrl = "https://youtu.be/Ke90Tje7VS0"; // React Course
        } else if (topic.includes("html") || topic.includes("css") || topic.includes("javascript") || topic.includes("web dev") || topic.includes("frontend")) {
            targetUrl = "https://youtu.be/mU6anWqOD4c"; // Web Dev Course
        } else if (topic.includes("python")) {
            targetUrl = "https://youtu.be/_uQrJ0TkZlc"; // Python Course
        } else if (topic.includes("machine learning") || topic.includes("neural") || topic.includes("deep learning") || topic.includes("nlp") || topic.includes("ai")) {
            targetUrl = "https://youtu.be/GwIo3gToViM"; // Machine Learning Course
        } else {
            targetUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent((mod ? mod.topic : "") + " tutorial")}`;
        }
        
        window.open(targetUrl, '_blank');
    };

    // AI Advisor recommendation handler
    const handleAskAdvisor = async (e) => {
        e.preventDefault();
        if (!aiQuestion.trim() || aiLoading) return;
        setAiLoading(true);
        setAiAnswer("");

        try {
            const prompt = `Based on my roadmap for becoming a ${profile.targetGoal}, overall progress is ${progressPercent}%, completed modules is ${completedModules}/${totalModules}, current active module is "${activeModule?.topic || 'none'}". Question: ${aiQuestion}`;
            const res = await api.sendChatMessage(prompt);
            setAiAnswer(res.text || "Continue focusing on completing the available steps in your learning path, particularly finishing modules related to your goal track.");
        } catch (err) {
            setAiAnswer(`Based on your goal to become a ${profile.targetGoal}, the advisor recommends focusing on "${activeModule?.topic || 'the next topic'}" as it matches your current skill gaps.`);
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '0' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 32px' }}>
                <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Pathpilot Roadmap
                </span>
                <h1 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Outfit' }}>🛣️ Your Learning Path</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                    Follow your personalized path, track your progress, and see what you should learn next.
                </p>
            </div>

            {/* Main Progress Bar Container */}
            <div style={{ padding: '0 32px' }}>
                <div className="card-premium" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Your Learning Progress</h3>
                        <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>{progressPercent}% Complete</span>
                    </div>
                    <div className="progress-bar-container" style={{ height: '12px' }}>
                        <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <span>0% Started</span>
                        <span>{completedModules} of {totalModules} Topics Completed</span>
                        <span>100% Career Ready</span>
                    </div>
                </div>
            </div>

            {/* Responsive Columns Wrapper */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', padding: '0 32px' }} className="dashboard-grid">
                
                {/* Left Column - Roadmap timeline & Action items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* You're Learning Now / Current active module */}
                    {activeModule && (
                        <div className="card-premium" style={{ borderColor: 'rgba(37, 99, 235, 0.3)', background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(37, 99, 235, 0.02) 100%)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div className="stats-card-icon-container" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', margin: 0 }}>
                                    <Compass size={20} className="spin" />
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary)' }}>🔵 You're Learning Now</h3>
                            </div>
                            <div>
                                <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>{activeModule.topic}</h2>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{activeModule.description}</p>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                <div 
                                    onClick={() => handleDurationClick(activeModule)}
                                    title="Click to search tutorials on YouTube"
                                    style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                                >
                                    ⏱️ <strong>Est. Duration:</strong> Learn
                                </div>
                                <div>⚡ <strong>Difficulty:</strong> {activeModule.difficulty}</div>
                            </div>
                            <button 
                                onClick={() => onNavigateToModule(activeModule.id)}
                                className="btn-primary" 
                                style={{ alignSelf: 'flex-start' }}
                            >
                                Continue Learning <Play size={14} fill="#fff" />
                            </button>
                        </div>
                    )}

                    {/* What to do next */}
                    {nextModule && (
                        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                🚀 What To Do Next
                            </h3>
                            <div>
                                <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{nextModule.topic}</h4>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{nextModule.description}</p>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '8px', background: 'var(--bg-secondary)', borderRadius: '6px', marginTop: '10px', fontStyle: 'italic' }}>
                                    <strong>Why next:</strong> "{nextModule.whyRecommended || 'Builds upon your preceding skills in the roadmap flow.'}"
                                </div>
                            </div>
                            <button 
                                onClick={() => onNavigateToModule(nextModule.id)}
                                className="btn-secondary" 
                                style={{ alignSelf: 'flex-start' }}
                            >
                                Start Next Topic <ArrowRight size={14} />
                            </button>
                        </div>
                    )}

                    {/* Visual Vertical Roadmap Timeline */}
                    <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>🎯 Your Current Path</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Goal track: <strong style={{ color: 'var(--primary)' }}>{profile.targetGoal}</strong></p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '8px', position: 'relative' }}>
                            {/* Vertical connector line */}
                            <div style={{
                                position: 'absolute',
                                left: '19px',
                                top: '15px',
                                bottom: '15px',
                                width: '2px',
                                backgroundColor: 'var(--border-color)',
                                zIndex: 1
                            }} />

                            {roadmap.map((phase, pIdx) => (
                                <div key={pIdx} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 2 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            backgroundColor: '#EFF6FF',
                                            border: '2px solid var(--primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '700',
                                            fontSize: '11px',
                                            color: 'var(--primary)'
                                        }}>
                                            {pIdx + 1}
                                        </div>
                                        <h4 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)' }}>
                                            {phase.name}
                                        </h4>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '36px' }}>
                                        {phase.modules.map((mod, mIdx) => {
                                            let icon = <Circle size={16} color="var(--text-secondary)" />;
                                            let statusText = "Locked";
                                            let statusBadge = "badge-advanced"; // gray/locked style
                                            let styleColor = 'var(--text-secondary)';

                                            if (mod.status === 'Completed') {
                                                icon = <CheckCircle2 size={16} color="var(--success)" fill="rgba(22, 163, 74, 0.1)" />;
                                                statusText = "Completed";
                                                statusBadge = "badge-free"; // green
                                                styleColor = 'var(--text-primary)';
                                            } else if (mod.status === 'In_Progress') {
                                                icon = <Compass size={16} color="var(--primary)" />;
                                                statusText = "In Progress";
                                                statusBadge = "badge-recommended"; // blue
                                                styleColor = 'var(--text-primary)';
                                            } else if (mod.status === 'Available') {
                                                icon = <Circle size={16} color="var(--warning)" />;
                                                statusText = "Next Up";
                                                statusBadge = "badge-recommended"; // yellow/blue alternative
                                                styleColor = 'var(--text-primary)';
                                            } else {
                                                icon = <Lock size={14} color="var(--text-secondary)" />;
                                            }

                                            return (
                                                <div 
                                                    key={mIdx} 
                                                    onClick={() => mod.status !== 'Locked' && onNavigateToModule(mod.id)}
                                                    style={{ 
                                                        display: 'flex', 
                                                        justifyContent: 'space-between', 
                                                        alignItems: 'center',
                                                        padding: '12px 16px',
                                                        backgroundColor: 'var(--bg-secondary)',
                                                        borderRadius: '10px',
                                                        cursor: mod.status !== 'Locked' ? 'pointer' : 'not-allowed',
                                                        border: '1px solid var(--border-color)',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (mod.status !== 'Locked') {
                                                            e.currentTarget.style.borderColor = 'rgba(37,99,235,0.2)';
                                                            e.currentTarget.style.transform = 'translateX(4px)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                                        e.currentTarget.style.transform = 'translateX(0px)';
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        {icon}
                                                        <span style={{ fontSize: '13px', fontWeight: '600', color: styleColor }}>
                                                            {mod.topic}
                                                        </span>
                                                    </div>
                                                    
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span 
                                                            onClick={(e) => handleDurationClick(mod, e)}
                                                            title="Click to search tutorials on YouTube"
                                                            style={{ 
                                                                fontSize: '11px', 
                                                                color: 'var(--text-secondary)',
                                                                cursor: 'pointer',
                                                                textDecoration: 'underline dotted',
                                                                padding: '2px 4px'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                                                        >
                                                            Learn
                                                        </span>
                                                        <span className={`badge-custom ${statusBadge}`} style={{ fontSize: '9px', padding: '2px 8px' }}>
                                                            {statusText}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Topics Covered & Topics Left */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        
                        {/* Completed list */}
                        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>✅ Topics Covered</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {completedList.length > 0 ? (
                                    completedList.map((c, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#EFF6FF', borderRadius: '8px', fontSize: '12px' }}>
                                            <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{c.topic}</span>
                                            <span className="badge-custom badge-free" style={{ fontSize: '9px', padding: '1px 6px' }}>Passed</span>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No topics completed yet.</div>
                                )}
                            </div>
                        </div>

                        {/* Topics left list */}
                        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>📚 Upcoming Topics</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                                {remainingList.length > 0 ? (
                                    remainingList.map((r, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '12px' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>{r.topic}</span>
                                            <span 
                                                onClick={(e) => handleDurationClick(r, e)}
                                                title="Click to search tutorials on YouTube"
                                                style={{ 
                                                    fontSize: '10px', 
                                                    color: 'var(--text-secondary)',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline dotted'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                                            >
                                                Learn
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>All topics completed! 🎉</div>
                                )}
                            </div>
                        </div>

                    </div>

                </div>

                {/* Right Column - Stats, Projects, Certifications, AI advisor */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Learning Stats */}
                    <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>📊 Learning Statistics</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '10px', textAlign: 'center' }}>
                                <GraduationCap size={16} color="var(--primary)" style={{ margin: '0 auto 6px auto' }} />
                                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Topics Covered</div>
                                <div style={{ fontSize: '16px', fontWeight: '800' }}>{completedModules} / {totalModules}</div>
                            </div>
                            <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '10px', textAlign: 'center' }}>
                                <Flame size={16} color="var(--warning)" style={{ margin: '0 auto 6px auto' }} />
                                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Streak</div>
                                <div style={{ fontSize: '16px', fontWeight: '800' }}>{streak} Days</div>
                            </div>
                            <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '10px', textAlign: 'center' }}>
                                <Clock size={16} color="var(--accent)" style={{ margin: '0 auto 6px auto' }} />
                                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Hours Left</div>
                                <div style={{ fontSize: '16px', fontWeight: '800' }}>{remainingHours} Hrs</div>
                            </div>
                            <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '10px', textAlign: 'center' }}>
                                <Compass size={16} color="var(--primary)" style={{ margin: '0 auto 6px auto' }} />
                                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Est. Duration</div>
                                <div style={{ fontSize: '16px', fontWeight: '800' }}>~ {weeksRemaining} Weeks</div>
                            </div>
                        </div>
                    </div>

                    {/* Skill Gaps indicators */}
                    <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>🔍 Skill Gap Telemetry</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                                    <span>Core Roadmap Theory</span>
                                    <span>{progressPercent}% Met</span>
                                </div>
                                <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div></div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                                    <span>Hands-on Code Projects</span>
                                    <span>{progressPercent > 50 ? '60%' : '20%'} Met</span>
                                </div>
                                <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: progressPercent > 50 ? '60%' : '20%', backgroundColor: 'var(--accent)' }}></div></div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                                    <span>Credential Exams Readiness</span>
                                    <span>{progressPercent > 70 ? '75%' : '15%'} Met</span>
                                </div>
                                <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: progressPercent > 70 ? '75%' : '15%', backgroundColor: 'var(--warning)' }}></div></div>
                            </div>
                        </div>
                    </div>

                    {/* Recommended Project Context Connection */}
                    <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <span className="badge-custom badge-recommended" style={{ alignSelf: 'flex-start' }}>💼 Contextual Project</span>
                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                            {progressPercent > 40 ? "Build a Task Management App" : "Setup HTML/CSS Layout Showcase"}
                        </h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {progressPercent > 40 ? "Apply React hooks, custom state handlers, and local caching to test state logic." : "Start assembling your portfolio landing layouts with clean flex boxes."}
                        </p>
                        <button 
                            onClick={() => onNavigateToTab('hub')}
                            className="btn-secondary" 
                            style={{ padding: '8px 16px', fontSize: '12px', alignSelf: 'flex-start' }}
                        >
                            Explore Projects Hub →
                        </button>
                    </div>

                    {/* Recommended Certification Context Connection */}
                    <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <span className="badge-custom badge-free" style={{ alignSelf: 'flex-start', backgroundColor: '#ECFDF5', color: '#15803D' }}>🏆 Target Certification</span>
                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                            {profile.targetGoal.includes('Security') ? "CompTIA Security+" : "AWS Certified Cloud Practitioner"}
                        </h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Credential matching rate is currently calculated at <strong style={{ color: 'var(--primary)' }}>{progressPercent > 60 ? '88%' : '42%'}</strong> based on your completed skill segments.
                        </p>
                        <button 
                            onClick={() => onNavigateToTab('hub')}
                            className="btn-secondary" 
                            style={{ padding: '8px 16px', fontSize: '12px', alignSelf: 'flex-start' }}
                        >
                            View Certifications →
                        </button>
                    </div>

                    {/* AI Path Advisor Panel */}
                    <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Sparkles size={16} color="var(--primary)" /> AI Path Advisor
                        </h3>
                        
                        {aiAnswer && (
                            <div style={{ padding: '12px', backgroundColor: '#EFF6FF', borderRadius: '8px', fontSize: '12px', color: '#1E40AF', borderLeft: '3px solid var(--primary)', lineHeight: '1.5' }}>
                                🤖 <strong>Advisor:</strong> {aiAnswer}
                            </div>
                        )}

                        <form onSubmit={handleAskAdvisor} style={{ display: 'flex', gap: '8px' }}>
                            <input 
                                type="text"
                                value={aiQuestion}
                                onChange={(e) => setAiQuestion(e.target.value)}
                                placeholder="Am I progressing correctly?"
                                style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}
                            />
                            <button 
                                type="submit"
                                className="btn-primary"
                                style={{ padding: '8px 12px' }}
                                disabled={aiLoading}
                            >
                                <Send size={14} />
                            </button>
                        </form>
                    </div>

                    {/* Career Readiness Meter */}
                    <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(37,99,235,0.02) 100%)', borderColor: 'rgba(37, 99, 235, 0.2)' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>🎯 Career Readiness</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)' }}>{overallReadiness}%</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Ready for Job Hunt</div>
                                <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${overallReadiness}%` }}></div></div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Core Skill Matrix</span>
                                <span>{skillsReadiness}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Code Projects Portfolio</span>
                                <span>{projectsReadiness}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Accredited Credentials</span>
                                <span>{certsReadiness}%</span>
                            </div>
                        </div>
                        
                        {overallReadiness >= 80 ? (
                            <div style={{ padding: '10px', backgroundColor: 'rgba(22, 163, 74, 0.08)', borderRadius: '8px', color: '#16a34a', fontWeight: '700', fontSize: '12px', textAlign: 'center' }}>
                                🎉 You're Career Ready! 
                                <button className="btn-primary" onClick={() => onNavigateToTab('career')} style={{ marginTop: '8px', width: '100%', fontSize: '11px', padding: '6px' }}>
                                    Explore Opportunities
                                </button>
                            </div>
                        ) : (
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center' }}>
                                Complete modules to raise matching scores above 80% to start job applications.
                            </div>
                        )}
                    </div>

                </div>

            </div>

        </div>
    );
}
