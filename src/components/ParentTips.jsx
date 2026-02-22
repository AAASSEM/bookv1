import { useState } from 'react';
import { Lightbulb, AlertCircle, CheckCircle, Clock, BookOpen, X } from 'lucide-react';

export default function ParentTips({ activity, childLevel, childAge }) {
  const [isOpen, setIsOpen] = useState(false);

  const tipsData = {
    'LetterHunt': {
      title: 'Letter Hunt Tips',
      generalTips: [
        {
          icon: <CheckCircle size={16} />,
          text: 'Start with 3-5 letters at a time to avoid overwhelming your child',
          type: 'success'
        },
        {
          icon: <Clock size={16} />,
          text: 'Keep sessions short (10-15 minutes) for better focus',
          type: 'info'
        },
        {
          icon: <Lightbulb size={16} />,
          text: 'Point out letters in daily life (street signs, food labels, books)',
          type: 'tip'
        },
        {
          icon: <AlertCircle size={16} />,
          text: 'If your child struggles, try letters from their name first',
          type: 'warning'
        }
      ],
      levelTips: {
        'Beginner': [
          'Focus on uppercase letters first - they\'re easier to distinguish',
          'Use visual clues: "B looks like a button with two lines"',
          'Practice one letter per day before introducing new ones'
        ],
        'Advanced Reader': [
          'Introduce lowercase letters and matching uppercase/lowercase pairs',
          'Challenge your child to find words starting with the target letter',
          'Try letter hunts in books or while reading stories together'
        ]
      },
      discussionQuestions: [
        'What sound does this letter make?',
        'Can you find something else that starts with this letter?',
        'Let\'s trace the letter in the air with our finger!',
        'What words do you know that have this letter?'
      ]
    },
    'LetterTracing': {
      title: 'Letter Tracing Tips',
      generalTips: [
        {
          icon: <CheckCircle size={16} />,
          text: 'Encourage proper pencil grip - thumb and index finger holding the pencil',
          type: 'success'
        },
        {
          icon: <Clock size={16} />,
          text: 'Quality over quantity - 3 careful tracings are better than 10 rushed ones',
          type: 'info'
        },
        {
          icon: <Lightbulb size={16} />,
          text: 'Use different colors for different strokes to make it fun',
          type: 'tip'
        },
        {
          icon: <AlertCircle size={16} />,
          text: 'Celebrate effort, not perfection - early writing is messy!',
          type: 'warning'
        }
      ],
      levelTips: {
        'Beginner': [
          'Start with straight lines (E, F, H, I, L, T) before curved letters',
          'Use large paper or a whiteboard for bigger movements',
          'Try writing in sand, shaving cream, or with finger paints'
        ],
        'Advanced Reader': [
          'Focus on consistent sizing and spacing between letters',
          'Practice writing simple words (cat, dog, mom, dad)',
          'Encourage writing on lined paper to learn letter positioning'
        ]
      },
      discussionQuestions: [
        'Let\'s say the letter sound while we trace it!',
        'Where do we start this letter? At the top or bottom?',
        'Can you write this letter super big in the air?',
        'What\'s your favorite thing that starts with this letter?'
      ]
    },
    'PhonicsMatch': {
      title: 'Phonics Matching Tips',
      generalTips: [
        {
          icon: <CheckCircle size={16} />,
          text: 'Start with beginning sounds before ending sounds',
          type: 'success'
        },
        {
          icon: <Clock size={16} />,
          text: 'Play for 5-10 minutes, or as long as your child stays engaged',
          type: 'info'
        },
        {
          icon: <Lightbulb size={16} />,
          text: 'Use hand gestures or body movements to remember sounds',
          type: 'tip'
        },
        {
          icon: <AlertCircle size={16} />,
          text: 'Some sounds are harder (th, ch, sh) - give extra practice time',
          type: 'warning'
        }
      ],
      levelTips: {
        'Beginner': [
          'Focus on one sound at a time until mastered',
          'Use pictures with words to help visual learners',
          'Clap out syllables together: "cat" has one clap, "happy" has two'
        ],
        'Advanced Reader': [
          'Practice blends (bl, st, tr) and digraphs (sh, ch, th)',
          'Try rhyming games: "What rhymes with cat?" (hat, mat, sat)',
          'Challenge with longer words and breaking them into sounds'
        ]
      },
      discussionQuestions: [
        'What sound do you hear at the beginning of that word?',
        'Can you make the /b/ sound? What else starts with /b/?',
        'Let\'s stretch out the word: c-c-c-at',
        'Do these two words sound the same at the end?'
      ]
    },
    'Assessment': {
      title: 'Assessment Day Tips',
      generalTips: [
        {
          icon: <CheckCircle size={16} />,
          text: 'Choose a quiet time when your child is well-rested and fed',
          type: 'success'
        },
        {
          icon: <Clock size={16} />,
          text: 'Keep the session positive - it\'s not a test, it\'s a check-up!',
          type: 'info'
        },
        {
          icon: <Lightbulb size={16} />,
          text: 'Have water and a small snack ready for breaks',
          type: 'tip'
        },
        {
          icon: <AlertCircle size={16} />,
          text: 'Don\'t help with answers - we want to see what they know independently',
          type: 'warning'
        }
      ],
      levelTips: {
        'Beginner': [
          'Explain that there are no wrong answers - just tell us what they think',
          'Take breaks between questions if needed',
          'Praise effort: "I love how carefully you\'re thinking!"'
        ],
        'Advanced Reader': [
          'Encourage them to take their time with reading passages',
          'Remind them it\'s okay to not know something - that\'s how we learn!',
          'Celebrate progress from previous assessments'
        ]
      },
      discussionQuestions: [
        'You\'re doing great! Ready for the next one?',
        'Take your time - there\'s no rush!',
        'What did you think of that question?',
        'Which one was your favorite?'
      ]
    }
  };

  const activityTips = tipsData[activity] || tipsData['LetterHunt'];

  const getIconStyle = (type) => {
    switch(type) {
      case 'success': return '#4ECDC4';
      case 'warning': return '#FFE66D';
      case 'info': return '#6C5CE7';
      case 'tip': return '#FF6B6B';
      default: return '#666';
    }
  };

  const getEstimatedTime = () => {
    const times = {
      'LetterHunt': '10-15 min',
      'LetterTracing': '10-15 min',
      'PhonicsMatch': '5-10 min',
      'Assessment': '15-20 min'
    };
    return times[activity] || '10-15 min';
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#FF6B6B',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1000
        }}
      >
        <BookOpen size={18} />
        Parent Tips
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
              maxHeight: '80vh',
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
                <BookOpen size={24} color="#FF6B6B" />
                {activityTips.title}
              </h2>
              <div style={{
                display: 'flex',
                gap: '15px',
                fontSize: '13px',
                color: '#666'
              }}>
                <span>⏱️ {getEstimatedTime()}</span>
                <span>📚 Level: {childLevel || 'Beginner'}</span>
                {childAge && <span>👶 Age: {childAge} years</span>}
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2D3436',
                marginBottom: '15px'
              }}>
                💡 General Tips
              </h3>
              {activityTips.generalTips.map((tip, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#F7F9FC',
                    borderRadius: '10px',
                    marginBottom: '10px',
                    alignItems: 'flex-start'
                  }}
                >
                  <div style={{ color: getIconStyle(tip.type), marginTop: '2px' }}>
                    {tip.icon}
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#2D3436',
                    lineHeight: '1.5'
                  }}>
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>

            {childLevel && activityTips.levelTips[childLevel] && (
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2D3436',
                  marginBottom: '15px'
                }}>
                  📊 Tips for {childLevel} Level
                </h3>
                {activityTips.levelTips[childLevel].map((tip, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '12px',
                      backgroundColor: '#FFF8E1',
                      borderRadius: '10px',
                      marginBottom: '10px',
                      borderLeft: '4px solid #FFE66D'
                    }}
                  >
                    <p style={{
                      margin: 0,
                      fontSize: '14px',
                      color: '#2D3436',
                      lineHeight: '1.5'
                    }}>
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2D3436',
                marginBottom: '15px'
              }}>
                🗣️ Discussion Questions
              </h3>
              <div style={{
                backgroundColor: '#E8F5E9',
                padding: '15px',
                borderRadius: '12px',
                border: '2px dashed #4ECDC4'
              }}>
                {activityTips.discussionQuestions.map((question, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '8px 0',
                      borderBottom: index < activityTips.discussionQuestions.length - 1 ? '1px solid #4ECDC4' : 'none'
                    }}
                  >
                    <p style={{
                      margin: 0,
                      fontSize: '14px',
                      color: '#2D3436',
                      fontStyle: 'italic'
                    }}>
                      "{question}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              backgroundColor: '#E3F2FD',
              padding: '15px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#1976D2',
                fontWeight: '500'
              }}>
                💙 Remember: Every child learns at their own pace. Celebrate small wins!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
