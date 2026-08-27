import React, { useState } from 'react';
import { Star, MessageSquare, Briefcase, CheckCircle } from 'lucide-react';

export default function Footer() {
    const [rating, setRating] = useState(5);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [partnerSubmitted, setPartnerSubmitted] = useState(false);

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        setFeedbackSubmitted(true);
        setTimeout(() => setFeedbackSubmitted(false), 4000);
    };

    const handlePartnerSubmit = (e) => {
        e.preventDefault();
        setPartnerSubmitted(true);
        setTimeout(() => setPartnerSubmitted(false), 4000);
    };

    return (
        <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderTop: '1px solid #E2E8F0', 
            padding: '56px 40px 32px 40px', 
            marginTop: '80px',
            display: 'flex',
            flexDirection: 'column',
            gap: '48px',
            position: 'relative',
            boxShadow: '0 -4px 20px rgba(15, 23, 42, 0.02)',
            zIndex: 1
        }}>
            
            {/* Grid structure: Left Feedback, Right Partnerships */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '56px' }} className="dashboard-grid">
                
                {/* FEEDBACK SECTION */}
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '20px',
                    padding: '24px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
                }}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
                            <MessageSquare size={20} color="#2563EB" /> Help Us Improve PathPilot AI
                        </h3>
                        <p style={{ color: '#64748B', fontSize: '12px', marginTop: '6px' }}>
                            Submit your rating, bugs encountered, or suggestions to optimize recommendations.
                        </p>
                    </div>

                    {feedbackSubmitted ? (
                        <div style={{ padding: '16px', backgroundColor: '#ECFDF5', border: '1px solid #16A34A', color: '#15803D', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle size={16} /> Thank you! Your feedback has been logged to our analytics tracker.
                        </div>
                    ) : (
                        <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <input 
                                    type="text" 
                                    placeholder="Your Name" 
                                    required
                                    style={{ padding: '10px 14px', fontSize: '12px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', color: '#0F172A', outline: 'none' }}
                                />
                                <input 
                                    type="email" 
                                    placeholder="Your Email" 
                                    required
                                    style={{ padding: '10px 14px', fontSize: '12px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', color: '#0F172A', outline: 'none' }}
                                />
                            </div>
                            
                            <textarea 
                                placeholder="Suggestions or problems encountered..." 
                                required
                                rows={3}
                                style={{ padding: '10px 14px', fontSize: '12px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', color: '#0F172A', outline: 'none', resize: 'none' }}
                            />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '12px', color: '#64748B' }}>Rating:</span>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <button 
                                            key={num}
                                            type="button"
                                            onClick={() => setRating(num)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}
                                        >
                                            <Star size={16} fill={num <= rating ? '#2563EB' : 'none'} color={num <= rating ? '#2563EB' : '#64748B'} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="btn-primary" 
                                style={{ 
                                    alignSelf: 'flex-start', 
                                    padding: '10px 20px', 
                                    fontSize: '12px', 
                                    borderRadius: '8px', 
                                    border: 'none', 
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s' 
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                Submit Feedback
                            </button>
                        </form>
                    )}
                </div>

                {/* PARTNER WITH US SECTION */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
                            <Briefcase size={20} color="#2563EB" /> Partner With PathPilot AI
                        </h3>
                        <p style={{ color: '#64748B', fontSize: '12px', marginTop: '6px' }}>
                            Tailored modules for enterprise recruitment channels, training academies, and colleges.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '11px', color: '#64748B', lineHeight: '1.4' }}>
                        <div style={{ padding: '12px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)' }}>
                            <strong style={{ color: '#0F172A' }}>For Companies 🏢</strong>
                            <p style={{ marginTop: '4px', fontSize: '10px', color: '#64748B' }}>Find candidates matching skills and project milestones directly.</p>
                        </div>
                        <div style={{ padding: '12px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)' }}>
                            <strong style={{ color: '#0F172A' }}>For Colleges 🏫</strong>
                            <p style={{ marginTop: '4px', fontSize: '10px', color: '#64748B' }}>Identify student skill gaps and customize adaptive roadmaps.</p>
                        </div>
                        <div style={{ padding: '12px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)' }}>
                            <strong style={{ color: '#0F172A' }}>For Training Providers 🎓</strong>
                            <p style={{ marginTop: '4px', fontSize: '10px', color: '#64748B' }}>Index your custom courses within our Learning Resources flow.</p>
                        </div>
                        <div style={{ padding: '12px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)' }}>
                            <strong style={{ color: '#0F172A' }}>For Recruiters 🔍</strong>
                            <p style={{ marginTop: '4px', fontSize: '10px', color: '#64748B' }}>Discover verified talent using actual portfolio metrics.</p>
                        </div>
                    </div>

                    {partnerSubmitted ? (
                        <div style={{ padding: '16px', backgroundColor: '#ECFDF5', border: '1px solid #16A34A', color: '#15803D', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle size={16} /> Partner request recorded. Our Institutional Relations team will contact you.
                        </div>
                    ) : (
                        <form onSubmit={handlePartnerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <input 
                                    type="text" 
                                    placeholder="Organization Name" 
                                    required
                                    style={{ padding: '10px 14px', fontSize: '12px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', color: '#0F172A', outline: 'none' }}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Contact Person" 
                                    required
                                    style={{ padding: '10px 14px', fontSize: '12px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', color: '#0F172A', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <input 
                                    type="email" 
                                    placeholder="Contact Email" 
                                    required
                                    style={{ padding: '10px 14px', fontSize: '12px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', color: '#0F172A', outline: 'none' }}
                                />
                                <select 
                                    required
                                    style={{ padding: '10px 14px', fontSize: '12px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', color: '#0F172A', outline: 'none' }}
                                >
                                    <option value="">Organization Type</option>
                                    <option value="Company">Company</option>
                                    <option value="College">College / University</option>
                                    <option value="Recruitment Agency">Recruitment Agency</option>
                                    <option value="Training Center">Training Center</option>
                                </select>
                            </div>
                            <textarea 
                                placeholder="Tell us about your organization and collaboration request..." 
                                required
                                rows={2}
                                style={{ padding: '10px 14px', fontSize: '12px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', color: '#0F172A', outline: 'none', resize: 'none' }}
                            />
                            <button 
                                type="submit" 
                                className="btn-primary" 
                                style={{ 
                                    alignSelf: 'flex-start', 
                                    padding: '10px 20px', 
                                    fontSize: '12px', 
                                    borderRadius: '8px', 
                                    border: 'none', 
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s' 
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                Submit Partnership Request
                            </button>
                        </form>
                    )}
                </div>

            </div>

            {/* Copyright / Footer metadata */}
            <div style={{ 
                borderTop: '1px solid #E2E8F0', 
                paddingTop: '20px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: '12px',
                color: '#64748B'
            }}>
                <span>© 2026 PathPilot AI — Personalized Career & Learning Assistant. All Rights Reserved.</span>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <a href="#" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#1D4ED8'} onMouseLeave={(e) => e.target.style.color = '#2563EB'}>Privacy Policy</a>
                    <span style={{ color: '#CBD5E1' }}>|</span>
                    <a href="#" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#1D4ED8'} onMouseLeave={(e) => e.target.style.color = '#2563EB'}>Terms of Service</a>
                </div>
            </div>

        </div>
    );
}
