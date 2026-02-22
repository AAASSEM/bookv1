import { useState } from 'react';
import { BookOpen, Play, RotateCcw, Trophy, Target, CheckCircle, X } from 'lucide-react';

export default function ActivityInstructions({ activity }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const instructions = {
    'LetterHunt': {
      title: 'Letter Hunt Activity',
      duration: '10-15 minutes',
      objective: 'Help your child recognize and identify letters in a fun, interactive way',
      materials: ['Device or tablet', 'Quiet space', 'Optional: Paper and crayon for extra practice'],
      steps: [
        {
          title: 'Prepare the Environment',
          icon: <Target size={24} />,
          content: [
            'Find a quiet space where your child can focus',
            'Make sure the device is charged and working',
            'Have a glass of water nearby'
          ],
          tips: 'Best done when your child is well-rested, not right before nap or mealtime.'
        },
        {
          title: 'Explain the Activity',
          icon: <BookOpen size={24} />,
          content: [
            'Tell your child: "We\'re going on a letter hunt!"',
            'Explain they\'ll be looking for specific letters',
            'Show them the target letter first'
          ],
          tips: 'Use an excited tone to build enthusiasm!'
        },
        {
          title: 'Start the Hunt',
          icon: <Play size={24} />,
          content: [
            'Let your child choose letters to find',
            'Encourage them to say the letter name out loud',
            'Celebrate each correct answer with praise'
          ],
          tips: 'If they struggle, give hints like "It\'s the first letter in your name!"'
        },
        {
          title: 'Practice and Reinforce',
          icon: <RotateCcw size={24} />,
          content: [
            'After the digital activity, practice on paper',
            'Have them draw the letter they just found',
            'Point out the same letter in books or around the house'
          ],
          tips: 'Reinforcement in different contexts helps memory!'
        },
        {
          title: 'Celebrate Success',
          icon: <Trophy size={24} />,
          content: [
            'Review the letters they found together',
            'Give specific praise: "You found 5 letters!"',
            'Consider doing a fun dance or high-five celebration'
          ],
          tips: 'Positive reinforcement builds confidence for next time!'
        }
      ]
    },
    'LetterTracing': {
      title: 'Letter Tracing Activity',
      duration: '10-15 minutes',
      objective: 'Develop fine motor skills and letter formation through guided tracing',
      materials: ['Device or tablet', 'Optional: Paper, pencil, or crayon for extra practice'],
      steps: [
        {
          title: 'Get Ready',
          icon: <Target size={24} />,
          content: [
            'Sit at a table or desk if possible',
            'Make sure your child can see the screen clearly',
            'Have them hold the device comfortably'
          ],
          tips: 'Good posture helps with writing control!'
        },
        {
          title: 'Show Proper Grip',
          icon: <BookOpen size={24} />,
          content: [
            'Demonstrate how to hold the stylus or use finger',
            'Encourage a relaxed grip, not too tight',
            'Show them how to move smoothly, not jerky'
          ],
          tips: 'For touch screens, encourage using their index finger carefully.'
        },
        {
          title: 'Start Tracing',
          icon: <Play size={24} />,
          content: [
            'Begin with simple straight-line letters (E, F, H, I, L, T)',
            'Encourage them to trace slowly and carefully',
            'Praise effort, not just accuracy'
          ],
          tips: 'Quality over quantity - 3 careful tracings beat 10 rushed ones!'
        },
        {
          title: 'Move to Curved Letters',
          icon: <RotateCcw size={24} />,
          content: [
            'Once comfortable, try curved letters (C, O, S, Q)',
            'Encourage continuous, smooth movements',
            'Celebrate improvements with each attempt'
          ],
          tips: 'Curved letters are harder - expect more mistakes and give extra encouragement!'
        },
        {
          title: 'Practice on Paper',
          icon: <Trophy size={24} />,
          content: [
            'After digital practice, try the same letters on paper',
            'Use different colors to make it fun',
            'Display their best work on the fridge!'
          ],
          tips: 'Physical writing helps develop muscle memory!'
        }
      ]
    },
    'PhonicsMatch': {
      title: 'Phonics Matching Activity',
      duration: '5-10 minutes',
      objective: 'Build phonemic awareness by matching sounds to letters and words',
      materials: ['Device or tablet', 'Quiet space'],
      steps: [
        {
          title: 'Prepare and Focus',
          icon: <Target size={24} />,
          content: [
            'Minimize distractions in the environment',
            'Explain: "We\'re going to play a sound matching game!"',
            'Make sure your child can hear the audio clearly'
          ],
          tips: 'This activity requires good audio - turn off TV/music in background.'
        },
        {
          title: 'Introduce the Sound',
          icon: <BookOpen size={24} />,
          content: [
            'Listen to the target sound together',
            'Have your child repeat the sound out loud',
            'Think of other words that start with that sound'
          ],
          tips: 'Use hand motions or body movements to help remember the sound!'
        },
        {
          title: 'Play the Matching Game',
          icon: <Play size={24} />,
          content: [
            'Let your child choose the matching letter/word',
            'Encourage them to say the sound out loud each time',
            'If they make a mistake, gently correct and explain why'
          ],
          tips: 'Celebrate correct answers immediately with enthusiasm!'
        },
        {
          title: 'Extend the Learning',
          icon: <RotateCcw size={24} />,
          content: [
            'Look around the room for things starting with that sound',
            'Try to think of words ending with the sound',
            'Practice blending sounds: c-c-c-at = cat'
          ],
          tips: 'Keep it playful - this should feel like a game, not a lesson!'
        },
        {
          title: 'Review and Celebrate',
          icon: <Trophy size={24} />,
          content: [
            'Review the sounds they practiced',
            'Ask: "Which was your favorite sound?"',
            'Give a big high-five for their effort'
          ],
          tips: 'End on a positive note so they\'ll want to play again!'
        }
      ]
    },
    'Assessment': {
      title: 'Reading Assessment Guide',
      duration: '15-20 minutes',
      objective: 'Evaluate your child\'s reading skills to personalize their learning journey',
      materials: ['Device or tablet', 'Quiet, comfortable space', 'Water and optional snack'],
      steps: [
        {
          title: 'Set Up for Success',
          icon: <Target size={24} />,
          content: [
            'Choose a time when your child is alert and happy',
            'Find a quiet spot free from distractions',
            'Tell them: "You\'re going to play a fun word game!"'
          ],
          tips: 'Avoid calling it a "test" - this can create anxiety!'
        },
        {
          title: 'Explain the Process',
          icon: <BookOpen size={24} />,
          content: [
            'Let them know they\'ll see different questions',
            'Explain it\'s okay if they don\'t know an answer',
            'Tell them to just try their best'
          ],
          tips: 'Emphasize effort over correctness - we want to see what they know!'
        },
        {
          title: 'During the Assessment',
          icon: <Play size={24} />,
          content: [
            'Stay nearby but don\'t help with answers',
            'Offer encouraging smiles and thumbs up',
            'If they get frustrated, offer a short break'
          ],
          tips: 'Your role is cheerleader, not teacher - let them show what they know independently!'
        },
        {
          title: 'Handle Frustrations',
          icon: <RotateCcw size={24} />,
          content: [
            'If they\'re stuck: "Take your time, there\'s no rush"',
            'If they\'re upset: "It\'s okay to take a break"',
            'Never show disappointment in wrong answers'
          ],
          tips: 'Keep the atmosphere positive and low-pressure throughout!'
        },
        {
          title: 'Celebrate Completion',
          icon: <Trophy size={24} />,
          content: [
            'Give big praise for finishing: "You did it!"',
            'Review the results together when ready',
            'Focus on what they learned, not what they missed'
          ],
          tips: 'The assessment is just a starting point - celebrate every step of the journey!'
        }
      ]
    }
  };

  const activityInstructions = instructions[activity] || instructions['LetterHunt'];

  const nextStep = () => {
    if (currentStep < activityInstructions.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '140px',
          right: '20px',
          backgroundColor: '#6C5CE7',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(108, 92, 231, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1000
        }}
      >
        <BookOpen size={18} />
        How to Play
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              maxWidth: '700px',
              maxHeight: '85vh',
              overflow: 'auto',
              padding: '30px',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '5px'
              }}
            >
              <X size={24} color="#666" />
            </button>

            <div style={{ marginBottom: '20px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#2D3436',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <BookOpen size={24} color="#6C5CE7" />
                {activityInstructions.title}
              </h2>
              <div style={{
                display: 'flex',
                gap: '20px',
                fontSize: '13px',
                color: '#666',
                marginBottom: '12px'
              }}>
                <span>⏱️ {activityInstructions.duration}</span>
              </div>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#2D3436',
                lineHeight: '1.6',
                backgroundColor: '#F7F9FC',
                padding: '12px',
                borderRadius: '10px'
              }}>
                <strong>Goal:</strong> {activityInstructions.objective}
              </p>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '13px',
                color: '#666'
              }}>
                <span>Step {currentStep + 1} of {activityInstructions.steps.length}</span>
                <span>
                  {Math.round(((currentStep + 1) / activityInstructions.steps.length) * 100)}% complete
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#E0E0E0',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${((currentStep + 1) / activityInstructions.steps.length) * 100}%`,
                  height: '100%',
                  backgroundColor: '#6C5CE7',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* Current Step */}
            <div style={{
              backgroundColor: '#F7F9FC',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '20px',
              borderLeft: '5px solid #6C5CE7'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '15px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#6C5CE7',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {activityInstructions.steps[currentStep].icon}
                </div>
                <h3 style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#2D3436'
                }}>
                  {activityInstructions.steps[currentStep].title}
                </h3>
              </div>

              <ul style={{
                margin: '0 0 15px 0',
                paddingLeft: '20px',
                color: '#2D3436',
                lineHeight: '1.8'
              }}>
                {activityInstructions.steps[currentStep].content.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <div style={{
                backgroundColor: '#FFF8E1',
                padding: '12px',
                borderRadius: '10px',
                borderLeft: '4px solid #FFE66D'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '13px',
                  color: '#2D3436',
                  fontStyle: 'italic'
                }}>
                  💡 {activityInstructions.steps[currentStep].tips}
                </p>
              </div>
            </div>

            {/* Step Indicators */}
            <div style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              {activityInstructions.steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid #6C5CE7',
                    backgroundColor: index === currentStep ? '#6C5CE7' : 'white',
                    color: index === currentStep ? 'white' : '#6C5CE7',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'space-between'
            }}>
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  backgroundColor: currentStep === 0 ? '#E0E0E0' : '#F7F9FC',
                  color: currentStep === 0 ? '#999' : '#2D3436',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                ← Previous
              </button>
              {currentStep === activityInstructions.steps.length - 1 ? (
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    backgroundColor: '#4ECDC4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <CheckCircle size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                  Start Activity!
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    backgroundColor: '#6C5CE7',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
