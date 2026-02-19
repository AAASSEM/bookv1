import React from 'react';
import { Clock, Target, TrendingUp, Calendar } from 'lucide-react';

export default function StatsOverview({ stats }) {
    const {
        streak,
        total_score,
        total_time_spent_minutes,
        activities_this_week,
        weekly_progress,
        last_active
    } = stats;

    const formatTime = (minutes) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    const statsCards = [
        {
            icon: <span style={{ fontSize: '2rem' }}>🔥</span>,
            label: 'Day Streak',
            value: streak,
            color: '#e74c3c',
            bgColor: '#ffe6e6'
        },
        {
            icon: <Target size={28} color="var(--color-primary)" />,
            label: 'Total Score',
            value: total_score,
            color: 'var(--color-primary)',
            bgColor: '#ffe6f0'
        },
        {
            icon: <Clock size={28} color="var(--color-secondary)" />,
            label: 'Time Spent',
            value: formatTime(total_time_spent_minutes),
            color: 'var(--color-secondary)',
            bgColor: '#e6fff9'
        },
        {
            icon: <Calendar size={28} color="#9b59b6" />,
            label: 'Activities This Week',
            value: activities_this_week,
            color: '#9b59b6',
            bgColor: '#f5e6ff'
        }
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
        }}>
            {statsCards.map((card, index) => (
                <div
                    key={index}
                    style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: card.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem'
                    }}>
                        {card.icon}
                    </div>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: card.color,
                        marginBottom: '0.3rem'
                    }}>
                        {card.value}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: '500' }}>
                        {card.label}
                    </div>
                </div>
            ))}

            {/* Last Active Card */}
            {last_active && (
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-sm)',
                    gridColumn: '1 / -1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    borderLeft: '4px solid var(--color-primary)'
                }}>
                    <TrendingUp size={32} color="var(--color-primary)" />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: '500' }}>
                            Last Active
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-dark)' }}>
                            {last_active}
                        </div>
                    </div>
                    <div style={{
                        padding: '0.5rem 1rem',
                        background: weekly_progress >= 80 ? '#d4edda' : weekly_progress >= 50 ? '#fff3cd' : '#f8d7da',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: weekly_progress >= 80 ? '#155724' : weekly_progress >= 50 ? '#856404' : '#721c24'
                    }}>
                        {weekly_progress}% Weekly Progress
                    </div>
                </div>
            )}
        </div>
    );
}
