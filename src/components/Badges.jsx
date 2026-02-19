import React, { useState, useEffect } from 'react';
import { getAllBadges } from '../data/rewards';
import confetti from 'canvas-confetti';

export default function Badges({ earnedBadges = [] }) {
    // Merge static definition with dynamic earned status
    const allBadges = getAllBadges().map(b => ({
        ...b,
        earned: earnedBadges.includes(b.label)
    }));

    // We don't need state if we derive from props on render, 
    // but if we want to animate new ones, we might. For now, simple render.
    const badges = allBadges;

    const celebrateBadge = (e) => {
        // Fire confetti from the click position
        const rect = e.target.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 50,
            spread: 60,
            origin: { x, y }
        });
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            marginTop: '2rem'
        }}>
            <h3 style={{
                margin: '0 0 1rem 0',
                color: '#2d3436',
                fontFamily: 'Comic Neue',
                fontSize: '1.5rem'
            }}>
                🏆 Trophy Room
            </h3>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {badges.map(badge => (
                    <div
                        key={badge.id}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            opacity: badge.earned ? 1 : 0.4,
                            width: '80px',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{
                            fontSize: '3rem',
                            marginBottom: '0.5rem',
                            filter: badge.earned ? 'none' : 'grayscale(100%)',
                            transition: 'transform 0.2s',
                            cursor: badge.earned ? 'pointer' : 'default'
                        }}
                            onMouseOver={e => badge.earned && (e.currentTarget.style.transform = 'scale(1.1)')}
                            onMouseOut={e => badge.earned && (e.currentTarget.style.transform = 'scale(1.0)')}
                            onClick={badge.earned ? celebrateBadge : undefined}
                            title={badge.description}
                        >
                            {badge.icon}
                        </div>
                        <span style={{
                            fontSize: '0.8rem',
                            color: '#636e72',
                            fontWeight: 'bold',
                            fontFamily: 'Comic Neue'
                        }}>
                            {badge.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
