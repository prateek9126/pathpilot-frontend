import React from 'react';
import { Sparkles, Brain, Award, ShieldAlert, Target, Rocket, Compass, TrendingUp, Layers, HelpCircle } from 'lucide-react';

export default function Landing({ onGetStarted, profile }) {
    
    const scrollToAbout = () => {
        const aboutSec = document.getElementById('about-section');
        if (aboutSec) {
            aboutSec.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const journeySteps = [
        { label: "User Goal", desc: "Enter career aspirations" },
        { label: "Learner Profile", desc: "Audit experience level" },
        { label: "Skill Analysis", desc: "Assess baseline capabilities" },
        { label: "Skill Gaps", desc: "Identify missing topics" },
        { label: "Learning Roadmap", desc: "Generate adaptive milestones" },
        { label: "Learning Resources", desc: "Select budget-aware courses" },
        { label: "Projects", desc: "Build real-world portfolios" },
        { label: "Certifications", desc: "Validate industry credentials" },
        { label: "Career Overview", desc: "Evaluate alternative paths" },
        { label: "Career Ready", desc: "Acelerate job recruitment" }
    ];

    const features = [
        { title: "AI Career Advisor", desc: "Personalized consultant outlining transition timelines, stay-vs-switch advice, and industry skills transfers.", icon: <Brain size={24} color="var(--primary)" /> },
        { title: "Personalized Roadmap", desc: "Milestone-by-milestone curriculum adapting automatically to your active profile skill level adjustments.", icon: <Compass size={24} color="#ff7a00" /> },
        { title: "Smart Resources", desc: "Budget-aware selection of video tutorials, courses, and documentation to cover your specific skill gaps.", icon: <Layers size={24} color="#10b981" /> },
        { title: "AI Projects Recommendations", desc: "Seeded templates with custom sql schemas, file structure trees, and interactive code assistants.", icon: <Rocket size={24} color="#3b82f6" /> },
        { title: "Certifications Auditing", desc: "Compare exam costs and validity side-by-side, tracking study milestones to unlock +500 XP.", icon: <Award size={24} color="#ec4899" /> },
        { title: "Career Intelligence", desc: "Hiring company demand matrices, skill explorer pathways, and relative job postings demand charts.", icon: <TrendingUp size={24} color="#a5b4fc" /> }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>
            
            {/* HERO SECTION */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                alignItems: 'center', 
                gap: '40px',
                minHeight: '80vh',
                padding: '0 40px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background glow effects */}
                <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

                {/* Left Hero Texts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', zIndex: '1' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', width: 'fit-content' }}>
                        <Sparkles size={14} color="var(--primary)" />
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#a5b4fc', letterSpacing: '0.05em' }}>NEXT-GEN CAREER INTELLIGENCE</span>
                    </div>

                    <h1 style={{ fontSize: '46px', fontWeight: '900', lineHeight: '1.2', fontFamily: 'Outfit', background: 'linear-gradient(135deg, #ffffff 60%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Your AI-Powered Career & <br />Learning Companion
                    </h1>

                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '520px' }}>
                        Discover the right career, identify your skill gaps, build a personalized learning roadmap, learn through the best resources, create real-world projects, and become career-ready.
                    </p>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        <button className="btn-primary" onClick={onGetStarted} style={{ padding: '14px 28px', fontSize: '14px' }}>
                            {profile ? 'Go to Dashboard →' : 'Get Started →'}
                        </button>
                        <button className="btn-secondary" onClick={scrollToAbout} style={{ padding: '14px 28px', fontSize: '14px' }}>
                            Explore PathPilot AI
                        </button>
                    </div>

                    {/* Highlights icons */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.1)' }}>
                                <Target size={16} color="var(--primary)" />
                            </div>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>🎯 Personalized Career Path</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.1)' }}>
                                <Brain size={16} color="var(--primary)" />
                            </div>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>🧠 AI-Powered Learning</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.1)' }}>
                                <Rocket size={16} color="var(--primary)" />
                            </div>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>🚀 Real-World Projects</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.1)' }}>
                                <Award size={16} color="var(--primary)" />
                            </div>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>🏆 Career-Ready Skills</span>
                        </div>
                    </div>
                </div>

                {/* Right Hero Graphic */}
                <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                    <div className="card-premium" style={{ 
                        width: '420px', 
                        height: '420px', 
                        borderRadius: '24px', 
                        background: 'linear-gradient(135deg, rgba(16, 24, 48, 0.95), rgba(8, 12, 24, 0.98))',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '24px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        {/* Animated Grid Lines */}
                        <div style={{ 
                            position: 'absolute', 
                            top: '0', 
                            left: '0', 
                            width: '100%', 
                            height: '100%', 
                            backgroundImage: 'radial-gradient(rgba(99, 102, 241, 0.15) 1px, transparent 0)', 
                            backgroundSize: '24px 24px',
                            opacity: '0.4'
                        }} />

                        {/* Outer Glow */}
                        <div style={{ 
                            width: '140px', 
                            height: '140px', 
                            borderRadius: '50%', 
                            background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
                            position: 'absolute',
                            animation: 'pulse 3s infinite'
                        }} />

                        <Brain size={64} color="var(--primary)" style={{ zIndex: '1', filter: 'drop-shadow(0 0 12px var(--primary))' }} />

                        <div style={{ textAlign: 'center', zIndex: '1' }}>
                            <span style={{ fontSize: '14px', fontWeight: '800', display: 'block', color: 'var(--text-primary)' }}>PathPilot Core Engine</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>Analyzing Market Signals & Skill Demands</span>
                        </div>

                        {/* Interactive floating parameters mockup */}
                        <div style={{ display: 'flex', gap: '8px', zIndex: '1' }}>
                            <span style={{ padding: '6px 12px', fontSize: '10px', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', color: '#6ee7b7' }}>Skills Audited</span>
                            <span style={{ padding: '6px 12px', fontSize: '10px', backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', color: '#a5b4fc' }}>Roadmaps Built</span>
                            <span style={{ padding: '6px 12px', fontSize: '10px', backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', color: '#fbd38d' }}>Jobs Linked</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* ABOUT / JOURNEY SECTION */}
            <div id="about-section" style={{ padding: '0 40px', display: 'flex', flexDirection: 'column', gap: '56px' }}>
                
                {/* Header info */}
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        ONE PLATFORM. YOUR ENTIRE CAREER JOURNEY.
                    </span>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', fontFamily: 'Outfit' }}>
                        Bridging Gaps, Accelerating Readiness
                    </h2>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '640px', lineHeight: '1.6' }}>
                        Many learners get stuck deciding which career tracks to choose, what specific tools to master, which certifications are worth their budget, or how to switch paths. PathPilot AI solves this by connecting profiling, personalized resources, and company demand insights.
                    </p>
                </div>

                {/* VISUAL JOURNEY FLOW CHART */}
                <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflowX: 'auto', padding: '32px 24px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', textAlign: 'center', marginBottom: '8px' }}>🚀 The PathPilot AI End-to-End Cycle</h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '980px', gap: '8px' }}>
                        {journeySteps.map((step, idx) => (
                            <React.Fragment key={idx}>
                                <div style={{ 
                                    flex: '1',
                                    padding: '12px 10px', 
                                    backgroundColor: 'rgba(0,0,0,0.15)', 
                                    border: '1px solid var(--border-color)', 
                                    borderRadius: '8px', 
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px',
                                    minHeight: '80px',
                                    justifyContent: 'center'
                                }}>
                                    <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{step.label}</strong>
                                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1.2' }}>{step.desc}</span>
                                </div>
                                {idx < journeySteps.length - 1 && (
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '16px', fontWeight: 'bold' }}>→</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* FEATURE CARDS GRID */}
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '24px', textAlign: 'center' }}>
                        Integrated Career Intelligence Features
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        {features.map((feat) => (
                            <div key={feat.title} className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {feat.icon}
                                    <h4 style={{ fontSize: '14px', fontWeight: '800', margin: '0' }}>{feat.title}</h4>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0' }}>
                                    {feat.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}
