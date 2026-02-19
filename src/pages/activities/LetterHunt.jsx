import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Star, Volume2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordActivityProgress } from '../../services/api';

export default function LetterHunt() {
    const navigate = useNavigate();
    const location = useLocation();
    const { activityId } = location.state || {};

    const [targetLetter, setTargetLetter] = useState('A');
    const [items, setItems] = useState([]);
    const [foundCount, setFoundCount] = useState(0);
    const [totalTarget, setTotalTarget] = useState(5);
    const [gameStarted, setGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState(null);

    // Letter bank to choose from
    const letters = 'ABCDEFGHILMNOPRSTUVW'; // Common early-learning letters (removed confusing ones like Q, O, etc.)

    // Generate game items
    const generateGame = (target) => {
        const targetCount = 5;
        const distractorCount = 11;
        const newItems = [];

        // Add target letters
        for (let i = 0; i < targetCount; i++) {
            newItems.push({
                id: i,
                char: target,
                found: false,
                isTarget: true
            });
        }

        // Add distractor letters
        const distractors = letters.split('').filter(l => l !== target);
        for (let i = 0; i < distractorCount; i++) {
            const randomLetter = distractors[Math.floor(Math.random() * distractors.length)];
            newItems.push({
                id: targetCount + i,
                char: randomLetter,
                found: false,
                isTarget: false
            });
        }

        // Shuffle the array
        return newItems.sort(() => Math.random() - 0.5);
    };

    // Initialize game
    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const newTarget = letters[Math.floor(Math.random() * letters.length)];
        setTargetLetter(newTarget);
        const gameItems = generateGame(newTarget);
        setItems(gameItems);
        setFoundCount(0);
        setScore(0);
        setTotalTarget(gameItems.filter(i => i.isTarget).length);
        setGameStarted(true);
        setStartTime(Date.now());
    };

    const handleItemClick = async (id, char) => {
        if (!gameStarted) return;

        if (char === targetLetter) {
            // Correct click
            const newItems = items.map(item =>
                item.id === id ? { ...item, found: true } : item
            );
            setItems(newItems);

            // Update count & score
            const newCount = newItems.filter(i => i.found && i.isTarget).length;
            setFoundCount(newCount);
            setScore(prev => prev + 10);

            if (newCount === totalTarget) {
                // WIN!
                const timeBonus = Math.max(0, 100 - Math.floor((Date.now() - startTime) / 1000));
                const finalScore = score + 10 + timeBonus;
                setScore(finalScore);

                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 }
                });

                // Record Progress
                try {
                    const childId = localStorage.getItem('childId');
                    if (childId && activityId) {
                        await recordActivityProgress(
                            childId,
                            activityId,
                            true, // completed
                            finalScore
                        );
                        console.log("Progress recorded!", { score: finalScore });
                    }
                } catch (err) {
                    console.error("Failed to save progress", err);
                }

                setTimeout(() => navigate('/dashboard'), 3000);
            }
        } else {
            // Wrong click - shake animation
            const btn = document.getElementById(`item-${id}`);
            if (btn) {
                btn.style.animation = 'shake 0.5s';
                setTimeout(() => btn.style.animation = '', 500);
            }
            setScore(prev => Math.max(0, prev - 2));
        }
    };

    const speakLetter = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(`Find the letter ${targetLetter}`);
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            speechSynthesis.speak(utterance);
        }
    };

    if (!gameStarted) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <>
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
            `}</style>

            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #FFE5D9 0%, #FFC3A0 100%)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontFamily: 'Comic Neue, cursive'
            }}>
                {/* Header */}
                <div style={{
                    width: '100%',
                    maxWidth: '700px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            background: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-md)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <ArrowLeft size={24} color="#FF6B6B" />
                    </button>

                    <div style={{
                        background: 'white',
                        padding: '0.8rem 1.5rem',
                        borderRadius: 'var(--radius-full)',
                        boxShadow: 'var(--shadow-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#FF6B6B' }}>
                            ⭐ {score}
                        </span>
                    </div>

                    <button
                        onClick={startNewGame}
                        style={{
                            background: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-md)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(180deg)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
                    >
                        <RotateCcw size={24} color="#FF6B6B" />
                    </button>
                </div>

                {/* Title & Instructions */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        color: '#2D3436',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        Find all the
                        <span style={{
                            color: '#FF6B6B',
                            fontSize: '4rem',
                            marginLeft: '0.5rem',
                            animation: 'bounce 1s infinite'
                        }}>
                            {targetLetter}
                        </span>
                        's!
                    </h1>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                            onClick={speakLetter}
                            style={{
                                background: 'white',
                                padding: '1rem 1.5rem',
                                borderRadius: 'var(--radius-full)',
                                border: 'none',
                                boxShadow: 'var(--shadow-md)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                color: '#FF6B6B',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <Volume2 size={24} />
                            Listen to Sound
                        </button>
                    </div>

                    {/* Progress Stars */}
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'center',
                        marginTop: '1.5rem'
                    }}>
                        {[...Array(totalTarget)].map((_, i) => (
                            <Star
                                key={i}
                                size={36}
                                fill={i < foundCount ? '#FFD700' : '#E0E0E0'}
                                color={i < foundCount ? '#FFD700' : '#BDBDBD'}
                                style={{ transition: 'all 0.3s' }}
                            />
                        ))}
                    </div>

                    <p style={{
                        fontSize: '1.2rem',
                        color: '#636e72',
                        marginTop: '1rem'
                    }}>
                        {foundCount} of {totalTarget} found
                    </p>
                </div>

                {/* Letter Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1rem',
                    maxWidth: '500px',
                    width: '100%'
                }}>
                    {items.map((item) => (
                        <button
                            key={item.id}
                            id={`item-${item.id}`}
                            onClick={() => !item.found && handleItemClick(item.id, item.char)}
                            disabled={item.found}
                            style={{
                                aspectRatio: '1',
                                background: item.found
                                    ? 'linear-gradient(135deg, #00b894, #00cec9)'
                                    : 'white',
                                borderRadius: '20px',
                                fontSize: '3.5rem',
                                fontWeight: 'bold',
                                color: item.found ? 'white' : '#2D3436',
                                cursor: item.found ? 'default' : 'pointer',
                                border: item.found ? 'none' : '4px solid #FFD93D',
                                boxShadow: item.found
                                    ? '0 8px 20px rgba(0,184,148,0.4)'
                                    : 'var(--shadow-md)',
                                transition: 'all 0.2s',
                                transform: item.found ? 'scale(0.95)' : 'scale(1)',
                                opacity: item.found ? 0.7 : 1,
                                fontFamily: 'Comic Neue, cursive'
                            }}
                            onMouseEnter={(e) => {
                                if (!item.found) {
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!item.found) {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                }
                            }}
                        >
                            {item.char}
                        </button>
                    ))}
                </div>

                {/* Hint Text */}
                <div style={{
                    marginTop: '2rem',
                    background: 'white',
                    padding: '1rem 2rem',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-sm)',
                    maxWidth: '500px',
                    textAlign: 'center'
                }}>
                    <p style={{
                        margin: 0,
                        fontSize: '1.1rem',
                        color: '#636e72'
                    }}>
                        💡 Tap all the letters that match <strong>{targetLetter}</strong>!
                    </p>
                </div>
            </div>
        </>
    );
}
