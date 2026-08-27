import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Path from './components/Path';
import Workspace from './components/Workspace';
import LearningHub from './components/LearningHub';
import CareerOverview from './components/CareerOverview';
import Footer from './components/Footer';
import { PathPilotHero, PathPilotAbout } from './components/PathPilotSections';
import { api } from './api';
import './App.css';

export default function App() {
    const [profile, setProfile] = useState(null);
    const [roadmap, setRoadmap] = useState([]);
    const [activeModuleId, setActiveModuleId] = useState(null);
    const [appLoading, setAppLoading] = useState(true);

    // Tab state in the app dashboard
    const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard", "profile", "path", "hub", "career"
    
    // Mobile sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        setAppLoading(true);
        try {
            const activeProfile = await api.getProfile();
            const activeRoadmap = await api.getRoadmap();
            if (activeProfile && activeProfile.targetGoal) {
                setProfile(activeProfile);
                setRoadmap(activeRoadmap);
            }
        } catch (err) {
            console.log("No active profile found.");
        } finally {
            setAppLoading(false);
        }
    };

    const handleOnboardSuccess = async (nlpText, formPayload) => {
        const onboardedProfile = await api.onboard(nlpText, formPayload);
        const generatedRoadmap = await api.getRoadmap();
        setProfile(onboardedProfile);
        setRoadmap(generatedRoadmap);
        setActiveModuleId(null);
        setActiveTab("dashboard");
    };

    const handleLoadDemo = async (demoId) => {
        setAppLoading(true);
        try {
            const data = await api.loadDemo(demoId);
            setProfile(data.profile);
            setRoadmap(data.roadmap);
            setActiveModuleId(null);
            setActiveTab("dashboard");
        } catch (err) {
            console.error("Failed to load demo profile", err);
        } finally {
            setAppLoading(false);
        }
    };

    const handleUpdateProfileState = (updatedProfile, updatedRoadmap) => {
        setProfile(updatedProfile);
        if (updatedRoadmap) {
            setRoadmap(updatedRoadmap);
        }
    };

    if (appLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid rgba(37, 99, 235, 0.1)', borderTopColor: '#2563EB', animation: 'spin 1s linear infinite' }} className="spin"></div>
                <div style={{ fontSize: '14px', fontWeight: '700', fontFamily: "'Outfit', sans-serif" }}>LAUNCHING PATHPILOT AI...</div>
            </div>
        );
    }

    // Render public landing screens if no profile is active
    if (!profile) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
                
                {/* Section 1 — PathPilot Hero */}
                <PathPilotHero onGetStarted={() => {
                    const targetSec = document.getElementById('pathpilot-app-section');
                    if (targetSec) targetSec.scrollIntoView({ behavior: 'smooth' });
                }} />

                {/* Section 2 — PathPilot About */}
                <PathPilotAbout />

                {/* Section 3 — Stacked Onboarding gate */}
                <div id="pathpilot-app-section" style={{ backgroundColor: 'var(--bg-app)', borderTop: '1px solid var(--border-color)', position: 'relative' }}>
                    <div style={{ padding: '80px 0' }} className="container">
                        <Onboarding 
                            onOnboardSuccess={handleOnboardSuccess} 
                            onLoadDemo={handleLoadDemo} 
                        />
                    </div>
                </div>

                {/* Global Footer */}
                <Footer />

            </div>
        );
    }

    // Render professional sidebar layout if logged in
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
            
            {/* Desktop Sidebar Navigation */}
            <aside style={{
                width: '260px',
                backgroundColor: '#FFFFFF',
                borderRight: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                zIndex: 100
            }} className="pathpilot-desktop-sidebar">
                
                {/* Top: Logo & Branding */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
                        <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: '#2563EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 10px rgba(37, 99, 235, 0.2)'
                        }}>
                            <div style={{
                                width: '18px',
                                height: '7px',
                                border: '1.5px solid white',
                                borderRadius: '50%',
                                transform: 'rotate(-25deg)'
                            }} />
                        </div>
                        <span style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#0F172A',
                            fontFamily: "'Outfit', sans-serif",
                            letterSpacing: '-0.5px'
                        }}>PathPilot AI</span>
                    </div>

                    {/* Middle: Navigation Links */}
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button 
                            onClick={() => { setActiveTab("dashboard"); setActiveModuleId(null); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                background: activeTab === "dashboard" ? '#EFF6FF' : 'transparent',
                                border: activeTab === "dashboard" ? '1px solid rgba(37, 99, 235, 0.15)' : '1px solid transparent',
                                color: activeTab === "dashboard" ? '#2563EB' : '#64748B',
                                fontSize: '15px',
                                fontWeight: activeTab === "dashboard" ? '600' : '500',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>📊</span> Dashboard
                        </button>

                        <button 
                            onClick={() => { setActiveTab("profile"); setActiveModuleId(null); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                background: activeTab === "profile" ? '#EFF6FF' : 'transparent',
                                border: activeTab === "profile" ? '1px solid rgba(37, 99, 235, 0.15)' : '1px solid transparent',
                                color: activeTab === "profile" ? '#2563EB' : '#64748B',
                                fontSize: '15px',
                                fontWeight: activeTab === "profile" ? '600' : '500',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>👤</span> My Profile
                        </button>

                        <button 
                            onClick={() => { setActiveTab("path"); setActiveModuleId(null); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                background: activeTab === "path" ? '#EFF6FF' : 'transparent',
                                border: activeTab === "path" ? '1px solid rgba(37, 99, 235, 0.15)' : '1px solid transparent',
                                color: activeTab === "path" ? '#2563EB' : '#64748B',
                                fontSize: '15px',
                                fontWeight: activeTab === "path" ? '600' : '500',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>🧭</span> Path
                        </button>

                        <button 
                            onClick={() => { setActiveTab("hub"); setActiveModuleId(null); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                background: activeTab === "hub" ? '#EFF6FF' : 'transparent',
                                border: activeTab === "hub" ? '1px solid rgba(37, 99, 235, 0.15)' : '1px solid transparent',
                                color: activeTab === "hub" ? '#2563EB' : '#64748B',
                                fontSize: '15px',
                                fontWeight: activeTab === "hub" ? '600' : '500',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>🚀</span> Learning Hub
                        </button>

                        <button 
                            onClick={() => { setActiveTab("career"); setActiveModuleId(null); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                background: activeTab === "career" ? '#EFF6FF' : 'transparent',
                                border: activeTab === "career" ? '1px solid rgba(37, 99, 235, 0.15)' : '1px solid transparent',
                                color: activeTab === "career" ? '#2563EB' : '#64748B',
                                fontSize: '15px',
                                fontWeight: activeTab === "career" ? '600' : '500',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>📈</span> Career Overview
                        </button>
                    </nav>
                </div>

                {/* Bottom: Profile / Log Out */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '16px',
                            color: '#FFFFFF'
                        }}>
                            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', margin: 0 }}>{profile.name || "Learner"}</h4>
                            <p style={{ fontSize: '12px', color: '#64748B', margin: 0, textTransform: 'capitalize' }}>{profile.experienceLevel || "Beginner"}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => { setProfile(null); }}
                        style={{
                            background: '#FEF2F2',
                            border: '1px solid #FCA5A5',
                            color: '#DC2626',
                            borderRadius: '8px',
                            padding: '10px',
                            fontWeight: '600',
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            width: '100%',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        🚪 Back to Landing
                    </button>
                </div>

            </aside>

            {/* Main scrollable right content pane */}
            <main style={{
                flex: 1,
                marginLeft: '260px',
                minHeight: '100vh',
                padding: '40px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
                width: 'calc(100% - 260px)'
            }} className="pathpilot-main-content-layout">
                
                {/* Mobile Header Bar */}
                <div style={{
                    display: 'none',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    backgroundColor: '#FFFFFF',
                    borderBottom: '1px solid #E2E8F0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 90,
                    width: '100%'
                }} className="pathpilot-mobile-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            backgroundColor: '#2563EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{
                                width: '15px',
                                height: '6px',
                                border: '1.5px solid white',
                                borderRadius: '50%',
                                transform: 'rotate(-25deg)'
                            }} />
                        </div>
                        <span style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A' }}>PathPilot AI</span>
                    </div>

                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#0F172A',
                            fontSize: '24px',
                            cursor: 'pointer'
                        }}
                    >
                        {sidebarOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile Drawer Navigation overlay */}
                {sidebarOpen && (
                    <div style={{
                        position: 'fixed',
                        top: '63px',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(248, 250, 252, 0.98)',
                        zIndex: 95,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '30px',
                        gap: '24px',
                        borderTop: '1px solid #E2E8F0'
                    }} className="pathpilot-mobile-drawer">
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <button 
                                onClick={() => { setActiveTab("dashboard"); setActiveModuleId(null); setSidebarOpen(false); }}
                                style={{
                                    padding: '16px',
                                    borderRadius: '10px',
                                    background: activeTab === "dashboard" ? '#EFF6FF' : 'transparent',
                                    border: '1px solid #E2E8F0',
                                    color: activeTab === "dashboard" ? '#2563EB' : '#64748B',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    textAlign: 'left'
                                }}
                            >
                                📊 Dashboard
                            </button>
                            <button 
                                onClick={() => { setActiveTab("profile"); setActiveModuleId(null); setSidebarOpen(false); }}
                                style={{
                                    padding: '16px',
                                    borderRadius: '10px',
                                    background: activeTab === "profile" ? '#EFF6FF' : 'transparent',
                                    border: '1px solid #E2E8F0',
                                    color: activeTab === "profile" ? '#2563EB' : '#64748B',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    textAlign: 'left'
                                }}
                            >
                                👤 My Profile
                            </button>
                            <button 
                                onClick={() => { setActiveTab("path"); setActiveModuleId(null); setSidebarOpen(false); }}
                                style={{
                                    padding: '16px',
                                    borderRadius: '10px',
                                    background: activeTab === "path" ? '#EFF6FF' : 'transparent',
                                    border: '1px solid #E2E8F0',
                                    color: activeTab === "path" ? '#2563EB' : '#64748B',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    textAlign: 'left'
                                }}
                            >
                                🧭 Path
                            </button>
                            <button 
                                onClick={() => { setActiveTab("hub"); setActiveModuleId(null); setSidebarOpen(false); }}
                                style={{
                                    padding: '16px',
                                    borderRadius: '10px',
                                    background: activeTab === "hub" ? '#EFF6FF' : 'transparent',
                                    border: '1px solid #E2E8F0',
                                    color: activeTab === "hub" ? '#2563EB' : '#64748B',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    textAlign: 'left'
                                }}
                            >
                                🚀 Learning Hub
                            </button>
                            <button 
                                onClick={() => { setActiveTab("career"); setActiveModuleId(null); setSidebarOpen(false); }}
                                style={{
                                    padding: '16px',
                                    borderRadius: '10px',
                                    background: activeTab === "career" ? '#EFF6FF' : 'transparent',
                                    border: '1px solid #E2E8F0',
                                    color: activeTab === "career" ? '#2563EB' : '#64748B',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    textAlign: 'left'
                                }}
                            >
                                📈 Career Overview
                            </button>
                        </nav>

                        <button 
                            onClick={() => { setProfile(null); setSidebarOpen(false); }}
                            style={{
                                background: '#FEF2F2',
                                border: '1px solid #FCA5A5',
                                color: '#DC2626',
                                borderRadius: '10px',
                                padding: '16px',
                                fontWeight: '700',
                                fontSize: '15px',
                                width: '100%',
                                marginTop: 'auto'
                            }}
                        >
                            🚪 Back to Landing
                        </button>
                    </div>
                )}

                {/* Sub-view Area */}
                <div style={{ width: '100%' }}>
                    {activeModuleId ? (
                        <div style={{ padding: '0 32px' }}>
                            <Workspace 
                                activeModuleId={activeModuleId} 
                                onBackToRoadmap={() => { setActiveModuleId(null); }}
                                onUpdateProfileState={handleUpdateProfileState}
                            />
                        </div>
                    ) : (
                        <>
                            {activeTab === "dashboard" && (
                                <Dashboard 
                                    profile={profile} 
                                    roadmap={roadmap} 
                                    onNavigateToModule={(id) => { setActiveModuleId(id); }}
                                    onNavigateToTab={(tab) => { setActiveTab(tab); }}
                                    onUpdateProfileState={handleUpdateProfileState}
                                />
                            )}

                            {activeTab === "profile" && (
                                <Profile 
                                    profile={profile} 
                                    onUpdateProfileState={handleUpdateProfileState}
                                />
                            )}

                            {activeTab === "path" && (
                                <Path 
                                    profile={profile}
                                    roadmap={roadmap}
                                    onNavigateToModule={(id) => { setActiveModuleId(id); }}
                                    onNavigateToTab={(tab) => { setActiveTab(tab); }}
                                />
                            )}

                            {activeTab === "hub" && (
                                <LearningHub 
                                    profile={profile}
                                    roadmap={roadmap}
                                    onUpdateProfileState={handleUpdateProfileState}
                                    onNavigateToTab={(tab) => { setActiveTab(tab); }}
                                    onNavigateToModule={(id) => { setActiveModuleId(id); }}
                                />
                            )}

                            {activeTab === "career" && (
                                <CareerOverview 
                                    profile={profile}
                                    onUpdateProfileState={handleUpdateProfileState}
                                    onNavigateToTab={(tab) => { setActiveTab(tab); }}
                                />
                            )}
                        </>
                    )}
                </div>

            </main>
        </div>
    );
}
