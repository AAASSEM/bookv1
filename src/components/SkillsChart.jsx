import React from 'react';
import { Target, Zap, Award } from 'lucide-react';

export default function SkillsChart({ skills }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Mastered': return '#27ae60';
            case 'Learning': return '#f39c12';
            case 'Not Started': return '#95a5a6';
            default: return '#95a5a6';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Mastered': return <Award size={16} />;
            case 'Learning': return <Zap size={16} />;
            case 'Not Started': return <Target size={16} />;
            default: return <Target size={16} />;
        }
    };

    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem'
        }}>
            <h3 style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                color: 'var(--color-dark)'
            }}>
                <Target size={24} color="var(--color-primary)" />
                Skills Mastery
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {skills.map((skill, index) => (
                    <div key={index}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.5rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: getStatusColor(skill.status) }}>
                                    {getStatusIcon(skill.status)}
                                </span>
                                <span style={{ fontWeight: '500', fontSize: '1rem' }}>
                                    {skill.skill_name}
                                </span>
                            </div>
                            <div style={{
                                padding: '0.3rem 0.8rem',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                background: getStatusColor(skill.status) + '20',
                                color: getStatusColor(skill.status)
                            }}>
                                {skill.status}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{
                            position: 'relative',
                            background: '#f0f0f0',
                            borderRadius: '10px',
                            height: '12px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${skill.mastery_level}%`,
                                height: '100%',
                                background: getStatusColor(skill.status),
                                transition: 'width 0.5s ease-in-out',
                                borderRadius: '10px'
                            }} />
                        </div>

                        <div style={{
                            textAlign: 'right',
                            fontSize: '0.85rem',
                            color: '#666',
                            marginTop: '0.3rem',
                            fontWeight: '500'
                        }}>
                            {skill.mastery_level}% Mastered
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #eee',
                display: 'flex',
                gap: '1.5rem',
                fontSize: '0.85rem',
                color: '#666'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27ae60' }} />
                    Mastered (80%+)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f39c12' }} />
                    Learning (1-79%)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#95a5a6' }} />
                    Not Started
                </div>
            </div>
        </div>
    );
}
