import React from 'react';
import { Lock, CheckCircle2, PlayCircle, Eye, Info, Sparkles } from 'lucide-react';

export default function Roadmap({ roadmap, onNavigateToModule }) {
    
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Completed':
                return {
                    borderColor: 'rgba(16, 185, 129, 0.4)',
                    background: 'linear-gradient(135deg, rgba(22, 33, 54, 0.7), rgba(16, 185, 129, 0.03))',
                    dotColor: 'var(--accent)',
                    badgeText: 'Completed',
                    badgeBg: 'rgba(16, 185, 129, 0.15)',
                    badgeColor: '#6ee7b7'
                };
            case 'Available':
            case 'In_Progress':
                return {
                    borderColor: 'var(--primary)',
                    background: 'linear-gradient(135deg, rgba(22, 33, 54, 0.8), rgba(99, 102, 241, 0.05))',
                    dotColor: 'var(--primary)',
                    badgeText: status === 'In_Progress' ? 'In Progress' : 'Start Now',
                    badgeBg: 'rgba(99, 102, 241, 0.2)',
                    badgeColor: '#a5b4fc'
                };
            case 'Locked':
            default:
                return {
                    borderColor: 'rgba(255, 255, 255, 0.05)',
                    background: 'rgba(22, 33, 54, 0.2)',
                    dotColor: 'rgba(255, 255, 255, 0.1)',
                    badgeText: 'Locked',
                    badgeBg: 'rgba(255, 255, 255, 0.05)',
                    badgeColor: 'var(--text-secondary)'
                };
        }
    };

    return (
        <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
            
            {/* Header info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '8px' }}>
                        🗺️ Your Personalized Learning Roadmap
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        This timeline represents your adapted learning path. As you complete modules and quizzes, the AI recalibrates upcoming milestones.
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: 'rgba(99, 102, 241, 0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', fontSize: '12px' }}>
                    <Sparkles size={16} color="var(--primary)" />
                    <span style={{ color: '#a5b4fc', fontWeight: '600' }}>Adaptive Engine Active</span>
                </div>
            </div>

            {/* Phases Loop */}
            {roadmap.map((phase, pIdx) => {
                const isPhaseLocked = phase.status === 'Locked';
                
                return (
                    <div key={phase.id} style={{ marginBottom: '40px', opacity: isPhaseLocked ? 0.6 : 1 }}>
                        
                        {/* Phase Title Card */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: isPhaseLocked ? 'rgba(255,255,255,0.05)' : 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContext: 'center', fontSize: '13px', fontWeight: '700', color: isPhaseLocked ? 'var(--text-secondary)' : 'var(--primary)', justifyContent: 'center' }}>
                                {pIdx + 1}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'Outfit' }}>
                                    {phase.title}
                                </h3>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    {phase.description}
                                </p>
                            </div>
                        </div>

                        {/* Modules vertical line timeline */}
                        <div className="timeline">
                            {phase.modules.map((mod) => {
                                const styles = getStatusStyles(mod.status);
                                const isRemediation = mod.id.includes('remediation');

                                return (
                                    <div key={mod.id} className={`timeline-item ${mod.status.toLowerCase().replace('_', '-')}`} style={{ marginBottom: '24px' }}>
                                        
                                        {/* Timeline Dot */}
                                        <div 
                                            className="timeline-dot" 
                                            style={{ 
                                                borderColor: styles.dotColor, 
                                                backgroundColor: mod.status === 'Completed' ? styles.dotColor : 'var(--bg-app)' 
                                            }}
                                        ></div>

                                        {/* Module Box */}
                                        <div 
                                            className="timeline-content" 
                                            style={{ 
                                                border: `1px solid ${styles.borderColor}`,
                                                background: styles.background,
                                                padding: '20px',
                                                borderRadius: 'var(--border-radius-md)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                                                        {mod.topic}
                                                    </h3>
                                                    {isRemediation && (
                                                        <span style={{ fontSize: '10px', color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Sparkles size={10} /> Adaptive Remediation
                                                        </span>
                                                    )}
                                                </div>

                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {mod.score !== null && (
                                                        <span className="badge-item" style={{ backgroundColor: mod.assessmentStatus === 'Strong_Understanding' ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)', color: mod.assessmentStatus === 'Strong_Understanding' ? '#6ee7b7' : '#a5b4fc', border: 'none' }}>
                                                            Score: {mod.score}% ({mod.assessmentStatus.replace('_', ' ')})
                                                        </span>
                                                    )}
                                                    <span className="badge-item" style={{ backgroundColor: styles.badgeBg, color: styles.badgeColor, border: 'none' }}>
                                                        {styles.badgeText}
                                                    </span>
                                                </div>
                                            </div>

                                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5', marginBottom: '16px' }}>
                                                {mod.description}
                                            </p>

                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '11px', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '12px', marginBottom: '16px' }}>
                                                <div>⏱️ Duration: <strong>{mod.estimatedDuration}</strong></div>
                                                <div>📊 Difficulty: <strong>{mod.difficulty}</strong></div>
                                                <div>📚 Resources: <strong>{mod.recommendedResources ? mod.recommendedResources.length : 0} modules</strong></div>
                                                {mod.prerequisites && mod.prerequisites.length > 0 && (
                                                    <div>Prerequisites: <strong>{mod.prerequisites.join(', ')}</strong></div>
                                                )}
                                            </div>

                                            {/* Action triggers */}
                                            {mod.status === 'Completed' ? (
                                                <button className="btn-secondary" onClick={() => onNavigateToModule(mod.id)} style={{ padding: '8px 16px', fontSize: '12px' }}>
                                                    <Eye size={14} /> Review Learning Workspace
                                                </button>
                                            ) : mod.status === 'Available' || mod.status === 'In_Progress' ? (
                                                <button className="btn-primary" onClick={() => onNavigateToModule(mod.id)} style={{ padding: '8px 16px', fontSize: '12px' }}>
                                                    <PlayCircle size={14} /> Start Module Workspace
                                                </button>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                                                    <Lock size={12} /> Complete preceding modules to unlock.
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                );
            })}

        </div>
    );
}
