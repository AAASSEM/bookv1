import React, { useState } from 'react';
import { Trophy, Star, Target, Flame, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { allAchievements, rarityColors, getLevelForPoints, achievements } from '../data/rewards';
import confetti from 'canvas-confetti';

export default function Badges({ earnedBadges = [], totalPoints = 0, showAll = false }) {
    const [expandedSection, setExpandedSection] = useState('assessment_badges');
    const userLevel = getLevelForPoints(totalPoints);

    // Create map of earned badges for easy lookup
    const earnedBadgesMap = new Map(earnedBadges.map(b => [b.id || b, true]));

    // Toggle section expand/collapse
    const toggleSection = (section) => {
        if (expandedSection === section) {
            setExpandedSection(null);
        } else {
            setExpandedSection(section);
        }
    };

    const celebrateBadge = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x, y },
            colors: ['#FFD700', '#FF6347', '#87CEEB', '#98FB98']
        });
    };

    const renderBadgeCard = (achievement) => {
        const isEarned = earnedBadgesMap.has(achievement.id);
        const color = isEarned ? rarityColors[achievement.rarity] : '#e0e0e0';
        const textColor = isEarned ? '#2D3436' : '#999';

        return (
            <div
                key={achievement.id}
                onClick={isEarned ? celebrateBadge : undefined}
                style={{
                    background: 'white',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    border: `3px solid ${color}`,
                    boxShadow: 'var(--shadow-sm)',
                    opacity: isEarned ? 1 : 0.5,
                    transition: 'all 0.3s',
                    minWidth: '200px',
                    flex: '1 1 200px',
                    maxWidth: '250px',
                    cursor: isEarned ? 'pointer' : 'default'
                }}
                onMouseEnter={(e) => {
                    if (isEarned) {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        background: isEarned ? `${color}20` : '#f5f5f5',
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                    }}>
                        {achievement.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{
                            margin: 0,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            color: textColor
                        }}>
                            {achievement.name}
                        </h4>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.8rem',
                            color: isEarned ? color : '#ccc'
                        }}>
                            <Star size={12} fill={isEarned ? 'currentColor' : 'none'} />
                            {achievement.points} pts
                        </div>
                    </div>
                    {isEarned && (
                        <div style={{
                            width: '24px',
                            height: '24px',
                            background: color,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Award size={14} color="white" />
                        </div>
                    )}
                </div>

                <p style={{
                    margin: '0.5rem 0',
                    fontSize: '0.85rem',
                    color: textColor,
                    lineHeight: '1.4'
                }}>
                    {achievement.description}
                </p>

                {isEarned && (
                    <div style={{
                        marginTop: '0.5rem',
                        padding: '0.3rem 0.8rem',
                        background: color,
                        color: 'white',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        textTransform: 'capitalize'
                    }}>
                        {achievement.rarity}
                    </div>
                )}
            </div>
        );
    };

    const renderSection = (title, icon, badgeList, sectionKey) => {
        const isExpanded = expandedSection === sectionKey;
        const earnedCount = badgeList.filter(a => earnedBadgesMap.has(a.id)).length;
        const totalCount = badgeList.length;

        return (
            <div style={{ marginBottom: '1.5rem' }}>
                <div
                    onClick={() => toggleSection(sectionKey)}
                    style={{
                        background: 'white',
                        padding: '1rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid #f0f0f0',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-primary)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#f0f0f0';
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        {icon}
                        <h3 style={{
                            margin: 0,
                            fontSize: '1.2rem',
                            color: '#2D3436'
                        }}>
                            {title}
                        </h3>
                        <span style={{
                            background: 'var(--color-primary)',
                            color: 'white',
                            padding: '0.2rem 0.6rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.85rem',
                            fontWeight: 'bold'
                        }}>
                            {earnedCount}/{totalCount}
                        </span>
                    </div>
                    {isExpanded ? <ChevronUp size={20} color="#666" /> : <ChevronDown size={20} color="#666" />}
                </div>

                {isExpanded && (
                    <div style={{
                        marginTop: '1rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        {badgeList.map(achievement => renderBadgeCard(achievement))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)'
        }}>
            {/* Header */}
            <div style={{
                marginBottom: '2rem',
                paddingBottom: '1.5rem',
                borderBottom: '2px solid #f0f0f0'
            }}>
                <h2 style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Trophy size={28} style={{ color: 'var(--color-primary)' }} />
                    Your Achievements
                </h2>

                {/* Points Level */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #667eea15, #764ba215)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: `4px solid ${userLevel.color}`
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        background: userLevel.color,
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                    }}>
                        {userLevel.icon}
                    </div>
                    <div>
                        <div style={{
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            color: '#2D3436'
                        }}>
                            {userLevel.name} Level
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            color: '#666'
                        }}>
                            {totalPoints} Total Points
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievement Sections */}
            {renderSection('📝 Assessment Achievements', <Target size={24} color="#FF6B6B" />, achievements.assessment_badges, 'assessment_badges')}
            {renderSection('🎮 Activity Achievements', <Star size={24} color="#4ECDC4" />, achievements.activity_badges, 'activity_badges')}
            {renderSection('🔥 Streak Achievements', <Flame size={24} color="#FFA500" />, achievements.streak_badges, 'streak_badges')}
            {renderSection('🎓 Skill Milestones', <Award size={24} color="#9B59B6" />, achievements.skill_badges, 'skill_badges')}
            {renderSection('⭐ Special Achievements', <Trophy size={24} color="#F39C12" />, achievements.special_badges, 'special_badges')}

            {/* Stats */}
            <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: '#f9f9f9',
                borderRadius: 'var(--radius-md)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                textAlign: 'center'
            }}>
                <div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                        {earnedBadges.length}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Badges Earned</div>
                </div>
                <div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>
                        {allAchievements.length - earnedBadges.length}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Still Available</div>
                </div>
                <div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>
                        {totalPoints}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Points</div>
                </div>
            </div>
        </div>
    );
}

