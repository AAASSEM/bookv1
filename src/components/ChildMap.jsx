import React from 'react';
import { Star, Lock, BookOpen } from 'lucide-react';

export default function ChildMap({ level }) {
    const levels = [
        { id: 1, title: 'Alphabet Forest', status: 'completed' },
        { id: 2, title: 'Sound River', status: 'completed' },
        { id: 3, title: 'Word Mountain', status: 'current' },
        { id: 4, title: 'Story Sky', status: 'locked' },
        { id: 5, title: 'Reading Space', status: 'locked' },
    ];

    return (
        <div style={{
            padding: '2rem',
            backgroundColor: '#81ecec', // Sky blue background
            minHeight: '80vh',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <h1 style={{
                fontFamily: 'Comic Neue, cursive',
                fontSize: '3rem',
                color: '#2d3436',
                marginBottom: '2rem'
            }}>
                My Journey 🗺️
            </h1>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                position: 'relative',
                zIndex: 1
            }}>
                {levels.map((lvl, index) => (
                    <div key={lvl.id} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        transform: index % 2 === 0 ? 'translateX(-20px)' : 'translateX(20px)' // Zig-zag path effect
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: lvl.status === 'locked' ? '#b2bec3' : lvl.status === 'current' ? 'var(--color-primary)' : 'var(--color-success)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '4px solid white',
                            boxShadow: 'var(--shadow-md)',
                            position: 'relative'
                        }}>
                            {lvl.status === 'completed' && <Star fill="white" size={32} color="white" />}
                            {lvl.status === 'current' && <BookOpen size={32} color="white" />}
                            {lvl.status === 'locked' && <Lock size={24} color="white" />}
                        </div>

                        {/* Dashed line connector */}
                        {index < levels.length - 1 && (
                            <div style={{
                                position: 'absolute',
                                bottom: '-2rem',
                                left: '50%',
                                width: '4px',
                                height: '2rem',
                                backgroundColor: 'rgba(255,255,255,0.5)',
                                zIndex: -1
                            }} />
                        )}

                        <div style={{
                            marginTop: '0.5rem',
                            background: 'white',
                            padding: '0.2rem 0.8rem',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            color: '#2d3436',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            {lvl.title}
                        </div>
                    </div>
                ))}
            </div>

            {/* Decorative Clouds */}
            <div style={{ position: 'absolute', top: '50px', left: '50px', fontSize: '3rem', opacity: 0.8 }}>☁️</div>
            <div style={{ position: 'absolute', top: '150px', right: '80px', fontSize: '4rem', opacity: 0.8 }}>☁️</div>
        </div>
    );
}
