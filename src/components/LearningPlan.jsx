import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, ChevronDown, ChevronUp, BookOpen, Target, Trophy } from 'lucide-react';

export default function LearningPlan({ plan, currentProgress }) {
    const [expandedWeeks, setExpandedWeeks] = useState([1]); // Start with week 1 expanded

    if (!plan) {
        return (
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                textAlign: 'center'
            }}>
                <BookOpen size={48} style={{ color: '#ccc', marginBottom: '1rem' }} />
                <p style={{ color: '#888' }}>No learning plan yet. Complete the assessment to get your personalized plan!</p>
            </div>
        );
    }

    // Parse weekly goals from JSON with error handling
    let weeklyGoals = [];
    let hasValidPlan = false;

    if (plan && plan.weekly_goals && plan.weekly_goals !== null && plan.weekly_goals !== undefined) {
        try {
            weeklyGoals = JSON.parse(plan.weekly_goals);
            // Check if it's a valid array
            if (Array.isArray(weeklyGoals) && weeklyGoals.length > 0) {
                hasValidPlan = true;
            }
        } catch (error) {
            console.warn('Invalid weekly_goals data (will ignore):', error);
            weeklyGoals = [];
        }
    }

    // If no valid plan data, show message
    if (!hasValidPlan || weeklyGoals.length === 0) {
        return (
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                textAlign: 'center'
            }}>
                <BookOpen size={48} style={{ color: '#ccc', marginBottom: '1rem' }} />
                <p style={{ color: '#888' }}>No learning plan yet. Complete the assessment to get your personalized plan!</p>
            </div>
        );
    }

    const toggleWeek = (weekNum) => {
        if (expandedWeeks.includes(weekNum)) {
            setExpandedWeeks(expandedWeeks.filter(w => w !== weekNum));
        } else {
            setExpandedWeeks([...expandedWeeks, weekNum]);
        }
    };

    const getWeekStatus = (weekNum) => {
        const weekStart = (weekNum - 1) * 7;
        const weekEnd = weekNum * 7;
        const weekProgress = currentProgress || 0;

        if (weekProgress >= weekEnd) return 'completed';
        if (weekProgress >= weekStart) return 'current';
        return 'locked';
    };

    // Safely get duration_weeks with fallback
    const durationWeeks = plan.duration_weeks || 6;

    const getWeekStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#00b894';
            case 'current': return '#FF6B6B';
            case 'locked': return '#b2bec3';
            default: return '#b2bec3';
        }
    };

    return (
        <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)'
        }}>
            {/* Plan Header */}
            <div style={{
                marginBottom: '2rem',
                paddingBottom: '1.5rem',
                borderBottom: '2px solid #f0f0f0'
            }}>
                <h2 style={{
                    fontSize: '1.8rem',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Target size={28} style={{ color: 'var(--color-primary)' }} />
                    Your Learning Journey
                </h2>
                <p style={{ color: '#636e72', fontSize: '1.1rem' }}>
                    {durationWeeks} weeks of personalized learning • Focus: {plan.focus_areas || 'General Learning'}
                </p>
            </div>

            {/* Week Progress Overview */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '0.8rem',
                marginBottom: '2rem'
            }}>
                {Array.from({ length: durationWeeks }, (_, i) => i + 1).map((weekNum) => {
                    const status = getWeekStatus(weekNum);
                    return (
                        <div
                            key={weekNum}
                            onClick={() => status !== 'locked' && toggleWeek(weekNum)}
                            style={{
                                padding: '1rem',
                                background: status === 'current' ? '#FFF3E0' : 'white',
                                borderRadius: 'var(--radius-md)',
                                border: `3px solid ${getWeekStatusColor(status)}`,
                                cursor: status !== 'locked' ? 'pointer' : 'not-allowed',
                                textAlign: 'center',
                                transition: 'all 0.3s',
                                opacity: status === 'locked' ? 0.5 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (status !== 'locked') {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: getWeekStatusColor(status),
                                marginBottom: '0.3rem'
                            }}>
                                W{weekNum}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'capitalize' }}>
                                {status}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Weekly Goals Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {weeklyGoals.map((week) => {
                    const status = getWeekStatus(week.week);
                    const isExpanded = expandedWeeks.includes(week.week);

                    return (
                        <div
                            key={week.week}
                            style={{
                                border: `2px solid ${getWeekStatusColor(status)}`,
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                background: status === 'current' ? '#FFFBF0' : 'white'
                            }}
                        >
                            {/* Week Header */}
                            <div
                                onClick={() => status !== 'locked' && toggleWeek(week.week)}
                                style={{
                                    padding: '1.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: status !== 'locked' ? 'pointer' : 'default',
                                    background: status === 'completed' ? '#E8F5E9' :
                                               status === 'current' ? '#FFF8E1' : 'white',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                    {status === 'completed' ? (
                                        <CheckCircle2 size={28} color="#00b894" />
                                    ) : status === 'current' ? (
                                        <Circle size={28} color="#FF6B6B" fill="#FF6B6B" />
                                    ) : (
                                        <Circle size={28} color="#b2bec3" />
                                    )}

                                    <div>
                                        <h3 style={{
                                            margin: 0,
                                            fontSize: '1.2rem',
                                            color: '#2D3436'
                                        }}>
                                            Week {week.week}: {week.title}
                                        </h3>
                                        <p style={{ margin: '0.3rem 0 0', fontSize: '0.9rem', color: '#888' }}>
                                            Focus: {week.focus}
                                        </p>
                                    </div>
                                </div>

                                {status !== 'locked' && (
                                    isExpanded ? (
                                        <ChevronUp size={24} color="#666" />
                                    ) : (
                                        <ChevronDown size={24} color="#666" />
                                    )
                                )}
                            </div>

                            {/* Week Details (Expanded) */}
                            {isExpanded && status !== 'locked' && (
                                <div style={{
                                    padding: '1.2rem',
                                    borderTop: '1px solid #f0f0f0',
                                    background: 'white'
                                }}>
                                    <h4 style={{
                                        fontSize: '1rem',
                                        marginBottom: '1rem',
                                        color: '#666',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <Trophy size={18} />
                                        Weekly Goals
                                    </h4>

                                    <ul style={{
                                        margin: 0,
                                        paddingLeft: '1.5rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.8rem'
                                    }}>
                                        {week.goals.map((goal, idx) => (
                                            <li
                                                key={idx}
                                                style={{
                                                    color: '#2D3436',
                                                    fontSize: '1rem',
                                                    lineHeight: '1.6'
                                                }}
                                            >
                                                {goal}
                                            </li>
                                        ))}
                                    </ul>

                                    {status === 'current' && (
                                        <div style={{
                                            marginTop: '1.5rem',
                                            padding: '1rem',
                                            background: 'linear-gradient(135deg, #667eea15, #764ba215)',
                                            borderRadius: 'var(--radius-sm)',
                                            borderLeft: '4px solid var(--color-primary)'
                                        }}>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '0.95rem',
                                                color: '#2D3436',
                                                fontWeight: '500'
                                            }}>
                                                📚 This week you'll focus on <strong>{week.focus}</strong>. Complete your daily activities to master these skills!
                                            </p>
                                        </div>
                                    )}

                                    {status === 'completed' && (
                                        <div style={{
                                            marginTop: '1.5rem',
                                            padding: '1rem',
                                            background: '#E8F5E9',
                                            borderRadius: 'var(--radius-sm)',
                                            borderLeft: '4px solid #00b894'
                                        }}>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '0.95rem',
                                                color: '#00b894',
                                                fontWeight: '500'
                                            }}>
                                                ✅ Week {week.week} completed! Great job mastering {week.focus}!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
