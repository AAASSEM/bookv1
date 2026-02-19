import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Volume2, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordActivityProgress } from '../../services/api';

export default function PhonicsMatch() {
    const navigate = useNavigate();
    const location = useLocation();
    const { activityId } = location.state || {};

    const [level, setLevel] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [showNext, setShowNext] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const questions = [
        {
            id: 1,
            sound: '/b/',
            letter: 'B',
            prompt: 'Which picture starts with the "B" sound?',
            correct: 'ball',
            options: [
                { id: 'ball', emoji: '⚽', label: 'Ball' },
                { id: 'cat', emoji: '🐱', label: 'Cat' },
                { id: 'apple', emoji: '🍎', label: 'Apple' }
            ]
        },
        {
            id: 2,
            sound: '/m/',
            letter: 'M',
            prompt: 'Which picture starts with the "M" sound?',
            correct: 'moon',
            options: [
                { id: 'fish', emoji: '🐟', label: 'Fish' },
                { id: 'moon', emoji: '🌙', label: 'Moon' },
                { id: 'sun', emoji: '☀️', label: 'Sun' }
            ]
        },
        {
            id: 3,
            sound: '/s/',
            letter: 'S',
            prompt: 'Which picture starts with the "S" sound?',
            correct: 'snake',
            options: [
                { id: 'snake', emoji: '🐍', label: 'Snake' },
                { id: 'tree', emoji: '🌳', label: 'Tree' },
                { id: 'bird', emoji: '🐦', label: 'Bird' }
            ]
        },
        {
            id: 4,
            sound: '/d/',
            letter: 'D',
            prompt: 'Which picture starts with the "D" sound?',
            correct: 'dog',
            options: [
                { id: 'dog', emoji: '🐕', label: 'Dog' },
                { id: 'frog', emoji: '🐸', label: 'Frog' },
                { id: 'pig', emoji: '🐷', label: 'Pig' }
            ]
        },
        {
            id: 5,
            sound: '/c/',
            letter: 'C',
            prompt: 'Which picture starts with the "C" sound?',
            correct: 'car',
            options: [
                { id: 'car', emoji: '🚗', label: 'Car' },
                { id: 'bus', emoji: '🚌', label: 'Bus' },
                { id: 'train', emoji: '🚂', label: 'Train' }
            ]
        }
    ];

    const currentQ = questions[level];

    const speakSound = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(`Which picture starts with the sound ${currentQ.sound}?`);
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            speechSynthesis.speak(utterance);
        }
    };

    const handleAnswer = async (optionId) => {
        if (showNext) return; // Prevent multiple clicks

        const isCorrect = optionId === currentQ.correct;
        setAttempts(prev => prev + 1);

        if (isCorrect) {
            // Correct answer!
            const points = Math.max(10, 20 - attempts * 5); // Fewer points for more attempts
            setScore(prev => prev + points);
            setFeedback({ type: 'success', optionId });

            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.7 }
            });

            setShowNext(true);

            // Record progress if this is the last question
            if (level === questions.length - 1) {
                try {
                    const childId = localStorage.getItem('childId');
                    if (childId && activityId) {
                        await recordActivityProgress(
                            childId,
                            activityId,
                            true,
                            score + points
                        );
                        console.log("Phonics Match completed!");
                    }
                } catch (err) {
                    console.error("Failed to save progress", err);
                }
            }

            // Auto-advance after delay
            setTimeout(() => {
                if (level < questions.length - 1) {
                    nextQuestion();
                } else {
                    setTimeout(() => navigate('/dashboard'), 2000);
                }
            }, 2000);
        } else {
            // Wrong answer
            setScore(prev => Math.max(0, prev - 2));
            setFeedback({ type: 'error', optionId });

            // Clear feedback after 1 second
            setTimeout(() => setFeedback(null), 1000);
        }
    };

    const nextQuestion = () => {
        setLevel(prev => prev + 1);
        setFeedback(null);
        setShowNext(false);
        setAttempts(0);
    };

    const resetGame = () => {
        setLevel(0);
        setScore(0);
        setFeedback(null);
        setShowNext(false);
        setAttempts(0);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
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
                    <ArrowLeft size={24} color="#006064" />
                </button>

                <div style={{
                    background: 'white',
                    padding: '0.8rem 2rem',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: 'var(--shadow-md)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: '#006064'
                    }}>
                        Question {level + 1} of {questions.length}
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '0.8rem 1.5rem',
                        borderRadius: 'var(--radius-full)',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <span style={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            color: '#FF6B6B'
                        }}>
                            ⭐ {score}
                        </span>
                    </div>
                    <button
                        onClick={resetGame}
                        style={{
                            background: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(180deg)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
                    >
                        <RotateCcw size={18} color="#006064" />
                    </button>
                </div>
            </div>

            {/* Question Card */}
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: 'var(--shadow-lg)',
                textAlign: 'center',
                maxWidth: '600px',
                width: '100%'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2rem',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 20px rgba(255,107,107,0.4)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onClick={speakSound}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Volume2 size={60} color="white" />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <div style={{
                            fontSize: '5rem',
                            fontWeight: 'bold',
                            color: '#FF6B6B',
                            marginBottom: '0.5rem'
                        }}>
                            {currentQ.letter}
                        </div>
                        <div style={{
                            fontSize: '2rem',
                            color: '#636e72',
                            fontWeight: 'bold'
                        }}>
                            says "{currentQ.sound}"
                        </div>
                    </div>
                </div>

                <h2 style={{
                    fontSize: '1.8rem',
                    color: '#2D3436',
                    margin: 0
                }}>
                    {currentQ.prompt}
                </h2>

                <button
                    onClick={speakSound}
                    style={{
                        background: '#E0F7FA',
                        border: '2px solid #00BCD4',
                        borderRadius: 'var(--radius-full)',
                        padding: '0.8rem 1.5rem',
                        marginTop: '1.5rem',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#006064',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#B2EBF2';
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#E0F7FA';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    🔊 Listen Again
                </button>
            </div>

            {/* Answer Options */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2rem',
                width: '100%',
                maxWidth: '900px'
            }}>
                {currentQ.options.map((option) => {
                    const isSelected = feedback && feedback.optionId === option.id;
                    const isCorrect = option.id === currentQ.correct;

                    return (
                        <button
                            key={option.id}
                            onClick={() => handleAnswer(option.id)}
                            disabled={showNext}
                            style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: 'var(--radius-lg)',
                                border: isSelected
                                    ? feedback.type === 'success'
                                        ? '4px solid #00b894'
                                        : '4px solid #e74c3c'
                                    : '4px solid transparent',
                                boxShadow: 'var(--shadow-lg)',
                                cursor: showNext ? 'default' : 'pointer',
                                transition: 'all 0.3s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                opacity: showNext && !isSelected ? 0.6 : 1,
                                transform: showNext && !isSelected ? 'scale(0.95)' : 'scale(1)'
                            }}
                            onMouseEnter={(e) => {
                                if (!showNext) {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!showNext) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                }
                            }}
                        >
                            <span style={{
                                fontSize: '6rem',
                                marginBottom: '1rem',
                                display: 'block'
                            }}>
                                {option.emoji}
                            </span>

                            <span style={{
                                fontSize: '1.8rem',
                                fontWeight: 'bold',
                                color: '#2D3436',
                                marginBottom: '0.5rem'
                            }}>
                                {option.label}
                            </span>

                            {isSelected && feedback?.type === 'success' && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: '#00b894',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    marginTop: '0.5rem'
                                }}>
                                    <CheckCircle2 size={24} />
                                    Correct!
                                </div>
                            )}

                            {isSelected && feedback?.type === 'error' && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: '#e74c3c',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    marginTop: '0.5rem'
                                }}>
                                    <XCircle size={24} />
                                    Try Again!
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Progress Dots */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '2rem'
            }}>
                {questions.map((_, idx) => (
                    <div
                        key={idx}
                        style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: idx === level
                                ? '#FF6B6B'
                                : idx < level
                                    ? '#00b894'
                                    : '#E0E0E0',
                            transition: 'all 0.3s'
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
