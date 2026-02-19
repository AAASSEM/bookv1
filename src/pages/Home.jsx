import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'var(--color-white)',
        padding: '3rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        maxWidth: '600px'
      }}>
        <div style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
          <BookOpen size={64} />
        </div>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          color: 'var(--color-dark)'
        }}>
          BrightBook
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#636e72',
          marginBottom: '2rem'
        }}>
          Your child's personal AI reading companion.
        </p>

        <button
          onClick={() => navigate('/signup')}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.5rem',
            borderRadius: '50px',
            border: 'none',
            background: 'white',
            color: 'var(--color-primary)',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'transform 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Start Journey <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}
