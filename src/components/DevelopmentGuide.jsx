import { useState } from 'react';
import { Baby, TrendingUp, Heart, Brain, BookOpen, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function DevelopmentGuide({ childAge, childLevel }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const developmentMilestones = {
    2: {
      title: '2-Year-Olds',
      icon: <Baby size={20} />,
      color: '#FF6B6B',
      skills: [
        'Can identify some letters and shapes',
        'Begins to understand that letters represent sounds',
        'Enjoys looking at picture books',
        'Can sing parts of alphabet song',
        'Recognizes own name in writing'
      ],
      activities: [
        { name: 'Read together daily', duration: '10-15 min' },
        { name: 'Point out letters in environment', duration: '5 min' },
        { name: 'Sing alphabet songs', duration: '5 min' },
        { name: 'Draw with crayons', duration: '10 min' }
      ],
      redFlags: [
        'Doesn\'t show interest in picture books',
        'Doesn\'t respond to their name',
        'Doesn\'t attempt to imitate writing',
        'No interest in songs or rhymes'
      ]
    },
    3: {
      title: '3-Year-Olds',
      icon: <TrendingUp size={20} />,
      color: '#4ECDC4',
      skills: [
        'Identifies most letters of the alphabet',
        'Understands that print carries meaning',
        'Can write some letters (especially those in their name)',
        'Recognizes familiar signs and logos',
        'Begins to understand rhyming'
      ],
      activities: [
        { name: 'Letter matching games', duration: '10-15 min' },
        { name: 'Practice writing name', duration: '10 min' },
        { name: 'Rhyming games and songs', duration: '10 min' },
        { name: 'Interactive storybook reading', duration: '15 min' }
      ],
      redFlags: [
        'Cannot identify any letters',
        'Doesn\'t understand that letters make sounds',
        'Struggles to hold crayon/pencil',
        'Shows no interest in books or stories'
      ]
    },
    4: {
      title: '4-Year-Olds',
      icon: <Heart size={20} />,
      color: '#FFE66D',
      skills: [
        'Knows all alphabet letters and sounds',
        'Can write their name independently',
        'Understands that words are made of sounds',
        'Can identify beginning sounds in words',
        'Recognizes some simple words (mom, dad, stop)'
      ],
      activities: [
        { name: 'Phonics games', duration: '15 min' },
        { name: 'Letter tracing practice', duration: '15 min' },
        { name: 'Sight word games', duration: '10-15 min' },
        { name: 'Writing simple words', duration: '15 min' }
      ],
      redFlags: [
        'Cannot write their own name',
        'Doesn\'t know letter sounds',
        'Struggles with rhyming words',
        'Shows little interest in learning to read'
      ]
    },
    5: {
      title: '5-Year-Olds',
      icon: <Brain size={20} />,
      color: '#6C5CE7',
      skills: [
        'Can read simple words phonetically',
        'Understands basic punctuation (periods, question marks)',
        'Writes simple sentences (I like cats)',
        'Can blend sounds to read words',
        'Recognizes 20-50 sight words'
      ],
      activities: [
        { name: 'Beginning reader books', duration: '15-20 min' },
        { name: 'Writing sentences', duration: '15 min' },
        { name: 'Word family games', duration: '10-15 min' },
        { name: 'Sight word practice', duration: '10 min' }
      ],
      redFlags: [
        'Cannot read simple 3-letter words',
        'Struggles to write a complete sentence',
        'Doesn\'t understand basic phonics',
        'Avoids reading and writing activities'
      ]
    },
    6: {
      title: '6-Year-Olds',
      icon: <BookOpen size={20} />,
      color: '#00B894',
      skills: [
        'Reading simple books independently',
        'Writing multiple sentences',
        'Understanding story elements (characters, plot)',
        'Using phonics to decode unfamiliar words',
        'Reading comprehension skills developing'
      ],
      activities: [
        { name: 'Read aloud together', duration: '20 min' },
        { name: 'Journal writing', duration: '15 min' },
        { name: 'Comprehension questions', duration: '10-15 min' },
        { name: 'Vocabulary building games', duration: '10 min' }
      ],
      redFlags: [
        'Reading far below grade level',
        'Difficulty writing coherent sentences',
        'Poor reading comprehension',
        'Avoids reading tasks'
      ]
    }
  };

  const levelGuidance = {
    'Beginner': {
      focus: 'Building Foundational Skills',
      description: 'At this stage, focus on letter recognition, basic phonics, and developing a love for reading. Keep activities fun and short!',
      keyAreas: [
        { area: 'Letter Recognition', tips: 'Practice 2-3 letters per week. Use multisensory approaches (tracing in sand, forming with playdough)' },
        { area: 'Phonological Awareness', tips: 'Sing songs, play rhyming games, clap out syllables in words' },
        { area: 'Print Concepts', tips: 'Teach that we read left-to-right, top-to-bottom. Point to words while reading' },
        { area: 'Writing Readiness', tips: 'Practice proper pencil grip, tracing lines and shapes, then letters' }
      ]
    },
    'Advanced Reader': {
      focus: 'Advancing Reading Skills',
      description: 'Now focus on phonics patterns, sight words, and early reading. Encourage independence while providing support when needed.',
      keyAreas: [
        { area: 'Phonics & Decoding', tips: 'Practice blends (bl, st, tr), digraphs (sh, ch, th), and vowel teams' },
        { area: 'Sight Words', tips: 'Practice high-frequency words that don\'t follow phonics rules (the, what, was)' },
        { area: 'Reading Fluency', tips: 'Read same book multiple times, practice expression and pacing' },
        { area: 'Comprehension', tips: 'Ask questions about stories, predict what happens next, discuss characters' }
      ]
    }
  };

  const currentMilestone = developmentMilestones[childAge] || developmentMilestones[4];
  const currentLevel = levelGuidance[childLevel] || levelGuidance['Beginner'];

  const sections = [
    { id: 'milestones', title: `Developmental Milestones for ${currentMilestone.title}`, icon: <Baby size={18} /> },
    { id: 'activities', title: 'Recommended Activities', icon: <Heart size={18} /> },
    { id: 'level', title: `Focus Areas for ${childLevel || 'Beginner'} Level`, icon: <TrendingUp size={18} /> },
    { id: 'redflags', title: 'When to Seek Help', icon: <AlertCircle size={18} /> }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          backgroundColor: '#4ECDC4',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(78, 205, 196, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1000
        }}
      >
        <Brain size={18} />
        Development Guide
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
              maxWidth: '800px',
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

            <div style={{ marginBottom: '25px' }}>
              <h2 style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#2D3436',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Brain size={26} color="#4ECDC4" />
                Child Development Guide
              </h2>
              <p style={{
                margin: 0,
                fontSize: '15px',
                color: '#666',
                lineHeight: '1.6'
              }}>
                Understanding your child's reading development and how to support their journey
              </p>
            </div>

            {/* Milestones Section */}
            <div style={{
              backgroundColor: '#F7F9FC',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '20px',
              borderLeft: `5px solid ${currentMilestone.color}`
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#2D3436',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {currentMilestone.icon}
                {currentMilestone.title} - What to Expect
              </h3>

              <div style={{ marginBottom: '15px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#2D3436', marginBottom: '10px' }}>
                  ✅ Typical Skills:
                </h4>
                <ul style={{
                  margin: 0,
                  paddingLeft: '20px',
                  color: '#2D3436',
                  lineHeight: '1.8'
                }}>
                  {currentMilestone.skills.map((skill, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>{skill}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#2D3436', marginBottom: '10px' }}>
                  🎯 Daily Activities:
                </h4>
                {currentMilestone.activities.map((activity, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <span style={{ fontWeight: '500' }}>{activity.name}</span>
                    <span style={{ color: '#666' }}>{activity.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Level Guidance Section */}
            <div style={{
              backgroundColor: '#FFF8E1',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '20px',
              borderLeft: '5px solid #FFE66D'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#2D3436',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <TrendingUp size={20} />
                {currentLevel.focus}
              </h3>
              <p style={{
                margin: '0 0 15px 0',
                fontSize: '14px',
                color: '#2D3436',
                lineHeight: '1.6'
              }}>
                {currentLevel.description}
              </p>
              {currentLevel.keyAreas.map((area, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    padding: '12px',
                    borderRadius: '10px',
                    marginBottom: '10px'
                  }}
                >
                  <h5 style={{
                    margin: '0 0 5px 0',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#FF6B6B'
                  }}>
                    {area.area}
                  </h5>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.5' }}>
                    {area.tips}
                  </p>
                </div>
              ))}
            </div>

            {/* Red Flags Section */}
            <div style={{
              backgroundColor: '#FFEBEE',
              padding: '20px',
              borderRadius: '15px',
              borderLeft: '5px solid #FF6B6B'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#C62828',
                marginBottom: '12px'
              }}>
                ⚠️ When to Seek Help
              </h3>
              <p style={{
                margin: '0 0 12px 0',
                fontSize: '13px',
                color: '#666',
                fontStyle: 'italic'
              }}>
                If you notice these signs, consider consulting with your child's teacher or a reading specialist:
              </p>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                color: '#2D3436',
                lineHeight: '1.8',
                fontSize: '14px'
              }}>
                {currentMilestone.redFlags.map((flag, index) => (
                  <li key={index}>{flag}</li>
                ))}
              </ul>
            </div>

            <div style={{
              marginTop: '20px',
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
                💡 Every child develops at their own pace. These milestones are guidelines, not strict rules!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
