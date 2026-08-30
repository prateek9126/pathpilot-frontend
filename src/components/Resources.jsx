import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Star, Clock, Tag, ExternalLink, PlusCircle, Check, Award, Video, Play, Compass, ChevronRight, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../api';

export default function Resources({ profile, roadmap, onNavigateToModule }) {
    // Recommendation settings states
    const [budgetPreset, setBudgetPreset] = useState("0"); // "0", "500", "2000", "custom"
    const [maxBudget, setMaxBudget] = useState(0);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");
    const [sortBy, setSortBy] = useState("Relevance");
    const [skillFilter, setSkillFilter] = useState("All");
    const [difficultyFilter, setDifficultyFilter] = useState("All");
    const [platformFilter, setPlatformFilter] = useState("All");

    // Dynamic messaging
    const [budgetUnlockedMsg, setBudgetUnlockedMsg] = useState(false);

    // Backend recommendations results
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Tracking added resources to roadmap
    const [addedRoadmapIds, setAddedRoadmapIds] = useState({});

    // Dynamic dropdown filter lists
    const [availableSkills, setAvailableSkills] = useState([]);
    const [availablePlatforms, setAvailablePlatforms] = useState([]);

    // Update max budget based on preset selections
    useEffect(() => {
        if (budgetPreset === "0") {
            setMaxBudget(0);
            setBudgetUnlockedMsg(false);
        } else if (budgetPreset === "500") {
            setMaxBudget(500);
            setBudgetUnlockedMsg(true);
        } else if (budgetPreset === "2000") {
            setMaxBudget(2000);
            setBudgetUnlockedMsg(true);
        } else if (budgetPreset === "premium") {
            setMaxBudget(100000);
            setBudgetUnlockedMsg(true);
        }
    }, [budgetPreset]);

    // Fetch recommendations from API when filters change
    useEffect(() => {
        fetchRecommendations();
    }, [maxBudget, typeFilter, search, sortBy, skillFilter, difficultyFilter, platformFilter]);

    const fetchRecommendations = async () => {
        setLoading(true);
        setError("");
        try {
            const params = {
                maxBudget,
                type: typeFilter,
                search,
                sortBy,
                skill: skillFilter,
                difficulty: difficultyFilter,
                platform: platformFilter
            };
            const data = await api.getRecommendations(params);
            setResources(data);

            // Populate skills and platforms for filter dropdowns if not populated yet
            if (availableSkills.length === 0 && data.length > 0) {
                const skillsSet = new Set(data.map(r => r.skill));
                const platformsSet = new Set(data.map(r => r.platform));
                setAvailableSkills(["All", ...Array.from(skillsSet)]);
                setAvailablePlatforms(["All", ...Array.from(platformsSet)]);
            }
        } catch (err) {
            setError("Failed to fetch recommended resources from server.");
        } finally {
            setLoading(false);
        }
    };

    const handleCustomBudgetChange = (e) => {
        const val = e.target.value;
        const num = val === "" ? 0 : Math.max(0, parseInt(val));
        setMaxBudget(num);
        setBudgetPreset("custom");
        if (num > 0) {
            setBudgetUnlockedMsg(true);
        } else {
            setBudgetUnlockedMsg(false);
        }
    };

    const handleSliderChange = (e) => {
        const val = parseInt(e.target.value);
        setMaxBudget(val);
        setBudgetPreset("custom");
        if (val > 0) {
            setBudgetUnlockedMsg(true);
        } else {
            setBudgetUnlockedMsg(false);
        }
    };

    const handleAddToRoadmap = (resId, topic) => {
        setAddedRoadmapIds(prev => ({
            ...prev,
            [resId]: true
        }));
        // Show simulated action
        alert(`Successfully added resource to your active '${topic}' roadmap milestone! The AI Mentor will prioritize this material in your next study recommendation.`);
    };

    // Filtered resources based on budget preset exclusivity:
    let filteredResources = resources;
    if (budgetPreset === "0") {
        // Free selected: show ONLY free resources (isFree === true or free === true or price === 0)
        filteredResources = resources.filter(r => r.isFree || r.free || r.price === 0);
    } else if (budgetPreset === "500" || budgetPreset === "2000" || budgetPreset === "premium") {
        // Paid selected: show ONLY paid resources that are within the budget
        filteredResources = resources.filter(r => !(r.isFree || r.free || r.price === 0) && r.price <= maxBudget);
    } else {
        // Custom: apply budget limit
        filteredResources = resources.filter(r => r.price <= maxBudget);
    }

    // Split resources into Sections
    // 1. Recommended (Top relevance, limit 3)
    const recommendedForYou = filteredResources.slice(0, 3);
    
    // 2. Free Resources
    const freeResources = filteredResources.filter(r => r.isFree || r.free || r.price === 0);

    // 3. Paid Resources (Price > 0 and <= maxBudget)
    const paidResources = filteredResources.filter(r => !(r.isFree || r.free || r.price === 0));

    // Resource types filter list
    const resourceTypes = [
        "All", 
        "YouTube Videos", 
        "YouTube Playlists", 
        "Online Courses", 
        "Interactive Coding Courses", 
        "Documentation", 
        "Practice/Assessment", 
        "Certification Courses"
    ];

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'Beginner': return '#6ee7b7';
            case 'Intermediate': return '#fbd38d';
            case 'Advanced': return '#fca5a5';
            default: return 'var(--text-secondary)';
        }
    };

    return (
        <div style={{ padding: '0 32px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Header section */}
            <div>
                <h1 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '8px' }}>
                    🎥 Recommended Learning Resources
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                    Choose your budget and discover the best courses, videos, and articles recommended by the AI to address your gaps.
                </p>
            </div>

            {/* Controls Bar: Budget + Search Filters */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                
                {/* Budget Selection Panel */}
                <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', fontFamily: 'Outfit' }}>💰 Set Maximum Budget</h3>
                        {budgetUnlockedMsg && (
                            <span style={{ fontSize: '11px', color: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', animation: 'slideIn 0.3s ease' }}>
                                ✨ More options unlocked
                            </span>
                        )}
                    </div>

                    {/* Radio Grid Presets */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        <button 
                            type="button"
                            className={budgetPreset === "0" ? "btn-primary" : "btn-secondary"}
                            onClick={() => setBudgetPreset("0")}
                            style={{ padding: '10px 8px', fontSize: '12px', justifyContent: 'center' }}
                        >
                            Free (₹0)
                        </button>
                        <button 
                            type="button"
                            className={budgetPreset === "500" ? "btn-primary" : "btn-secondary"}
                            onClick={() => setBudgetPreset("500")}
                            style={{ padding: '10px 8px', fontSize: '12px', justifyContent: 'center' }}
                        >
                            Low (₹500)
                        </button>
                        <button 
                            type="button"
                            className={budgetPreset === "2000" ? "btn-primary" : "btn-secondary"}
                            onClick={() => setBudgetPreset("2000")}
                            style={{ padding: '10px 8px', fontSize: '12px', justifyContent: 'center' }}
                        >
                            Medium (₹2k)
                        </button>
                        <button 
                            type="button"
                            className={budgetPreset === "premium" ? "btn-primary" : "btn-secondary"}
                            onClick={() => setBudgetPreset("premium")}
                            style={{ padding: '10px 8px', fontSize: '12px', justifyContent: 'center' }}
                        >
                            Premium+
                        </button>
                    </div>

                    {/* Slider & Custom Budget */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px' }}>
                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <input 
                                type="range" 
                                min="0" 
                                max="5000" 
                                step="100"
                                value={maxBudget > 5000 ? 5000 : maxBudget}
                                onChange={handleSliderChange}
                                style={{ width: '100%', accentColor: 'var(--primary)' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                                <span>₹0</span>
                                <span>₹2,500</span>
                                <span>₹5,000+</span>
                            </div>
                        </div>
                        <div style={{ width: '120px' }}>
                            <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '2px' }}>Custom Max</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '8px', top: '9px', fontSize: '13px', color: 'var(--text-secondary)' }}>₹</span>
                                <input 
                                    type="number"
                                    value={maxBudget === 100000 ? "" : maxBudget}
                                    onChange={handleAddToRoadmap ? handleCustomBudgetChange : undefined}
                                    placeholder="Any"
                                    style={{ width: '100%', padding: '8px 8px 8px 18px', fontSize: '13px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtering controls */}
                <div className="card-premium" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ gridColumn: 'span 2', position: 'relative' }}>
                        <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search keywords, instructors, platforms..."
                            className="search-input-with-icon"
                            style={{ width: '100%', fontSize: '13px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Sort By</label>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '12px' }}
                        >
                            <option value="Relevance">AI Relevance</option>
                            <option value="Rating">User Rating</option>
                            <option value="Price">Price: Low to High</option>
                            <option value="Duration">Duration</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Difficulty</label>
                        <select 
                            value={difficultyFilter} 
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '12px' }}
                        >
                            <option value="All">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                </div>

            </div>

            {/* Horizontal Resource Types Scroll Bar */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', borderBottom: '1px solid var(--border-color)' }}>
                {resourceTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={typeFilter === type ? "btn-primary" : "btn-secondary"}
                        style={{ padding: '6px 14px', fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}
                    >
                        {type === 'All' ? '🌐 All Formats' : type}
                    </button>
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: '#fca5a5', borderRadius: '8px' }}>
                    {error}
                </div>
            )}

            {/* Loading Indicator */}
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '30vh', gap: '12px' }}>
                    <RefreshCw size={24} className="spin" style={{ color: 'var(--primary)', animation: 'spin 1.2s linear infinite' }} />
                    <span style={{ fontSize: '13px' }}>AI recommendation engine processing...</span>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

                    {/* SECTION 1: RECOMMENDED FOR YOU */}
                    {recommendedForYou.length > 0 && (
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ff7a00' }}>
                                <Sparkles size={20} /> 🔥 Recommended For You
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                {recommendedForYou.map((res) => (
                                    <ResourceCard 
                                        key={res.id} 
                                        res={res} 
                                        added={!!addedRoadmapIds[res.id]}
                                        onAdd={() => handleAddToRoadmap(res.id, res.skill)}
                                        getDifficultyColor={getDifficultyColor}
                                        showWhy={true}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION 2: BEST FREE RESOURCES */}
                    {freeResources.length > 0 && (
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)' }}>
                                <Award size={20} /> 🆓 Best Free Resources
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                {freeResources.map((res) => (
                                    <ResourceCard 
                                        key={res.id} 
                                        res={res} 
                                        added={!!addedRoadmapIds[res.id]}
                                        onAdd={() => handleAddToRoadmap(res.id, res.skill)}
                                        getDifficultyColor={getDifficultyColor}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION 3: PREMIUM RECOMMENDATIONS */}
                    {maxBudget > 0 && paidResources.length > 0 && (
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc' }}>
                                <Star size={20} color="#a5b4fc" fill="#a5b4fc" /> ⭐ Premium Recommendations
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                {paidResources.map((res) => (
                                    <ResourceCard 
                                        key={res.id} 
                                        res={res} 
                                        added={!!addedRoadmapIds[res.id]}
                                        onAdd={() => handleAddToRoadmap(res.id, res.skill)}
                                        getDifficultyColor={getDifficultyColor}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {resources.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                            No courses or tutorials match your active budget constraint and type filters. Try widening your budget limit.
                        </div>
                    )}

                </div>
            )}

        </div>
    );
}

// Inner Component: ResourceCard
function ResourceCard({ res, added, onAdd, getDifficultyColor, showWhy = false }) {
    // Generate styled placeholder thumbnail if url is missing
    const hasThumb = res.thumbnail && res.thumbnail.trim().length > 0;

    return (
        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '0', overflow: 'hidden' }}>
            
            {/* Card Top Thumb */}
            <div style={{ position: 'relative' }}>
                {/* Platform Badge */}
                <div style={{ 
                    position: 'absolute', 
                    top: '8px', 
                    left: '8px', 
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '50%', 
                    backgroundColor: res.platform.toLowerCase().includes('youtube') ? '#ef4444' : 
                                     res.platform.toLowerCase().includes('udemy') ? '#a855f7' : 
                                     res.platform.toLowerCase().includes('coursera') ? '#3b82f6' : 'rgba(31, 41, 55, 0.95)', 
                    color: '#ffffff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.15)'
                }} title={res.platform}>
                    {res.platform.toLowerCase().includes('youtube') ? (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="#ffffff">
                            <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.387.508 9.387.508s7.517 0 9.387-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                    ) : res.platform.toLowerCase().includes('udemy') ? (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="#ffffff">
                            <path d="M12 3L6.5 8.5L8.5 10.5L12 7L15.5 10.5L17.5 8.5L12 3Z"/>
                            <path d="M6.5 12V16.5C6.5 19.5 9 22 12 22C15 22 17.5 19.5 17.5 16.5V12H14.5V16.5C14.5 17.9 13.4 19 12 19C10.6 19 9.5 17.9 9.5 16.5V12H6.5Z"/>
                        </svg>
                    ) : res.platform.toLowerCase().includes('coursera') ? (
                        <span style={{ fontSize: '11px', fontWeight: '900', fontFamily: 'Outfit' }}>C</span>
                    ) : (
                        <span style={{ fontSize: '8px', fontWeight: '800' }}>{res.platform.charAt(0).toUpperCase()}</span>
                    )}
                </div>

                {hasThumb ? (
                    <img 
                        src={res.thumbnail} 
                        alt={res.title} 
                        style={{ width: '100%', height: '140px', objectFit: 'cover', borderBottom: '1px solid var(--border-color)', display: 'block' }}
                    />
                ) : (
                    <div style={{ width: '100%', height: '130px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(59, 130, 246, 0.05))', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--primary)' }}>
                        {res.type.includes('Videos') || res.type.includes('Playlists') ? (
                            <Video size={32} />
                        ) : (
                            <Compass size={32} />
                        )}
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
                            {res.platform}
                        </span>
                    </div>
                )}
            </div>

            <div>
                {/* Content Container */}
                <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                            {res.platform}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: (res.isFree || res.free || res.price === 0) ? 'var(--accent)' : '#a5b4fc' }}>
                            {(res.isFree || res.free || res.price === 0) ? 'Free' : `₹${res.price}`}
                        </span>
                    </div>

                    <h3 style={{ fontSize: '14px', fontWeight: '700', lineHeight: '1.4', marginBottom: '6px', color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '40px' }}>
                        {res.title}
                    </h3>

                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                        Instructor: <strong>{res.instructor}</strong>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '54px' }}>
                        {res.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                        <span className="badge-item" style={{ fontSize: '9px', padding: '2px 6px', border: 'none', backgroundColor: 'rgba(99,102,241,0.1)' }}>
                            🏷️ {res.skill}
                        </span>
                        <span className="badge-item" style={{ fontSize: '9px', padding: '2px 6px', border: 'none', color: getDifficultyColor(res.difficulty), backgroundColor: 'rgba(255,255,255,0.02)' }}>
                            {res.difficulty}
                        </span>
                        <span className="badge-item" style={{ fontSize: '9px', padding: '2px 6px', border: 'none', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                            ⏱️ {res.duration}
                        </span>
                    </div>

                    {showWhy && res.whyRecommended && (
                        <div style={{ padding: '8px 10px', backgroundColor: 'rgba(99,102,241,0.03)', borderLeft: '2px solid var(--primary)', borderRadius: '2px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '12px', fontStyle: 'italic' }}>
                            <strong>Why recommended:</strong> "{res.whyRecommended}"
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div style={{ display: 'flex', borderTop: '1px solid var(--border-color)', padding: '12px 16px', gap: '10px', backgroundColor: 'rgba(0,0,0,0.05)' }}>
                <a 
                    href={res.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-secondary" 
                    style={{ flex: '1', padding: '8px 0', fontSize: '11px', justifyContent: 'center', textDecoration: 'none' }}
                >
                    Watch Now <ExternalLink size={10} />
                </a>
                
                <button
                    onClick={onAdd}
                    disabled={added}
                    className={added ? "btn-secondary" : "btn-primary"}
                    style={{ 
                        flex: '1', 
                        padding: '8px 0', 
                        fontSize: '11px', 
                        justifyContent: 'center',
                        backgroundColor: added ? 'rgba(16,185,129,0.1)' : undefined,
                        borderColor: added ? '#10b981' : undefined,
                        color: added ? '#6ee7b7' : undefined
                    }}
                >
                    {added ? (
                        <>Added <Check size={12} /></>
                    ) : (
                        <>Add to Path <PlusCircle size={12} /></>
                    )}
                </button>
            </div>

        </div>
    );
}
