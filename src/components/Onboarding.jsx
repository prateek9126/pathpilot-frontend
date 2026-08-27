import React, { useState } from 'react';
import { Sparkles, FormInput, Play, Terminal, Coffee, BarChart2 } from 'lucide-react';

export default function Onboarding({ onOnboardSuccess, onLoadDemo }) {
    const [mode, setMode] = useState('nlp'); // 'nlp' or 'form'
    const [nlpText, setNlpText] = useState("I want to become a SOC Analyst. I know basic Python and Linux but I have never studied networking.");
    const [name, setName] = useState("Alex Learner");
    const [goal, setGoal] = useState("Cybersecurity SOC Analyst");
    const [level, setLevel] = useState("Intermediate");
    const [style, setStyle] = useState("Mixed");
    const [time, setTime] = useState("5 hours/week");
    const [completion, setCompletion] = useState("3 Months");
    const [rawSkills, setRawSkills] = useState("Python, Linux");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleNlpSubmit = async (e) => {
        e.preventDefault();
        if (!nlpText.trim()) {
            setError("Please write your learning goal.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await onOnboardSuccess(nlpText, null);
        } catch (err) {
            setError(err.message || "Failed to parse onboarding input");
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        // Parse raw skills list into SkillNodes
        const skillNames = rawSkills.split(',').map(s => s.trim()).filter(Boolean);
        const skillsList = skillNames.map(name => ({
            name,
            level: level === 'Beginner' ? 30 : (level === 'Intermediate' ? 60 : 80),
            status: level
        }));

        const profilePayload = {
            name,
            targetGoal: goal,
            currentLevel: level,
            preferredLearningStyle: style,
            availableTime: time,
            targetCompletionPeriod: completion,
            skills: skillsList
        };

        try {
            await onOnboardSuccess(null, profilePayload);
        } catch (err) {
            setError(err.message || "Failed to onboard profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '16px', background: 'linear-gradient(135deg, #a5b4fc, #6366f1, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    PathPilot AI
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
                    Personalized, adaptive learning paths designed by an AI mentor that understands your gaps.
                </p>
            </div>

            {/* Demo Section */}
            <div className="card-premium" style={{ marginBottom: '32px', borderColor: 'var(--primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <Sparkles size={20} color="var(--primary)" />
                    <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Quick Try — Choose a Demo Profile</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                    Skip onboarding and immediately experience the personalized roadmap recalculations, skill gap analysis, and interactive AI mentoring.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <button className="btn-secondary" onClick={() => onLoadDemo('soc')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px', textAlign: 'center', height: '100%' }}>
                        <Terminal size={28} color="#3b82f6" />
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>Demo 1: SOC Analyst</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Gap: Networking<br/>Skills: Python, Linux</div>
                        </div>
                    </button>
                    <button className="btn-secondary" onClick={() => onLoadDemo('java')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px', textAlign: 'center', height: '100%' }}>
                        <Coffee size={28} color="#f59e0b" />
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>Demo 2: Java Backend</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Gap: SQL, Spring Boot<br/>Skills: Java, OOP</div>
                        </div>
                    </button>
                    <button className="btn-secondary" onClick={() => onLoadDemo('ds')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px', textAlign: 'center', height: '100%' }}>
                        <BarChart2 size={28} color="#10b981" />
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>Demo 3: Data Scientist</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Gap: Machine Learning<br/>Skills: Python, Stats</div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Mode selection tab */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
                <button 
                    className={mode === 'nlp' ? 'btn-primary' : 'btn-secondary'} 
                    onClick={() => setMode('nlp')}
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                    <Sparkles size={14} /> Natural Language Onboarding
                </button>
                <button 
                    className={mode === 'form' ? 'btn-primary' : 'btn-secondary'} 
                    onClick={() => setMode('form')}
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                    <FormInput size={14} /> Traditional Form Onboarding
                </button>
            </div>

            {error && (
                <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderRadius: 'var(--border-radius-sm)', marginBottom: '24px', fontSize: '14px' }}>
                    {error}
                </div>
            )}

            {/* Form Modes */}
            <div className="card-premium">
                {mode === 'nlp' ? (
                    <form onSubmit={handleNlpSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                                Tell us about your learning goal and background in your own words:
                            </label>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '12px' }}>
                                For example: "I want to become a SOC Analyst. I know basic Linux and Python but I don't know networking."
                            </p>
                            <textarea
                                value={nlpText}
                                onChange={(e) => setNlpText(e.target.value)}
                                placeholder="Describe your target career, what you already know, and what you struggle with..."
                                style={{ width: '100%', height: '140px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--text-primary)', padding: '16px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                            {loading ? "Analyzing..." : "Generate AI Learning Roadmap"} <Play size={16} />
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleFormSubmit}>
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
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Experience Level</label>
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
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Preferred Learning Style</label>
                                <select 
                                    value={style} 
                                    onChange={(e) => setStyle(e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--text-primary)', outline: 'none' }}
                                >
                                    <option value="Mixed">Mixed (Videos, Reading, Labs)</option>
                                    <option value="Videos">Videos</option>
                                    <option value="Reading">Reading & Documentation</option>
                                    <option value="Hands-on projects">Hands-on projects</option>
                                    <option value="Interactive practice">Interactive practice</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Weekly Study Time</label>
                                <select 
                                    value={time} 
                                    onChange={(e) => setTime(e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--text-primary)', outline: 'none' }}
                                >
                                    <option value="5 hours/week">5 hours/week</option>
                                    <option value="10 hours/week">10 hours/week</option>
                                    <option value="15 hours/week">15 hours/week</option>
                                    <option value="20 hours/week">20 hours/week</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Target Completion Period</label>
                                <select 
                                    value={completion} 
                                    onChange={(e) => setCompletion(e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--text-primary)', outline: 'none' }}
                                >
                                    <option value="1 Month">1 Month</option>
                                    <option value="3 Months">3 Months</option>
                                    <option value="6 Months">6 Months</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Existing Skills (comma separated)</label>
                            <input 
                                type="text" 
                                value={rawSkills} 
                                onChange={(e) => setRawSkills(e.target.value)} 
                                placeholder="e.g., Python, Linux, Java, SQL"
                                style={{ width: '100%', padding: '10px 12px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--text-primary)', outline: 'none' }}
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                            {loading ? "Configuring Path..." : "Initialize Roadmap"} <Play size={16} />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
