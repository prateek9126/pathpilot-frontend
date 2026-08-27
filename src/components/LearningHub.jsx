import React, { useState } from 'react';
import { Video, Briefcase, Award } from 'lucide-react';
import Resources from './Resources';
import Projects from './Projects';
import Certifications from './Certifications';

export default function LearningHub({ profile, roadmap, onUpdateProfileState, onNavigateToTab, onNavigateToModule }) {
    const [activeSubTab, setActiveSubTab] = useState('resources'); // 'resources', 'projects', 'certifications'

    return (
        <div style={{ padding: '0', maxWidth: '100%' }}>
            
            {/* Hub Header */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px', padding: '0 32px' }}>
                <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Unified Learning Center
                </span>
                <h1 style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'Outfit' }}>🎓 Pathfinder Learning Hub</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    Master skills using recommended courses, build hands-on projects, and validate your credentials.
                </p>
            </div>

            {/* Three Options clickable cards container */}
            <div className="learning-hub-options">
                
                {/* Card 1: Learning Resources */}
                <div 
                    onClick={() => setActiveSubTab('resources')}
                    className={`learning-hub-card ${activeSubTab === 'resources' ? 'active' : ''}`}
                >
                    <div>
                        <div className="learning-hub-card-icon">
                            <Video size={22} />
                        </div>
                        <h3 className="learning-hub-card-title">Learning Resources</h3>
                        <p className="learning-hub-card-desc">
                            Discover courses, videos, playlists, documentation, and learning materials tailored to your skills and budget.
                        </p>
                    </div>
                    <div className="learning-hub-card-cta">
                        Explore Resources →
                    </div>
                </div>

                {/* Card 2: Projects */}
                <div 
                    onClick={() => setActiveSubTab('projects')}
                    className={`learning-hub-card ${activeSubTab === 'projects' ? 'active' : ''}`}
                >
                    <div>
                        <div className="learning-hub-card-icon">
                            <Briefcase size={22} />
                        </div>
                        <h3 className="learning-hub-card-title">Projects</h3>
                        <p className="learning-hub-card-desc">
                            Build real-world projects based on your skills, career goals, and current learning roadmap.
                        </p>
                    </div>
                    <div className="learning-hub-card-cta">
                        Explore Projects →
                    </div>
                </div>

                {/* Card 3: Certifications */}
                <div 
                    onClick={() => setActiveSubTab('certifications')}
                    className={`learning-hub-card ${activeSubTab === 'certifications' ? 'active' : ''}`}
                >
                    <div>
                        <div className="learning-hub-card-icon">
                            <Award size={22} />
                        </div>
                        <h3 className="learning-hub-card-title">Certifications</h3>
                        <p className="learning-hub-card-desc">
                            Find relevant certifications that match your career goals, skills, and budget.
                        </p>
                    </div>
                    <div className="learning-hub-card-cta">
                        Explore Certifications →
                    </div>
                </div>

            </div>

            {/* Sub-Tab Panels */}
            <div>
                {activeSubTab === 'resources' && (
                    <Resources 
                        profile={profile}
                        roadmap={roadmap}
                        onNavigateToModule={onNavigateToModule}
                    />
                )}
                
                {activeSubTab === 'projects' && (
                    <Projects 
                        profile={profile}
                        onUpdateProfileState={onUpdateProfileState}
                        onNavigateToTab={onNavigateToTab}
                    />
                )}

                {activeSubTab === 'certifications' && (
                    <Certifications 
                        profile={profile}
                        onUpdateProfileState={onUpdateProfileState}
                        onNavigateToTab={onNavigateToTab}
                    />
                )}
            </div>

        </div>
    );
}
