import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, TrendingUp, Calendar, Award } from 'lucide-react';

export default function SiblingCard({ child, onClick }) {
    const navigate = useNavigate();

    const getProgressColor = (progress) => {
        if (progress >= 80) return '#27ae60';
        if (progress >= 50) return '#f39c12';
        return '#e74c3c';
    };

    return (
        <div
            onClick={() => onClick && onClick(child)}
            style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s',
                border: '2px solid transparent'
            }}
            onMouseEnter={(e) => {
                if (onClick) {
                    e.target.style.transform = 'translateY(-4px)';
                    e.target.style.boxShadow = 'var(--shadow-md)';
                    e.target.style.borderColor = 'var(--color-primary)';
                }
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'var(--shadow-sm)';
                e.target.style.borderColor = 'transparent';
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                }}>
                    {child.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-dark)' }}>
                        {child.name}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                        Age {child.age} • {child.level}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {/* Streak */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        color: '#e74c3c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem'
                    }}>
                        {child.streak} 🔥
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>Day Streak</div>
                </div>

                {/* Activities */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        color: 'var(--color-primary)'
                    }}>
                        {child.activities_completed}/{child.total_activities}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>Activities</div>
                </div>

                {/* Progress */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        color: getProgressColor(child.weekly_progress)
                    }}>
                        {child.weekly_progress}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>Progress</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginTop: '1rem' }}>
                <div style={{
                    background: '#f0f0f0',
                    borderRadius: '10px',
                    height: '8px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${child.weekly_progress}%`,
                        height: '100%',
                        background: getProgressColor(child.weekly_progress),
                        transition: 'width 0.3s ease'
                    }} />
                </div>
            </div>

            {onClick && (
                <div style={{
                    marginTop: '1rem',
                    textAlign: 'center',
                    color: 'var(--color-primary)',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                }}>
                    Click to view details →
                </div>
            )}
        </div>
    );
}
