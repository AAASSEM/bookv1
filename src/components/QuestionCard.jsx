import React from 'react';

export default function QuestionCard({ question, onAnswer }) {
    const { prompt, options, type } = question;

    return (
        <div style={{
            background: 'var(--color-white)',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            maxWidth: '600px',
            width: '100%',
            marginBottom: '2rem',
            textAlign: 'center'
        }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--color-dark)' }}>{prompt}</h2>

            <div style={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: type === 'image-choice' ? 'repeat(3, 1fr)' : '1fr'
            }}>
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onAnswer(option.id)}
                        style={{
                            padding: '1.5rem',
                            fontSize: type === 'image-choice' ? '3rem' : '1.5rem',
                            backgroundColor: 'var(--color-light)',
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            color: 'var(--color-dark)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-secondary)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        {option.text}
                        {option.label && <span style={{ fontSize: '1rem', marginTop: '0.5rem', color: '#636e72' }}>{option.label}</span>}
                    </button>
                ))}
            </div>
        </div>
    );
}
