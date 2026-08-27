import React, { useEffect, useState } from 'react';
import { Mail, Compass, HelpCircle, ArrowRight } from 'lucide-react';

export function PathPilotHero({ onGetStarted }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const playVideo = async (videoEl) => {
            if (!videoEl) return;
            videoEl.muted = true;
            try {
                await videoEl.play();
            } catch (err) {
                // swallow rejections
            }
        };

        const interval = setInterval(() => {
            const vids = document.querySelectorAll('.pathpilot-video');
            vids.forEach(v => {
                if (v && v.paused) {
                    playVideo(v);
                }
            });
        }, 1000);

        const handleInteraction = () => {
            const vids = document.querySelectorAll('.pathpilot-video');
            vids.forEach(v => playVideo(v));
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };

        document.addEventListener('click', handleInteraction);
        document.addEventListener('touchstart', handleInteraction);

        return () => {
            clearInterval(interval);
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };
    }, []);

    return (
        <section style={{ 
            minHeight: '100svh', 
            backgroundColor: '#F8FAFC', 
            position: 'relative', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }} id="pathpilot-hero-section">
            
            {/* Background Video */}
            <video 
                className="pathpilot-video"
                src="/WhatsApp Video 2026-08-26 at 11.46.47 PM.mp4"
                autoPlay 
                muted 
                loop 
                playsInline
                preload="auto"
                style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: '0',
                    pointerEvents: 'none'
                }}
            />

            {/* Navbar */}
            <header style={{
                position: 'relative',
                zIndex: '10',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px',
                padding: '24px 40px',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)'
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#2563EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 10px rgba(37, 99, 235, 0.2)'
                    }}>
                        <div style={{
                            width: '20px',
                            height: '8px',
                            border: '1.5px solid white',
                            borderRadius: '50%',
                            transform: 'rotate(-25deg)'
                        }} />
                    </div>
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '800',
                        color: '#0F172A',
                        fontFamily: "'Outfit', sans-serif",
                        letterSpacing: '-0.5px'
                    }}>PathPilot</span>
                </div>

                {/* Navigation links (Desktop) */}
                <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="pathpilot-nav-desktop">
                    <a href="#pathpilot-hero-section" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '700', fontSize: '14px', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif" }}>HOME</a>
                    <a href="#pathpilot-about-section" style={{ color: '#64748B', textDecoration: 'none', fontWeight: '600', fontSize: '14px', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif", transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#2563EB'} onMouseLeave={(e) => e.target.style.color = '#64748B'}>ABOUT</a>
                    <a href="#pathpilot-app-section" style={{ color: '#64748B', textDecoration: 'none', fontWeight: '600', fontSize: '14px', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif", transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#2563EB'} onMouseLeave={(e) => e.target.style.color = '#64748B'}>PATHPILOT</a>
                </nav>

                {/* Launch Button (Desktop) */}
                <button 
                    onClick={() => {
                        const contactSec = document.getElementById('pathpilot-app-section');
                        if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-primary"
                    style={{
                        padding: '10px 20px',
                        fontSize: '13px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        border: 'none',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    Get Started <ArrowRight size={14} />
                </button>

                {/* Hamburger (Mobile toggle) */}
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="targo-menu-btn-mobile"
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
            </header>

            {/* Mobile Nav overlay */}
            {mobileMenuOpen && (
                <div style={{
                    position: 'absolute',
                    top: '75px',
                    left: '0',
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    borderBottom: '1px solid #E2E8F0',
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
                    padding: '24px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                    zIndex: '99'
                }} className="targo-menu-mobile">
                    <a href="#pathpilot-hero-section" onClick={() => setMobileMenuOpen(false)} style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '700', fontSize: '15px', fontFamily: "'Outfit', sans-serif" }}>HOME</a>
                    <a href="#pathpilot-about-section" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0F172A', textDecoration: 'none', fontWeight: '600', fontSize: '15px', fontFamily: "'Outfit', sans-serif" }}>ABOUT</a>
                    <a href="#pathpilot-app-section" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0F172A', textDecoration: 'none', fontWeight: '600', fontSize: '15px', fontFamily: "'Outfit', sans-serif" }}>PATHPILOT</a>
                </div>
            )}

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
