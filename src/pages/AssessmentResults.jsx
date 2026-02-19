import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, TrendingUp, AlertCircle, Star, Target, BookOpen } from 'lucide-react';

export default function AssessmentResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result;

    if (!result) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <AlertCircle size={64} style={{ color: '#FF6B6B', marginBottom: '1rem' }} />
                <h2>No Results Found</h2>
                <p style={{ color: '#636e72', marginBottom: '2rem' }}>
                    Please complete the assessment first.
                </p>
                <button
                    onClick={() => navigate('/assessment')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Start Assessment
                </button>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Mastered': return '#27ae60';
            case 'Learning': return '#f39c12';
            case 'Needs Work': return '#e74c3c';
            default: return '#95a5a6';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Mastered': return <Star size={20} />;
            case 'Learning': return <TrendingUp size={20} />;
            case 'Needs Work': return <Target size={20} />;
            default: return null;
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem',
            paddingBottom: '6rem'
        }}>
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    marginBottom: '2rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '80px',
                        height: '80px',
                        background: 'var(--color-accent)',
                        borderRadius: '50%',
                        marginBottom: '1rem'
                    }}>
                        <Star size={40} style={{ color: '#f39c12' }} />
                    </div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold'
                    }}>
                        Assessment Complete!
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: '#636e72',
                        marginBottom: '1.5rem'
                    }}>
                        {result.message}
                    </p>

                    {/* Level Badge */}
                    <div style={{
                        display: 'inline-block',
                        padding: '1rem 2rem',
                        background: 'linear-gradient(45deg, var(--color-primary), var(--color-secondary))',
                        color: 'white',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem'
                    }}>
                        Level: {result.level}
                    </div>

                    {/* Accuracy Score */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '3rem',
                        marginTop: '1.5rem'
                    }}>
                        <div>
                            <div style={{
                                fontSize: '3rem',
                                fontWeight: 'bold',
                                color: result.accuracy >= 75 ? '#27ae60' : result.accuracy >= 50 ? '#f39c12' : '#e74c3c'
                            }}>
                                {result.accuracy}%
                            </div>
                            <div style={{ color: '#636e72', fontSize: '0.9rem' }}>Accuracy</div>
                        </div>
                    </div>
                </div>

                {/* Skill Breakdown */}
                <div style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    marginBottom: '2rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}>
                    <h2 style={{
                        fontSize: '1.8rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <BookOpen size={28} style={{ color: 'var(--color-primary)' }} />
                        Skill Breakdown
                    </h2>

                    <div style={{
                        display: 'grid',
                        gap: '1.5rem'
                    }}>
                        {result.skill_analysis?.map((skill, index) => (
                            <div
                                key={index}
                                style={{
                                    border: '2px solid #f0f0f0',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '1.5rem',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                                    e.currentTarget.style.borderColor = getStatusColor(skill.status);
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = '#f0f0f0';
                                }}
                            >
                                {/* Skill Header */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{
                                            fontSize: '1.3rem',
                                            marginBottom: '0.5rem',
                                            color: '#2D3436'
                                        }}>
                                            {skill.skill_name}
                                        </h3>
                                        <div style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            fontSize: '0.9rem',
                                            color: '#636e72'
                                        }}>
                                            <span>
                                                <CheckCircle2 size={14} style={{ marginRight: '4px' }} />
                                                {skill.correct_answers}/{skill.total_questions} correct
                                            </span>
                                            <span>
                                                <Clock size={14} style={{ marginRight: '4px' }} />
                                                {skill.avg_time_seconds}s avg
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        background: `${getStatusColor(skill.status)}20`,
                                        borderRadius: 'var(--radius-full)',
                                        color: getStatusColor(skill.status),
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem'
                                    }}>
                                        {getStatusIcon(skill.status)}
                                        {skill.status}
                                    </div>
                                </div>

                                {/* Mastery Bar */}
                                <div style={{
                                    width: '100%',
                                    height: '12px',
                                    background: '#f0f0f0',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{
                                        width: `${skill.mastery_percentage}%`,
                                        height: '100%',
                                        background: getStatusColor(skill.status),
                                        transition: 'width 1s ease-out',
                                        borderRadius: '10px'
                                    }} />
                                </div>

                                {/* Strengths & Weaknesses */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '1rem'
                                }}>
                                    {skill.strengths.length > 0 && (
                                        <div style={{
                                            padding: '0.8rem',
                                            background: '#d4edda',
                                            borderRadius: 'var(--radius-sm)',
                                            borderLeft: '4px solid #27ae60'
                                        }}>
                                            <div style={{
                                                fontWeight: 'bold',
                                                color: '#27ae60',
                                                marginBottom: '0.5rem',
                                                fontSize: '0.9rem'
                                            }}>
                                                <CheckCircle2 size={14} style={{ marginRight: '4px' }} />
                                                Strengths
                                            </div>
                                            {skill.strengths.map((strength, i) => (
                                                <div key={i} style={{
                                                    fontSize: '0.85rem',
                                                    color: '#155724',
                                                    marginBottom: '0.3rem'
                                                }}>
                                                    • {strength}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {skill.weaknesses.length > 0 && (
                                        <div style={{
                                            padding: '0.8rem',
                                            background: '#f8d7da',
                                            borderRadius: 'var(--radius-sm)',
                                            borderLeft: '4px solid #e74c3c'
                                        }}>
                                            <div style={{
                                                fontWeight: 'bold',
                                                color: '#e74c3c',
                                                marginBottom: '0.5rem',
                                                fontSize: '0.9rem'
                                            }}>
                                                <Target size={14} style={{ marginRight: '4px' }} />
                                                To Improve
                                            </div>
                                            {skill.weaknesses.map((weakness, i) => (
                                                <div key={i} style={{
                                                    fontSize: '0.85rem',
                                                    color: '#721c24',
                                                    marginBottom: '0.3rem'
                                                }}>
                                                    • {weakness}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                {result.recommendations && result.recommendations.length > 0 && (
                    <div style={{
                        background: 'white',
                        borderRadius: 'var(--radius-lg)',
                        padding: '2rem',
                        marginBottom: '2rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        <h2 style={{
                            fontSize: '1.8rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <Target size={28} style={{ color: 'var(--color-secondary)' }} />
                            Personalized Recommendations
                        </h2>

                        <div style={{
                            display: 'grid',
                            gap: '1rem'
                        }}>
                            {result.recommendations.map((rec, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                                        borderRadius: 'var(--radius-md)',
                                        borderLeft: '4px solid var(--color-secondary)'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '32px',
                                        height: '32px',
                                        background: 'var(--color-secondary)',
                                        color: 'white',
                                        borderRadius: '50%',
                                        fontWeight: 'bold',
                                        flexShrink: 0
                                    }}>
                                        {index + 1}
                                    </div>
                                    <p style={{
                                        margin: 0,
                                        color: '#2D3436',
                                        fontSize: '1.05rem',
                                        lineHeight: '1.6'
                                    }}>
                                        {rec}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Continue Button */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem'
                }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            padding: '1.2rem 3rem',
                            background: 'white',
                            color: 'var(--color-primary)',
                            border: '3px solid var(--color-primary)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--color-primary)';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = 'var(--color-primary)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
