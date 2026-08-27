import React, { useState, useEffect } from 'react';
import { User, Shield, PenTool, CheckCircle, Save, Sliders, RefreshCw } from 'lucide-react';
import { api } from '../api';

export default function Profile({ profile, onUpdateProfileState }) {
    const [name, setName] = useState(profile.name);
    const [goal, setGoal] = useState(profile.targetGoal);
    const [level, setLevel] = useState(profile.currentLevel);
    const [style, setStyle] = useState(profile.preferredLearningStyle);
    const [time, setTime] = useState(profile.availableTime);
    const [completion, setCompletion] = useState(profile.targetCompletionPeriod);
    
    // Skills local adjustments
    const [skills, setSkills] = useState(profile.skills || []);
    
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Earned credentials state
    const [earnedCerts, setEarnedCerts] = useState([]);

    useEffect(() => {
        fetchEarnedCertifications();
    }, []);

    const fetchEarnedCertifications = async () => {
        try {
            const list = await api.getCertifications(1000000, "All");
            const completed = list.filter(c => c.status === 'COMPLETED');
            setEarnedCerts(completed);
        } catch (err) {
            console.log("Error loading profile certifications", err);
        }
    };

    // Helper to get goal category
    const getGoalCategory = (g) => {
        const goalStr = (g || "").toLowerCase();
        if (goalStr.includes("soc") || goalStr.includes("cyber") || goalStr.includes("security")) return "soc";
        if (goalStr.includes("java") || goalStr.includes("backend") || goalStr.includes("spring")) return "java";
        if (goalStr.includes("data") || goalStr.includes("science") || goalStr.includes("ml") || goalStr.includes("stats") || goalStr.includes("scientist")) return "ds";
        return "generic";
    };

    const [currentGoalCategory, setCurrentGoalCategory] = useState(getGoalCategory(profile.targetGoal));

    useEffect(() => {
        const cat = getGoalCategory(goal);
        if (cat !== currentGoalCategory) {
            setCurrentGoalCategory(cat);
            // Load default skills for this category
            let defaultSkills = [];
            if (cat === 'soc') {
                defaultSkills = [
                    { name: "Linux", level: 30, status: "Beginner" },
                    { name: "Python", level: 30, status: "Beginner" },
                    { name: "Networking", level: 20, status: "Beginner" },
                    { name: "SIEM", level: 0, status: "None" },
                    { name: "Log Analysis", level: 10, status: "Beginner" },
                    { name: "MITRE ATT&CK", level: 0, status: "None" },
                    { name: "Threat Detection", level: 5, status: "Beginner" },
                    { name: "Incident Response", level: 0, status: "None" }
                ];
            } else if (cat === 'java') {
                defaultSkills = [
                    { name: "Java", level: 40, status: "Beginner" },
                    { name: "OOP", level: 40, status: "Beginner" },
                    { name: "SQL", level: 20, status: "Beginner" },
                    { name: "Spring Boot", level: 15, status: "Beginner" },
                    { name: "REST APIs", level: 10, status: "Beginner" },
                    { name: "JPA / Hibernate", level: 0, status: "None" },
                    { name: "Spring Security", level: 0, status: "None" }
                ];
            } else if (cat === 'ds') {
                defaultSkills = [
                    { name: "Python", level: 40, status: "Beginner" },
                    { name: "Statistics", level: 30, status: "Beginner" },
                    { name: "Machine Learning", level: 10, status: "Beginner" },
                    { name: "Data Visualization", level: 30, status: "Beginner" },
                    { name: "Deep Learning", level: 0, status: "None" },
                    { name: "Model Deployment", level: 0, status: "None" }
                ];
            } else {
                defaultSkills = [
                    { name: "Core Concepts", level: 20, status: "Beginner" }
                ];
            }
            setSkills(defaultSkills);
        }
    }, [goal]);


    const handleSkillLevelChange = (idx, val) => {
        const updated = [...skills];
        updated[idx] = {
            ...updated[idx],
            level: Number(val),
            status: Number(val) >= 80 ? "Advanced" : (Number(val) >= 50 ? "Intermediate" : "Beginner")
        };
        setSkills(updated);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMessage("");
        
        const payload = {
            name,
            targetGoal: goal,
            currentLevel: level,
            preferredLearningStyle: style,
            availableTime: time,
            targetCompletionPeriod: completion,
            skills: skills
        };

        try {
            const updatedProfile = await api.updateProfile(payload);
            const updatedRoadmap = await api.getRoadmap();
            onUpdateProfileState(updatedProfile, updatedRoadmap);
            setSuccessMessage("Profile saved successfully. Your learning roadmap has been adapted and recalculated!");
        } catch (err) {
            setSuccessMessage("Failed to save profile. Check if the backend server is running.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '0', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h1 style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '8px' }}>
                    👤 Learner Profile Editor
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Adjust your career targets, schedule availability, and manual skill levels. Changes dynamically recalculate your path.
                </p>
            </div>

            {successMessage && (
                <div style={{ padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent)', color: '#6ee7b7', borderRadius: '8px', fontSize: '14px' }}>
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="card-premium">
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sliders size={18} color="var(--primary)" /> Profile Parameters
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Full Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                style={{ width: '100%', padding: '10px 12px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--text-primary)', outline: 'none' }}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Target Career / Goal</label>
                            <input 
                                type="text" 
                                value={goal} 
                                onChange={(e) => setGoal(e.target.value)} 
                                style={{ width: '100%', padding: '10px 12px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--text-primary)', outline: 'none' }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Current Experience Level</label>
                            <select 
                                value={level} 
                                onChange={(e) => setLevel(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--text-primary)', outline: 'none' }}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Preferred Style</label>
                            <select 
                                value={style} 
                                onChange={(e) => setStyle(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--text-primary)', outline: 'none' }}
                            >
                                <option value="Mixed">Mixed</option>
                                <option value="Videos">Videos</option>
                                <option value="Reading">Reading</option>
                                <option value="Hands-on projects">Hands-on projects</option>
                                <option value="Interactive practice">Interactive practice</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Available Time</label>
                            <input 
                                type="text" 
                                value={time} 
                                onChange={(e) => setTime(e.target.value)} 
                                style={{ width: '100%', padding: '10px 12px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--text-primary)', outline: 'none' }}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Target Completion Period</label>
                            <input 
                                type="text" 
                                value={completion} 
                                onChange={(e) => setCompletion(e.target.value)} 
                                style={{ width: '100%', padding: '10px 12px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--text-primary)', outline: 'none' }}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Skills Profile Section */}
                <div className="card-premium">
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', fontFamily: 'Outfit' }}>🛠️ Skill Levels Matrix</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                        Manually override your current skill ratings (0 - 100%). Saving will trigger gaps re-analysis.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {skills.map((skill, idx) => (
                            <div key={skill.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                    <span style={{ fontWeight: '600' }}>{skill.name}</span>
                                    <span style={{ color: 'var(--primary)' }}>{skill.level}% ({skill.status})</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={skill.level}
                                    onChange={(e) => handleSkillLevelChange(idx, e.target.value)}
                                    style={{ accentColor: 'var(--primary)' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="btn-primary" disabled={submitting} style={{ alignSelf: 'flex-start' }}>
                    {submitting ? "Recalculating Path..." : "Save Profile & Adapt Roadmap"} <Save size={16} />
                </button>
            </form>

            {/* Earned Certifications Section */}
            <div className="card-premium">
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🏆 Earned Certifications
                </h3>
                {earnedCerts.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {earnedCerts.map(cert => (
                            <div key={cert.id} style={{ padding: '12px 16px', backgroundColor: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Award size={24} color="#6ee7b7" />
                                <div>
                                    <strong style={{ display: 'block', fontSize: '14px', color: '#6ee7b7' }}>{cert.name}</strong>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Issued by {cert.provider} • Verified</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0' }}>
                        No certifications verified yet. Start preparation on the **Certifications** tab and pass exams to build your credentials!
                    </p>
                )}
            </div>
        </div>
    );
}
