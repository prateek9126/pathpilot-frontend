import React, { useState, useEffect } from 'react';
import { Bot, Send } from 'lucide-react';
import { api } from '../api';

export default function Chatbot({ profile }) {
    const [chatQuery, setChatQuery] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);

    useEffect(() => {
        // Initialize with welcome message
        setChatMessages([
            { sender: 'assistant', text: `Hi! I am your **AI Career Advisor**. I have analyzed your target goal and your current skills. I can help you compare career paths, understand skill gaps, and decide what you should learn next.` }
        ]);
    }, [profile]);

    const handleAdvisorChat = async (presetQuery = null) => {
        const query = presetQuery || chatQuery;
        if (!query.trim()) return;

        const newMsg = { sender: 'user', text: query };
        setChatMessages(prev => [...prev, newMsg]);
        setChatQuery("");
        setChatLoading(true);

        try {
            const res = await api.sendCareerAdvisorMessage(query);
            setChatMessages(prev => [...prev, { sender: 'assistant', text: res.reply }]);
        } catch (err) {
            setChatMessages(prev => [...prev, { sender: 'assistant', text: "Unable to reach the AI Career Advisor. Please check if your backend server is running." }]);
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div style={{ padding: '0', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div>
                <h1 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '8px' }}>
                    🤖 AI Career Advisor
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Personalized Career Consultant
                </p>
            </div>

            {/* Chat Container */}
            <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', height: '550px', padding: '0', overflow: 'hidden' }}>
                
                {/* Chat Header */}
                <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-secondary)' }}>
                    <Bot size={18} color="var(--primary)" />
                    <div>
                        <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-primary)' }}>🤖 AI Career Advisor</strong>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Active Session</span>
                    </div>
                </div>

                {/* Chat Messages */}
                <div style={{ flex: '1', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {chatMessages.map((msg, idx) => (
                        <div 
                            key={idx}
                            style={{ 
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'var(--bg-secondary)',
                                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                                padding: '12px 16px',
                                borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                                maxWidth: '85%',
                                fontSize: '13px',
                                lineHeight: '1.5',
                                whiteSpace: 'pre-wrap',
                                color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)'
                            }}
                        >
                            {msg.text}
                        </div>
                    ))}
                    {chatLoading && (
                        <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '12px 14px', borderRadius: '12px 12px 12px 0', display: 'flex', gap: '4px' }}>
                            <span style={{ width: '5px', height: '5px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1s infinite' }}></span>
                            <span style={{ width: '5px', height: '5px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }}></span>
                            <span style={{ width: '5px', height: '5px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }}></span>
                        </div>
                    )}
                </div>

                {/* Suggestion Quick Chips */}
                <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', overflowX: 'auto', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                    <button 
                        onClick={() => handleAdvisorChat("Should I continue my current path or explore Data Science?")}
                        style={{ padding: '8px 14px', fontSize: '11px', borderRadius: '20px', border: '1px solid var(--border-color)', backgroundColor: '#FFFFFF', color: 'var(--text-primary)', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                    >
                        🤔 Stay or Switch?
                    </button>
                    <button 
                        onClick={() => handleAdvisorChat("Which career requires the least additional learning?")}
                        style={{ padding: '8px 14px', fontSize: '11px', borderRadius: '20px', border: '1px solid var(--border-color)', backgroundColor: '#FFFFFF', color: 'var(--text-primary)', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                    >
                        🔗 Easiest transition
                    </button>
                    <button 
                        onClick={() => handleAdvisorChat("What should I learn to become an AI Engineer?")}
                        style={{ padding: '8px 14px', fontSize: '11px', borderRadius: '20px', border: '1px solid var(--border-color)', backgroundColor: '#FFFFFF', color: 'var(--text-primary)', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                    >
                        🤖 Become an AI Engineer
                    </button>
                </div>

                {/* Chat Form Input */}
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleAdvisorChat(); }}
                    style={{ display: 'flex', borderTop: '1px solid var(--border-color)', padding: '16px', gap: '10px', backgroundColor: '#FFFFFF' }}
                >
                    <input 
                        type="text"
                        value={chatQuery}
                        onChange={(e) => setChatQuery(e.target.value)}
                        placeholder="Ask a career transition question..."
                        style={{ flex: '1', padding: '10px 14px', fontSize: '13px', backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                    />
                    <button type="submit" className="btn-primary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Send size={16} />
                    </button>
                </form>

            </div>
        </div>
    );
}
