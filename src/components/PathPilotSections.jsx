import React, { useState } from 'react';
import { Mail, Compass, HelpCircle, ArrowRight, ArrowLeft, BookOpen, AlertCircle, Award, CheckCircle2, Target, FileText, Sparkles } from 'lucide-react';
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

export function PathPilotNavbar({ landingView, setLandingView, onPathPilotClick }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header style={{
            position: 'relative',
            zIndex: '100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            padding: '24px 40px',
            backgroundColor: 'rgba(11, 15, 25, 0.85)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            width: '100%'
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setLandingView("home")}>
                <span style={{
                    fontSize: '22px',
                    fontWeight: '800',
                    color: '#FFFFFF',
                    fontFamily: "'Outfit', sans-serif",
                    letterSpacing: '-0.5px'
                }}>PathPilot</span>
            </div>

            {/* Navigation links (Desktop) aligned to the right */}
            <nav style={{ display: 'flex', gap: '32px', alignItems: 'center', marginLeft: 'auto' }} className="pathpilot-nav-desktop">
                <span 
                    onClick={() => setLandingView("home")} 
                    style={{ 
                        color: landingView === "home" ? '#60A5FA' : '#94A3B8', 
                        textDecoration: 'none', 
                        fontWeight: '700', 
                        fontSize: '14px', 
                        letterSpacing: '0.05em', 
                        fontFamily: "'Outfit', sans-serif",
                        cursor: 'pointer',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => { if (landingView !== "home") e.target.style.color = '#FFFFFF' }}
                    onMouseLeave={(e) => { if (landingView !== "home") e.target.style.color = '#94A3B8' }}
                >
                    HOME
                </span>
                <span 
                    onClick={() => setLandingView("about")} 
                    style={{ 
                        color: landingView === "about" ? '#60A5FA' : '#94A3B8', 
                        textDecoration: 'none', 
                        fontWeight: '700', 
                        fontSize: '14px', 
                        letterSpacing: '0.05em', 
                        fontFamily: "'Outfit', sans-serif",
                        cursor: 'pointer',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => { if (landingView !== "about") e.target.style.color = '#FFFFFF' }}
                    onMouseLeave={(e) => { if (landingView !== "about") e.target.style.color = '#94A3B8' }}
                >
                    ABOUT
                </span>
                <span 
                    onClick={onPathPilotClick} 
                    style={{ 
                        color: '#94A3B8', 
                        textDecoration: 'none', 
                        fontWeight: '700', 
                        fontSize: '14px', 
                        letterSpacing: '0.05em', 
                        fontFamily: "'Outfit', sans-serif",
                        cursor: 'pointer',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#FFFFFF'}
                    onMouseLeave={(e) => e.target.style.color = '#94A3B8'}
                >
                    PATHPILOT
                </span>
            </nav>

            {/* Hamburger (Mobile toggle) */}
            <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="pathpilot-menu-btn-mobile"
                style={{
                    background: '#2563EB',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'none',
                    flexDirection: 'column',
                    gap: '5px',
                    padding: '10px'
                }}
            >
                <div style={{ width: '20px', height: '2px', backgroundColor: '#fff' }} />
                <div style={{ width: '20px', height: '2px', backgroundColor: '#fff' }} />
                <div style={{ width: '20px', height: '2px', backgroundColor: '#fff' }} />
            </button>

            {/* Mobile Nav overlay */}
            {mobileMenuOpen && (
                <div style={{
                    position: 'absolute',
                    top: '75px',
                    left: '0',
                    width: '100%',
                    backgroundColor: '#0F172A',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    padding: '24px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                    zIndex: '99'
                }} className="pathpilot-menu-mobile">
                    <span onClick={() => { setLandingView("home"); setMobileMenuOpen(false); }} style={{ color: landingView === "home" ? '#60A5FA' : '#FFFFFF', textDecoration: 'none', fontWeight: '700', fontSize: '15px', fontFamily: "'Outfit', sans-serif", cursor: 'pointer' }}>HOME</span>
                    <span onClick={() => { setLandingView("about"); setMobileMenuOpen(false); }} style={{ color: landingView === "about" ? '#60A5FA' : '#FFFFFF', textDecoration: 'none', fontWeight: '600', fontSize: '15px', fontFamily: "'Outfit', sans-serif", cursor: 'pointer' }}>ABOUT</span>
                    <span onClick={() => { onPathPilotClick(); setMobileMenuOpen(false); }} style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: '600', fontSize: '15px', fontFamily: "'Outfit', sans-serif", cursor: 'pointer' }}>PATHPILOT</span>
                </div>
            )}
        </header>
    );
}

export function PathPilotHero({ onGetStarted }) {
    return (
        <section style={{ 
            minHeight: '100svh', 
            backgroundColor: '#0B0F19', 
            position: 'relative', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }} id="pathpilot-hero-section">
            
            {/* Dot Pattern Background behind the Hero */}
            <DotPattern
                cy={1}
                cr={1}
                cx={1}
                fill="rgba(255, 255, 255, 0.4)"
                className={cn(
                    "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
                )}
                style={{ zIndex: 0, opacity: 0.85 }}
            />

            {/* Split-Screen Hero Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                zIndex: '1',
                padding: '80px 40px',
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.1fr 0.9fr',
                    gap: '48px',
                    alignItems: 'center',
                    width: '100%',
                    position: 'relative',
                    zIndex: '2'
                }} className="dashboard-grid">
                    
                    {/* Left side: branding/headlines */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}>
                        
                        {/* Tagline Badge */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '99px',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#60A5FA',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#60A5FA' }} />
                            Personalized. Intelligent. Future-Ready.
                        </div>

                        {/* Branding Headline */}
                        <h1 style={{
                            fontSize: 'clamp(32px, 4.2vw, 48px)',
                            fontWeight: '800',
                            lineHeight: '1.15',
                            color: '#FFFFFF',
                            margin: 0,
                            fontFamily: "'Outfit', sans-serif",
                            letterSpacing: '-0.02em'
                        }}>
                            Your AI Companion for <span style={{ color: '#60A5FA' }}>Smarter Learning</span> & Career Growth
                        </h1>

                        {/* Description */}
                        <p style={{
                            fontSize: 'clamp(14px, 1.6vw, 16px)',
                            lineHeight: '1.7',
                            color: '#94A3B8',
                            margin: 0,
                            maxWidth: '540px',
                            fontFamily: "'Inter', sans-serif"
                        }}>
                            PathPilot AI creates personalized learning paths based on goals, skills, experience, interests, progress, and career objectives. Start your customized journey and bridge your skill gaps today.
                        </p>

                        {/* Start Path Button */}
                        <div style={{ marginTop: '12px' }}>
                            <button
                                onClick={onGetStarted}
                                className="btn-primary"
                                style={{
                                    padding: '14px 28px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                Start Learning Path <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                            </button>
                        </div>
                    </div>

                    {/* Right side: Illustration */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: '100%',
                            maxWidth: '440px',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            backgroundColor: 'rgba(15, 23, 42, 0.6)',
                            padding: '8px'
                        }}>
                            <img
                                src="/pathpilot_hero_illustration.jpg"
                                alt="AI and Personalized Learning illustration"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: '14px',
                                    display: 'block',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}

export function PathPilotAbout() {
    return (
        <section style={{
            backgroundColor: '#F8FAFC',
            backgroundImage: 'linear-gradient(180deg, rgba(248,250,252,0.5) 0%, #FFFFFF 100%)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '48px',
            padding: '100px 40px 80px 40px',
            maxWidth: '1200px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1
        }} id="pathpilot-about-section">
            
            {/* Left column */}
            <div style={{ flex: '1 1 420px', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.01em',
                    lineHeight: '1.05',
                    color: '#0F172A',
                    margin: '0',
                    fontSize: 'clamp(34px, 6.5vw, 64px)'
                }}>
                    ABOUT<br />
                    <span style={{ color: '#2563EB' }}>OUR WEBSITE</span>
                </h2>

                <p style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 'clamp(14px, 1.6vw, 16px)',
                    lineHeight: '1.8',
                    color: '#64748B',
                    margin: '16px 0 0 0',
                    maxWidth: '520px'
                }}>
                    PathPilot AI is an intelligent career and learning platform designed to help students and learners find the right direction, understand their skill gaps, and build a personalized path toward their career goals. From learning resources and real-world projects to certifications and career insights, PathPilot AI brings the entire journey together in one place.
                </p>

                <p style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 'clamp(14px, 1.6vw, 16px)',
                    fontWeight: '600',
                    lineHeight: '1.8',
                    color: '#0F172A',
                    margin: '16px 0 0 0',
                    maxWidth: '520px'
                }}>
                    Learn smarter. Build better. Choose your career with confidence.
                </p>

                <div style={{ marginTop: '24px' }}>
                    <button 
                        onClick={() => {
                            const onboardingSec = document.getElementById('pathpilot-app-section');
                            if (onboardingSec) onboardingSec.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="btn-primary"
                        style={{
                            padding: '16px 32px',
                            fontSize: '15px',
                            fontWeight: '700',
                            display: 'inline-flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        EXPLORE PATHPILOT AI <ArrowRight size={16} style={{ marginLeft: '10px' }} />
                    </button>
                </div>
            </div>

            {/* Right column: Generated Career/Education Image */}
            <div style={{ 
                flex: '1 1 420px', 
                minWidth: '320px', 
                display: 'flex',
                justifyContent: 'center', 
                position: 'relative'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '480px',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
                    border: '1px solid #E2E8F0'
                }}>
                    <img 
                        src="/education_career_hero.jpg" 
                        alt="Education and Career Development" 
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                        }}
                    />
                </div>
            </div>

        </section>
    );
}

export function PathPilotAboutPage({ onBackToDashboard }) {
    const steps = [
        { num: 1, title: "Tell us your goal", desc: "Define your dream career target or objective.", icon: <Target size={20} color="#2563EB" /> },
        { num: 2, title: "Build learner profile", desc: "We map your current skills, experience, and interests.", icon: <FileText size={20} color="#2563EB" /> },
        { num: 3, title: "Identify skill gaps", desc: "Compare your current skills with industry standards.", icon: <AlertCircle size={20} color="#2563EB" /> },
        { num: 4, title: "Generate roadmap", desc: "Receive a personalized, adaptive learning timeline.", icon: <Compass size={20} color="#2563EB" /> },
        { num: 5, title: "Recommend resources", desc: "Get curated courses, books, and video learning guides.", icon: <BookOpen size={20} color="#2563EB" /> },
        { num: 6, title: "Learn and assess", desc: "Take milestone quizzes and verify your knowledge.", icon: <CheckCircle2 size={20} color="#2563EB" /> },
        { num: 7, title: "Adapt the roadmap", desc: "Path automatically adjusts based on your feedback.", icon: <Sparkles size={20} color="#2563EB" /> },
        { num: 8, title: "Recommend next best action", desc: "AI directs you to the optimal next step continuously.", icon: <Award size={20} color="#2563EB" /> }
    ];

    return (
        <div style={{ backgroundColor: '#F8FAFC', padding: '60px 40px', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                
                {/* Back Button and Page Header */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                    <button 
                        onClick={onBackToDashboard}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            color: '#2563EB',
                            fontWeight: '700',
                            fontSize: '14px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                            transition: 'all 0.2s',
                            fontFamily: "'Outfit', sans-serif"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#EFF6FF';
                            e.currentTarget.style.transform = 'translateX(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                            e.currentTarget.style.transform = 'translateX(0)';
                        }}
                    >
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>

                    <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif" }}>
                        Dedicated About Page
                    </span>
                </div>

                {/* Main Hero Header */}
                <div style={{ textAlign: 'center', padding: '20px 0 0 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h1 style={{
                        fontSize: 'clamp(36px, 5vw, 56px)',
                        fontWeight: '900',
                        color: '#0F172A',
                        fontFamily: "'Outfit', sans-serif",
                        margin: 0,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1
                    }}>
                        ABOUT <span style={{ color: '#2563EB' }}>PATHPILOT AI</span>
                    </h1>
                    <p style={{
                        fontSize: 'clamp(15px, 2vw, 18px)',
                        color: '#64748B',
                        maxWidth: '700px',
                        margin: '0 auto',
                        lineHeight: 1.6
                    }}>
                        Discover how our AI-powered personalized learning and career guidance system helps you navigate your career with absolute confidence.
                    </p>
                </div>

                {/* Core Pillars Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '24px',
                    marginTop: '20px'
                }}>
                    {/* What is PathPilot */}
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '16px',
                        padding: '32px',
                        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sparkles size={24} color="#2563EB" />
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', fontFamily: "'Outfit', sans-serif", margin: 0 }}>
                            What is PathPilot AI?
                        </h3>
                        <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                            An intelligent learning assistant that acts as your personalized GPS for career success, bridging the gap between theoretical study plans and actual industry requirements.
                        </p>
                    </div>

                    {/* The Problem */}
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '16px',
                        padding: '32px',
                        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertCircle size={24} color="#EF4444" />
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', fontFamily: "'Outfit', sans-serif", margin: 0 }}>
                            The Problem
                        </h3>
                        <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                            Students and professionals often struggle to identify what topics to learn next, which sequence is most effective, and which specific technical skill gaps stand between them and their target goals.
                        </p>
                    </div>

                    {/* Our Solution */}
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '16px',
                        padding: '32px',
                        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle2 size={24} color="#10B981" />
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', fontFamily: "'Outfit', sans-serif", margin: 0 }}>
                            Our Solution
                        </h3>
                        <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                            PathPilot analyzes your career goals, existing knowledge profile, work experience, time budget, and interest areas to automatically compose and dynamically adapt an optimized learning roadmap.
                        </p>
                    </div>
                </div>

                {/* Workflow Timeline Section */}
                <div style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '20px',
                    padding: '40px',
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.03)',
                    marginTop: '20px'
                }}>
                    <h2 style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: '800',
                        color: '#0F172A',
                        fontSize: '28px',
                        marginBottom: '32px',
                        textAlign: 'center'
                    }}>
                        How It Works
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '24px'
                    }}>
                        {steps.map((step) => (
                            <div key={step.num} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                padding: '20px',
                                border: '1px solid #F1F5F9',
                                borderRadius: '12px',
                                backgroundColor: '#F8FAFC',
                                transition: 'all 0.2s'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '12px',
                                        fontWeight: '800',
                                        color: '#2563EB',
                                        backgroundColor: '#EFF6FF',
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontFamily: "'Outfit', sans-serif"
                                    }}>
                                        STEP 0{step.num}
                                    </span>
                                    {step.icon}
                                </div>
                                <h4 style={{
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    color: '#0F172A',
                                    margin: '4px 0 0 0',
                                    fontFamily: "'Outfit', sans-serif"
                                }}>
                                    {step.title}
                                </h4>
                                <p style={{
                                    fontSize: '13.5px',
                                    color: '#64748B',
                                    lineHeight: '1.5',
                                    margin: 0
                                }}>
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                    borderRadius: '20px',
                    padding: '48px',
                    textAlign: 'center',
                    color: '#FFFFFF',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
                    marginTop: '20px'
                }}>
                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <h2 style={{ fontSize: '30px', fontWeight: '800', fontFamily: "'Outfit', sans-serif", margin: 0 }}>
                            Ready to Build Your Personalized Path?
                        </h2>
                        <p style={{ fontSize: '15px', color: '#94A3B8', maxWidth: '600px', margin: 0, lineHeight: 1.6 }}>
                            Answer a few quick questions about your career goals and technical skills, and let PathPilot AI map out the optimal route for you.
                        </p>
                        <button
                            onClick={onBackToDashboard}
                            className="btn-primary"
                            style={{
                                padding: '14px 28px',
                                fontSize: '14px',
                                fontWeight: '700',
                                borderRadius: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                                transition: 'all 0.2s',
                                marginTop: '10px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
