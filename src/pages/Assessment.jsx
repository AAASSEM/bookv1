import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentQuestions } from '../data/questions';
import QuestionCard from '../components/QuestionCard';
import { Sparkles } from 'lucide-react';
import { submitAssessment } from '../services/api';

export default function Assessment() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // Stores { qId: selectedOptionId }
    const [completed, setCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [answerTimes, setAnswerTimes] = useState({}); // Stores { qId: timeSpent }

    const currentQuestion = assessmentQuestions[currentIndex];
    const progress = ((currentIndex) / assessmentQuestions.length) * 100;

    const handleAnswer = (answerId) => {
        // Calculate time spent on this question (in seconds)
        const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);

        // Record answer and time
        const newAnswers = { ...answers, [currentQuestion.id]: answerId };
        const newTimes = { ...answerTimes, [currentQuestion.id]: timeSpent };
        setAnswers(newAnswers);
        setAnswerTimes(newTimes);

        // Move to next question
        if (currentIndex < assessmentQuestions.length - 1) {
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
                setQuestionStartTime(Date.now()); // Reset timer for next question
            }, 300);
        } else {
            finishAssessment(newAnswers, newTimes);
        }
    };

    const finishAssessment = async (finalAnswers, finalTimes) => {
        setCompleted(true);
        setIsSubmitting(true);

        try {
            const childId = localStorage.getItem('childId');
            if (!childId) throw new Error("No child ID found");

            // Format data for backend
            const formattedAnswers = assessmentQuestions.map(q => {
                const selected = finalAnswers[q.id];
                const timeSpent = finalTimes[q.id] || 0;

                // Find option text for selected and correct answers
                const selectedText = q.options.find(o => o.id === selected)?.text || selected;
                const correctText = q.options.find(o => o.id === q.correctId)?.text || q.correctId;

                return {
                    question_id: q.id,
                    question_content: q.prompt,
                    selected_answer: selectedText,
                    correct_answer: correctText,
                    time_spent: timeSpent // Real time tracking!
                };
            });

            const submission = {
                child_id: parseInt(childId),
                answers: formattedAnswers
            };

            const result = await submitAssessment(submission);
            console.log("Assessment Result:", result);

            // Save new level
            localStorage.setItem('childLevel', result.level);

            // Redirect to results page after celebration
            setTimeout(() => {
                navigate('/assessment-results', { state: { result } });
            }, 2000);

        } catch (error) {
            console.error("Failed to submit assessment:", error);
            alert("Something went wrong saving your results. Please try again.");
            setIsSubmitting(false);
            setCompleted(false);
        }
    };

    if (completed) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-success)',
                color: 'white'
            }}>
                <Sparkles size={64} />
                <h1>{isSubmitting ? 'Analyzing...' : 'Great Job!'}</h1>
                <p>Creating your magic learning plan...</p>
            </div>
        );
    }

    return (
        <div style={{
            padding: '2rem',
            minHeight: '100vh',
            maxWidth: '800px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Progress Bar */}
            <div style={{
                width: '100%',
                height: '10px',
                background: '#e0e0e0',
                borderRadius: '10px',
                marginBottom: '2rem',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'var(--color-secondary)',
                    transition: 'width 0.5s ease-out'
                }} />
            </div>

            <div style={{ marginBottom: '1rem', color: '#636e72', fontWeight: 'bold' }}>
                Question {currentIndex + 1} of {assessmentQuestions.length}
            </div>

            <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswer}
            />
        </div>
    );
}
