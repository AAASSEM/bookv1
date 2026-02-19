import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eraser, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordActivityProgress } from '../../services/api';

export default function LetterTracing() {
    const navigate = useNavigate();
    const location = useLocation();
    const { activityId } = location.state || {}; // Get passed ID
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set actual size in memory (scaled to account for extra pixel density)
        const scale = window.devicePixelRatio;
        canvas.width = 300 * scale;
        canvas.height = 300 * scale;

        // Normalize coordinate system to use css pixels
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 15;
        ctx.strokeStyle = '#00BCD4'; // Drawing color
    }, []);

    const startDrawing = (e) => {
        const { offsetX, offsetY } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.closePath();
        setIsDrawing(false);
    };

    const getCoordinates = (e) => {
        // Handle both mouse and touch events
        if (e.nativeEvent.touches) {
            const rect = canvasRef.current.getBoundingClientRect();
            return {
                offsetX: e.nativeEvent.touches[0].clientX - rect.left,
                offsetY: e.nativeEvent.touches[0].clientY - rect.top
            };
        }
        return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear raw pixel space
    };

    const handleFinish = async () => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

        // Record Progress
        try {
            const childId = localStorage.getItem('childId');
            if (childId && activityId) {
                await recordActivityProgress(childId, activityId);
                console.log("Progress recorded for Tracing!");
            }
        } catch (err) {
            console.error("Failed to save progress", err);
        }

        setTimeout(() => {
            navigate('/dashboard');
        }, 2000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#FFF3E0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem'
        }}>
            <div style={{ width: '100%', maxWidth: '600px', display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <ArrowLeft size={32} color="#E65100" />
                </button>
                <h1 style={{ flex: 1, textAlign: 'center', fontFamily: 'Comic Neue', color: '#E65100', margin: 0 }}>
                    Trace the Letter A
                </h1>
            </div>

            <div style={{ position: 'relative', margin: '2rem 0' }}>
                {/* Background Letter Guide */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '300px',
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '250px',
                    fontFamily: 'Comic Neue',
                    color: '#FFCCBC', // Light orange
                    pointerEvents: 'none',
                    userSelect: 'none',
                    zIndex: 0
                }}>
                    A
                </div>

                {/* Drawing Canvas */}
                <canvas
                    ref={canvasRef}
                    style={{
                        width: '300px',
                        height: '300px',
                        border: '4px dashed #FFAB91',
                        borderRadius: '20px',
                        backgroundColor: 'transparent', // Let guide show through
                        cursor: 'crosshair',
                        zIndex: 1,
                        touchAction: 'none' // Prevent scrolling while drawing
                    }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
                <button
                    onClick={clearCanvas}
                    style={{
                        background: 'white',
                        border: '2px solid #FFAB91',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    <Eraser size={24} color="#E65100" />
                </button>

                <button
                    onClick={handleFinish}
                    style={{
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '0.8rem 2rem',
                        fontSize: '1.2rem',
                        fontFamily: 'Comic Neue',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Check size={24} /> Done!
                </button>
            </div>

            <p style={{ marginTop: '2rem', color: '#7f8c8d', fontFamily: 'Comic Neue' }}>
                Follow the lines to write the letter!
            </p>
        </div>
    );
}
