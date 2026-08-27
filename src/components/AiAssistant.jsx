import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';
import { api } from '../api';

export default function AiAssistant({ profile }) {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const chatEndRef = useRef(null);

    const quickQuestions = [
        "Why do I need to learn networking?",
        "Can I skip this course?",
        "Explain TCP/IP in simple words.",
        "What should I learn next?",
        "I only have 30 minutes today. What should I do?"
    ];

    useEffect(() => {
        fetchChatHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchChatHistory = async () => {
        setLoadingHistory(true);
        try {
            const data = await api.getChatMessages();
            if (data && data.length > 0) {
                setMessages(data);
            } else {
                setMessages([
                    { sender: 'assistant', text: `Hello ${profile.name}! I am your PathPilot AI Mentor. Ask me any conceptual questions, why a module is recommended, or what micro-tasks you should execute today based on your available study time.`, timestamp: Date.now() }
                ]);
            }
        } catch (err) {
            setMessages([
                { sender: 'assistant', text: "Failed to fetch chat history. Working with active session chat.", timestamp: Date.now() }
            ]);
        } finally {
            setLoadingHistory(false);
        }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (text) => {
        if (!text.trim() || loading) return;

        const userMsgText = text;
        setInputText("");
        setMessages(prev => [...prev, { sender: 'user', text: userMsgText, timestamp: Date.now() }]);
        setLoading(true);

        try {
            const aiMsg = await api.sendChatMessage(userMsgText);
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            setMessages(prev => [...prev, { sender: 'assistant', text: "Error: AI Mentor backend is unreachable. Make sure the Spring Boot service is running.", timestamp: Date.now() }]);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSendMessage(inputText);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', padding: '32px', height: 'calc(100vh - 70px)', overflow: 'hidden' }}>
            
            {/* Quick Prompts Panel */}
            <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <Sparkles size={16} color="var(--primary)" /> Suggested Queries
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.4' }}>
                    Ask questions tailored directly to your current goals and skill gap ratings:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {quickQuestions.map((q, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSendMessage(q)}
                            className="btn-secondary"
                            style={{ 
                                textAlign: 'left', 
                                padding: '10px 14px', 
                                fontSize: '12px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                justifyContent: 'flex-start',
                                height: 'auto',
                                width: '100%',
                                whiteSpace: 'normal',
                                lineHeight: '1.4'
                            }}
                        >
                            <MessageSquare size={14} style={{ flexShrink: 0 }} />
                            <span>{q}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat conversation area */}
            <div className="chat-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                
                {/* Chat header info */}
                <div className="chat-header">
                    <Bot size={20} color="var(--primary)" />
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '14px' }}>AI Mentor Bot</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Target career: {profile.targetGoal}</div>
                    </div>
                </div>

                {/* Messages list */}
                <div className="chat-messages" style={{ flex: '1', overflowY: 'auto', padding: '24px' }}>
                    {loadingHistory ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', gap: '12px' }}>
                            <RefreshCw size={20} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                            <span style={{ fontSize: '13px' }}>Loading chat logs...</span>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isAssistant = msg.sender === 'assistant';
                            return (
                                <div 
                                    key={index} 
                                    style={{ 
                                        display: 'flex', 
                                        justifyContent: isAssistant ? 'flex-start' : 'flex-end',
                                        marginBottom: '16px'
                                    }}
                                >
                                    <div 
                                        style={{ 
                                            display: 'flex', 
                                            flexDirection: isAssistant ? 'row' : 'row-reverse', 
                                            alignItems: 'flex-start', 
                                            gap: '12px', 
                                            maxWidth: '75%' 
                                        }}
                                    >
                                        <div style={{ 
                                            width: '32px', 
                                            height: '32px', 
                                            borderRadius: '50%', 
                                            backgroundColor: isAssistant ? 'rgba(99,102,241,0.1)' : 'var(--primary-hover)', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            {isAssistant ? <Bot size={16} color="var(--primary)" /> : <User size={16} color="#fff" />}
                                        </div>
                                        <div className={`chat-bubble ${msg.sender}`} style={{ margin: '0' }}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Bot size={16} color="var(--primary)" />
                                </div>
                                <div className="chat-bubble assistant" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                    Thinking...
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input text box */}
                <form onSubmit={handleFormSubmit} className="chat-input-area" style={{ padding: '16px 24px' }}>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your message to your AI Mentor here..."
                        className="chat-input"
                    />
                    <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '12px 20px', borderRadius: 'var(--border-radius-sm)', justifyContent: 'center' }}>
                        Send <Send size={14} />
                    </button>
                </form>

            </div>

        </div>
    );
}
