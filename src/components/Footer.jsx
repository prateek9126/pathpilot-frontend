import React, { useState } from 'react';
import { Star, MessageSquare, Briefcase, CheckCircle, ArrowLeft } from 'lucide-react';

export default function Footer() {
    const [rating, setRating] = useState(5);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [partnerSubmitted, setPartnerSubmitted] = useState(false);
    const [activeForm, setActiveForm] = useState(null); // null, 'feedback', 'partner'

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
            
            {/* Grid structure: Left Options / Form, Right Student Learning Image */}
            <div className="footer-redesign-grid">
                
                {/* LEFT COLUMN: COLLABORATION OPTIONS OR EXPANDED FORM */}
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                    {activeForm === null ? (
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', width: '100%' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '750', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Community & Collaboration</span>
                                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginTop: '4px', marginBottom: '8px', fontFamily: "'Outfit', sans-serif" }}>Shape the Future of Learning</h3>
                                <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: '1.6', margin: 0, maxWidth: '480px' }}>
                                    Help us optimize personalized career paths by sharing your feedback, or partner with us to integrate PathPilot AI into your institution.
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                                {/* Button 1: Feedback */}
                                <div 
                                    onClick={() => setActiveForm('feedback')}
                                    style={{
                                        backgroundColor: '#2563EB',
                                        border: '1px solid #1D4ED8',
                                        borderRadius: '12px',
                                        padding: '16px 20px',
                                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    className="collab-option-card-blue"
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.backgroundColor = '#1D4ED8';
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.backgroundColor = '#2563EB';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.1)';
                                    }}
                                >
                                    <div style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                        borderRadius: '8px',
                                        padding: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <MessageSquare size={18} color="#FFFFFF" />
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Feedback</h4>
                                        <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.8)', margin: '2px 0 0 0' }}>Help us improve PathPilot AI</p>
                                    </div>
                                </div>

                                {/* Button 2: Partner With Us */}
                                <div 
                                    onClick={() => setActiveForm('partner')}
                                    style={{
                                        backgroundColor: '#2563EB',
                                        border: '1px solid #1D4ED8',
                                        borderRadius: '12px',
                                        padding: '16px 20px',
                                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    className="collab-option-card-blue"
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.backgroundColor = '#1D4ED8';
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.backgroundColor = '#2563EB';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.1)';
                                    }}
                                >
                                    <div style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                        borderRadius: '8px',
                                        padding: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Briefcase size={18} color="#FFFFFF" />
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Partner With Us</h4>
                                        <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.8)', margin: '2px 0 0 0' }}>Collaborate with PathPilot AI</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeForm === 'feedback' ? (
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '20px',
                            padding: '24px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                            textAlign: 'left'
                        }}>
                            <button 
                                onClick={() => setActiveForm(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#2563EB',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: 0,
                                    width: 'fit-content'
                                }}
                            >
                                <ArrowLeft size={16} /> Back to options
                            </button>
                            
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A', margin: 0 }}>
                                    <MessageSquare size={20} color="#2563EB" /> Help Us Improve PathPilot AI
                                </h3>
                                <p style={{ color: '#64748B', fontSize: '12px', marginTop: '6px', marginBottom: 0 }}>
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
                    ) : (
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '20px',
                            padding: '24px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                            textAlign: 'left'
                        }}>
                            <button 
                                onClick={() => setActiveForm(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#2563EB',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: 0,
                                    width: 'fit-content'
                                }}
                            >
                                <ArrowLeft size={16} /> Back to options
                            </button>
                            
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A', margin: 0 }}>
                                    <Briefcase size={20} color="#2563EB" /> Partner With PathPilot AI
                                </h3>
                                <p style={{ color: '#64748B', fontSize: '12px', marginTop: '6px', marginBottom: 0 }}>
                                    Tailored modules for enterprise recruitment channels, training academies, and colleges.
                                </p>
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
                                        rows={3}
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
                    )}
                </div>

                {/* RIGHT COLUMN: EDUCATIONAL GRAPHIC & SLOGAN */}
                <div style={{ 
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    height: '100%'
                }}>
                    <img 
                        src="/education_career_hero.jpg" 
                        alt="Student Learning" 
                        style={{ 
                            width: '100%', 
                            height: '240px', 
                            objectFit: 'cover', 
                            borderRadius: '12px', 
                            border: '1px solid #F1F5F9',
                            marginBottom: '20px'
                        }} 
                    />
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '8px', fontFamily: "'Outfit', sans-serif" }}>
                        Learn. Grow. Build Your Path.
                    </h3>
                    <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: '1.6', maxWidth: '440px', margin: 0 }}>
                        PathPilot AI helps learners discover skills, build personalized learning paths, and move confidently toward their career goals.
                    </p>
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
