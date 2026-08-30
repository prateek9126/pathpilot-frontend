import React, { useState, useEffect } from 'react';
import { BookOpen, CheckSquare, ExternalLink, PenTool, CheckCircle, HelpCircle, FileText, ArrowLeft, RefreshCw } from 'lucide-react';
import { api } from '../api';

export default function Workspace({ activeModuleId, onBackToRoadmap, onUpdateProfileState }) {
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Checked objectives
    const [checkedObjectives, setCheckedObjectives] = useState({});
    
    // Notes state
    const [notes, setNotes] = useState("");
    
    // Assessment answers
    const [quizAnswers, setQuizAnswers] = useState({});
    const [assessmentResult, setAssessmentResult] = useState(null);
    const [submittingQuiz, setSubmittingQuiz] = useState(false);

    // Feedback state
    const [feedbackDifficulty, setFeedbackDifficulty] = useState("Just Right");
    const [feedbackStruggles, setFeedbackStruggles] = useState("");
    const [feedbackResult, setFeedbackResult] = useState("");
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    useEffect(() => {
        fetchModuleDetails();
    }, [activeModuleId]);

    const fetchModuleDetails = async () => {
        setLoading(true);
        setError("");
        setAssessmentResult(null);
        setFeedbackResult("");
        try {
            const data = await api.getModule(activeModuleId);
            setModule(data);
            
            // Set initial notes if any
            setNotes(localStorage.getItem(`notes_${activeModuleId}`) || "");
            
            // Pre-fill quiz answers if they already took it
            if (data.score !== null) {
                setAssessmentResult({
                    score: data.score,
                    status: data.assessmentStatus,
                    message: data.assessmentStatus === 'Needs_Revision' 
                        ? `Previous attempt: ${data.score}% (Needs Revision)`
                        : `Passed with score: ${data.score}%`
                });
            }
        } catch (err) {
            setError("Failed to load module workspace details.");
        } finally {
            setLoading(false);
        }
    };

    const handleObjectiveToggle = (idx) => {
        setCheckedObjectives(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    const handleSaveNotes = (val) => {
        setNotes(val);
        localStorage.setItem(`notes_${activeModuleId}`, val);
    };

    const handleQuizOptionSelect = (qId, optionIdx) => {
        setQuizAnswers(prev => ({
            ...prev,
            [qId]: String(optionIdx)
        }));
    };

    const handleQuizTextChange = (qId, text) => {
        setQuizAnswers(prev => ({
            ...prev,
            [qId]: text
        }));
    };

    const handleQuizSubmit = async (e) => {
        e.preventDefault();
        setSubmittingQuiz(true);
        setError("");
        
        // Convert answers map to in-order list
        const answersList = module.assessmentQuestions.map((q) => {
            return quizAnswers[q.id] || "";
        });

        try {
            const res = await api.submitAssessment(activeModuleId, answersList);
            setAssessmentResult({
                score: res.score,
                status: res.status,
                message: res.message
            });
            // Update parent app states
            onUpdateProfileState(res.profile, res.roadmap);
            
            // Reload module to show completed status or updated fields
            const updatedModule = await api.getModule(activeModuleId);
            setModule(updatedModule);
        } catch (err) {
            setError("Failed to submit assessment.");
        } finally {
            setSubmittingQuiz(false);
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setSubmittingFeedback(true);
        setFeedbackResult("");
        try {
            const res = await api.submitFeedback(activeModuleId, feedbackDifficulty, feedbackStruggles);
            setFeedbackResult(res.message);
            onUpdateProfileState(res.profile, res.roadmap);
        } catch (err) {
            setError("Failed to submit feedback.");
        } finally {
            setSubmittingFeedback(false);
        }
    };

    const handleDurationClick = () => {
        if (module && module.recommendedResources) {
            const videoRes = module.recommendedResources.find(r => r.type === 'Video' || r.provider?.toLowerCase() === 'youtube');
            if (videoRes && videoRes.url && videoRes.url !== "https://www.youtube.com" && videoRes.url !== "https://youtube.com") {
                window.open(videoRes.url, '_blank');
                return;
            }
        }
        
        // Match specific high-quality direct YouTube video URLs for topics
        const topic = (module ? module.topic : "").toLowerCase();
        let targetUrl = "";
        
        if (topic.includes("sql") || topic.includes("database")) {
            targetUrl = "https://youtu.be/HXV3zeQKqGY"; // SQL Tutorial for Beginners
        } else if (topic.includes("networking") || topic.includes("tcp")) {
            targetUrl = "https://youtu.be/VwfrQy3kGw8"; // Neso Academy Networking Course
        } else if (topic.includes("java") && !topic.includes("javascript")) {
            targetUrl = "https://youtu.be/A74TOX803X0"; // FreeCodeCamp Java Course
        } else if (topic.includes("oop") || topic.includes("object oriented")) {
            targetUrl = "https://youtu.be/SiBw7skDz94"; // Kunal Kushwaha OOP
        } else if (topic.includes("spring boot") || topic.includes("hibernate") || topic.includes("jpa")) {
            targetUrl = "https://youtu.be/35EQXmHKZYs"; // Spring Boot Course
        } else if (topic.includes("security") || topic.includes("siem") || topic.includes("incident") || topic.includes("soc")) {
            targetUrl = "https://youtu.be/O1fJ9mR9r00"; // Cybersecurity Course
        } else if (topic.includes("linux")) {
            targetUrl = "https://youtu.be/sWbUDq4S6Yw"; // Linux Course
        } else if (topic.includes("react")) {
            targetUrl = "https://youtu.be/Ke90Tje7VS0"; // React Course
        } else if (topic.includes("html") || topic.includes("css") || topic.includes("javascript") || topic.includes("web dev") || topic.includes("frontend")) {
            targetUrl = "https://youtu.be/mU6anWqOD4c"; // Web Dev Course
        } else if (topic.includes("python")) {
            targetUrl = "https://youtu.be/_uQrJ0TkZlc"; // Python Course
        } else if (topic.includes("machine learning") || topic.includes("neural") || topic.includes("deep learning") || topic.includes("nlp") || topic.includes("ai")) {
            targetUrl = "https://youtu.be/GwIo3gToViM"; // Machine Learning Course
        } else {
            targetUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent((module ? module.topic : "") + " tutorial")}`;
        }
        
        window.open(targetUrl, '_blank');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
                <RefreshCw size={32} className="spin" style={{ color: 'var(--primary)', animation: 'spin 1.5s linear infinite' }} />
                <div>Loading your AI Mentor workspace...</div>
            </div>
        );
    }

    if (error && !module) {
        return (
            <div style={{ padding: '32px' }}>
                <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: '#fca5a5', borderRadius: '8px' }}>
                    {error}
                </div>
                <button className="btn-secondary" onClick={onBackToRoadmap} style={{ marginTop: '16px' }}>
                    <ArrowLeft size={14} /> Back to Roadmap
                </button>
            </div>
        );
    }

    const isModuleCompleted = module.status === 'Completed';

    return (
        <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Top Back bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button className="btn-secondary" onClick={onBackToRoadmap} style={{ padding: '8px 12px', fontSize: '13px' }}>
                    <ArrowLeft size={14} /> Back to Roadmap
                </button>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Active Topic / {module.topic}
                </div>
            </div>

            {/* Title / Description */}
            <div className="card-premium" style={{ background: 'linear-gradient(135deg, rgba(22, 33, 54, 0.8), rgba(99, 102, 241, 0.03))' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <span 
                        className="badge-item" 
                        onClick={handleDurationClick}
                        title="Click to watch YouTube tutorial video"
                        style={{ 
                            backgroundColor: 'rgba(99,102,241,0.2)', 
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            userSelect: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.35)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.2)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        ⏱️ {module.estimatedDuration}
                    </span>
                    <span className="badge-item" style={{ backgroundColor: isModuleCompleted ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: isModuleCompleted ? '#6ee7b7' : '#fbd38d', border: 'none' }}>
                        {isModuleCompleted ? '✓ Completed' : 'In Progress'}
                    </span>
                </div>
                <h1 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '12px' }}>
                    {module.topic}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>
                    {module.description}
                </p>
                <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }}>
                    🎯 Why Recommended: "{module.whyRecommended}"
                </div>
            </div>

            {/* Two-column layout: Objectives vs Resources */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px' }}>
                
                {/* Objectives Checklist */}
                <div className="card-premium">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <CheckSquare size={18} color="var(--primary)" />
                        <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Learning Objectives</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {module.objectives && module.objectives.map((obj, idx) => (
                            <label key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '13px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={!!checkedObjectives[idx]}
                                    onChange={() => handleObjectiveToggle(idx)}
                                    style={{ marginTop: '3px', accentColor: 'var(--primary)' }}
                                />
                                <span style={{ color: checkedObjectives[idx] ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: checkedObjectives[idx] ? 'line-through' : 'none' }}>
                                    {obj}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Recommended Resources */}
                <div className="card-premium">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <BookOpen size={18} color="var(--primary)" />
                        <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Recommended Resources</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {module.recommendedResources && module.recommendedResources.map((res) => (
                            <a
                                key={res.id}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="nav-item"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', textDecoration: 'none', backgroundColor: 'rgba(0,0,0,0.15)' }}
                            >
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>{res.title}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                        {res.type} • {res.provider} • {res.duration}
                                    </div>
                                </div>
                                <ExternalLink size={14} color="var(--text-secondary)" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Practice Task & Notes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="card-premium">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <PenTool size={18} color="var(--primary)" />
                        <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Practice Task</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5', marginBottom: '16px' }}>
                        Apply your knowledge with this hands-on exercise:
                    </p>
                    <div style={{ padding: '16px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '13px', borderLeft: '4px solid var(--accent)' }}>
                        <strong>Action Item:</strong> {module.practiceTask}
                    </div>
                </div>

                {/* Workspace Notes */}
                <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <FileText size={18} color="var(--primary)" />
                        <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Your Study Notes</h3>
                    </div>
                    <textarea
                        value={notes}
                        onChange={(e) => handleSaveNotes(e.target.value)}
                        placeholder="Write down notes, code snippets, or logs here. Notes are saved automatically to local cache..."
                        style={{ width: '100%', flex: '1', height: '100px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', padding: '12px', fontSize: '13px', outline: 'none', resize: 'none' }}
                    />
                </div>
            </div>

            {/* Quiz Assessment Section */}
            {module.assessmentQuestions && module.assessmentQuestions.length > 0 && (
                <div className="card-premium" style={{ borderColor: 'rgba(99,102,241,0.3)', background: 'linear-gradient(180deg, var(--bg-card), rgba(99,102,241,0.01))' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <HelpCircle size={20} color="var(--primary)" />
                        <h3 style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Outfit' }}>Module Assessment</h3>
                    </div>

                    {/* Result alert */}
                    {assessmentResult && (
                        <div style={{ 
                            padding: '16px', 
                            backgroundColor: assessmentResult.status === 'Needs_Revision' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                            border: `1px solid ${assessmentResult.status === 'Needs_Revision' ? 'var(--danger)' : 'var(--accent)'}`,
                            color: assessmentResult.status === 'Needs_Revision' ? '#fca5a5' : '#6ee7b7',
                            borderRadius: '8px', 
                            marginBottom: '24px', 
                            fontSize: '14px' 
                        }}>
                            <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>
                                {assessmentResult.status === 'Needs_Revision' ? '⚠️ Revision Required' : '🎉 Assessment Passed!'}
                            </div>
                            <div>{assessmentResult.message}</div>
                        </div>
                    )}

                    {/* Render questions if not completed, or show retake option if revision required */}
                    {(!isModuleCompleted || (assessmentResult && assessmentResult.status === 'Needs_Revision')) ? (
                        <form onSubmit={handleQuizSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {module.assessmentQuestions.map((q, qIdx) => (
                                <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>
                                        {qIdx + 1}. {q.questionText}
                                    </div>
                                    
                                    {q.type === 'MCQ' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '12px' }}>
                                            {q.options.map((option, oIdx) => (
                                                <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                                                    <input
                                                        type="radio"
                                                        name={q.id}
                                                        checked={quizAnswers[q.id] === String(oIdx)}
                                                        onChange={() => handleQuizOptionSelect(q.id, oIdx)}
                                                        style={{ accentColor: 'var(--primary)' }}
                                                    />
                                                    <span>{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <textarea
                                            placeholder="Write your scenario analysis or answer here..."
                                            value={quizAnswers[q.id] || ""}
                                            onChange={(e) => handleQuizTextChange(q.id, e.target.value)}
                                            style={{ width: '100%', height: '80px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', padding: '10px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                                        />
                                    )}
                                </div>
                            ))}

                            <button type="submit" className="btn-primary" disabled={submittingQuiz} style={{ alignSelf: 'flex-start' }}>
                                {submittingQuiz ? "Grading..." : "Submit Answers"}
                            </button>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
                            <CheckCircle size={40} color="var(--accent)" style={{ marginBottom: '12px' }} />
                            <div style={{ fontSize: '14px' }}>You have already mastered this assessment with a passing grade.</div>
                        </div>
                    )}
                </div>
            )}

            {/* Feedback Loops (Ask after completing/passing module) */}
            {isModuleCompleted && (
                <div className="card-premium" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <CheckCircle size={20} color="var(--accent)" />
                        <h3 style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Outfit' }}>Feedback & Difficulty Rating</h3>
                    </div>
                    
                    {feedbackResult && (
                        <div className="feedback-notification">
                            <Sparkles size={16} style={{ marginTop: '2px' }} />
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '2px' }}>Roadmap Adapted!</div>
                                <div style={{ fontSize: '13px' }}>{feedbackResult}</div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                                How did you find this topic? (This adjusts the speed and material level of subsequent modules)
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {["Too Easy", "Easy", "Just Right", "Difficult", "Very Difficult"].map((diff) => (
                                    <button
                                        key={diff}
                                        type="button"
                                        className={feedbackDifficulty === diff ? "btn-primary" : "btn-secondary"}
                                        onClick={() => setFeedbackDifficulty(diff)}
                                        style={{ padding: '8px 14px', fontSize: '12px' }}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                                Tell us what you struggled with (Optional):
                            </label>
                            <textarea
                                value={feedbackStruggles}
                                onChange={(e) => setFeedbackStruggles(e.target.value)}
                                placeholder="E.g., I struggled with TCP handshakes, or I want more practical examples of logs..."
                                style={{ width: '100%', height: '80px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', padding: '10px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={submittingFeedback} style={{ alignSelf: 'flex-start' }}>
                            {submittingFeedback ? "Updating Path..." : "Submit Feedback"}
                        </button>
                    </form>
                </div>
            )}

        </div>
    );
}
