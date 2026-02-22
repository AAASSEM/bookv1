import { useState } from 'react';
import { BookOpen, Heart, Brain, Target, Users, Lightbulb, ChevronRight, ExternalLink } from 'lucide-react';

export default function ParentResources({ children }) {
  const [expandedSection, setExpandedSection] = useState(null);

  const resources = {
    readingTips: {
      title: 'Reading Tips for Parents',
      icon: <BookOpen size={24} />,
      color: '#FF6B6B',
      articles: [
        {
          title: 'How to Read Aloud to Your Child',
          summary: 'Learn techniques to make storytime engaging and educational',
          tips: [
            'Use different voices for different characters',
            'Point to words as you read to build print awareness',
            'Ask questions about the story: "What do you think happens next?"',
            'Relate stories to your child\'s experiences',
            'Read the same books repeatedly - children love repetition!'
          ]
        },
        {
          title: 'Creating a Reading-Friendly Home',
          summary: 'Simple ways to encourage literacy every day',
          tips: [
            'Create a cozy reading corner with pillows and good lighting',
            'Keep books at child level for easy access',
            'Model reading - let your child see you reading for pleasure',
            'Visit the library regularly',
            'Label items around the house to build vocabulary'
          ]
        },
        {
          title: 'Choosing the Right Books',
          summary: 'Age-appropriate book recommendations',
          tips: [
            '2-3 years: Simple board books, picture books, rhyming books',
            '3-4 years: Longer picture books, simple stories, alphabet books',
            '4-5 years: Beginning reader books, fairy tales, non-fiction',
            '5-6 years: Early chapter books, leveled readers, comic books',
            'Follow your child\'s interests - dinosaurs, princesses, animals, etc.'
          ]
        }
      ]
    },
    childDevelopment: {
      title: 'Child Development Insights',
      icon: <Brain size={24} />,
      color: '#4ECDC4',
      articles: [
        {
          title: 'Reading Milestones by Age',
          summary: 'What to expect at each stage of development',
          tips: [
            'Age 2: Recognizes some letters, enjoys looking at books',
            'Age 3: Identifies most letters, understands print carries meaning',
            'Age 4: Knows letter sounds, can write own name',
            'Age 5: Reads simple words, understands basic phonics',
            'Age 6: Reading simple books, writing sentences',
            'Remember: Every child develops at their own pace!'
          ]
        },
        {
          title: 'Signs of Reading Readiness',
          summary: 'Is your child ready to learn to read?',
          tips: [
            'Shows interest in books and stories',
            'Pretends to read by retelling stories',
            'Recognizes letters and their sounds',
            'Understands that text goes left-to-right',
            'Can distinguish between pictures and text',
            'Has good vocabulary for their age'
          ]
        },
        {
          title: 'When to Seek Help',
          summary: 'Early intervention is key for reading difficulties',
          tips: [
            'Doesn\'t show interest in books by age 3',
            'Cannot identify any letters by age 4',
            'Struggles to recognize their name in writing',
            'Difficulty remembering letter sounds',
            'Trouble rhyming words by age 5',
            'Consult with your pediatrician or a reading specialist'
          ]
        }
      ]
    },
    learningActivities: {
      title: 'Learning Activities',
      icon: <Target size={24} />,
      color: '#FFE66D',
      articles: [
        {
          title: 'Fun Phonics Games',
          summary: 'Playful ways to practice letter sounds',
          tips: [
            'I Spy: "I spy something that starts with the /b/ sound"',
            'Rhyme Time: Take turns saying rhyming words',
            'Sound Hop: Write letters on paper, hop to the correct sound',
            'Alphabet Scavenger Hunt: Find items starting with each letter',
            'Silly Songs: Make up songs with alliteration'
          ]
        },
        {
          title: 'Writing Activities',
          summary: 'Develop fine motor skills while learning letters',
          tips: [
            'Finger paint letters in shaving cream or sand',
            'Use Wikki Stix or playdough to form letters',
            'Write letters in a tray of salt or rice',
            'Dot markers for kids who struggle with pencil grip',
            'Sky writing: Write letters in the air with whole arm'
          ]
        },
        {
          title: 'Everyday Learning',
          summary: 'Turn daily routines into learning opportunities',
          tips: [
            'Read signs and labels while shopping',
            'Cook together: read recipes, measure ingredients',
            'License plate game: find letters while driving',
            'Restaurant menu: let your child "read" and choose',
            'Bedtime stories: the most important daily reading habit'
          ]
        }
      ]
    },
    parentSupport: {
      title: 'Parent Support & Community',
      icon: <Users size={24} />,
      color: '#6C5CE7',
      articles: [
        {
          title: 'Building a Learning Routine',
          summary: 'Consistent habits for lasting success',
          tips: [
            'Set a specific time for reading each day',
            'Start with 10-15 minutes for young children',
            'Make it fun, not a chore',
            'Be patient and positive',
            'Celebrate small wins and progress'
          ]
        },
        {
          title: 'Working with Your Child\'s School',
          summary: 'Partnership for your child\'s education',
          tips: [
            'Communicate regularly with teachers',
            'Ask about your child\'s reading level',
            'Volunteer in the classroom if possible',
            'Attend parent-teacher conferences',
            'Support classroom learning at home'
          ]
        },
        {
          title: 'Screen Time & Learning',
          summary: 'Balancing technology with traditional learning',
          tips: [
            'Limit screen time for young children (under 2 hours/day)',
            'Choose quality educational apps like BrightBook',
            'Co-view and discuss what your child sees',
            'Balance digital learning with physical books',
            'Model healthy screen habits yourself'
          ]
        }
      ]
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const childInfo = children && children.length > 0 ? children[0] : null;

  return (
    <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={28} color="#FF6B6B" />
          Parent Resources
        </h2>
        <p style={{ color: '#666', margin: 0 }}>
          Expert tips, activities, and guidance to support your child's reading journey
        </p>
      </div>

      {/* Child Info Banner */}
      {childInfo && (
        <div style={{
          backgroundColor: '#E3F2FD',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '2rem',
          borderLeft: '4px solid #2196F3'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#1976D2' }}>
            <strong>💙 Personalized for {childInfo.name}</strong> - Age: {childInfo.age || 'N/A'} | Level: {childInfo.level || 'Beginner'}
          </p>
        </div>
      )}

      {/* Resource Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {Object.entries(resources).map(([key, section]) => (
          <div
            key={key}
            style={{
              border: '2px solid #E0E0E0',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'all 0.3s'
            }}
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(key)}
              style={{
                width: '100%',
                padding: '20px',
                background: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '15px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: section.color,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {section.icon}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#2D3436'
                  }}>
                    {section.title}
                  </h3>
                  <p style={{
                    margin: '5px 0 0 0',
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    {section.articles.length} articles
                  </p>
                </div>
              </div>
              <ChevronRight
                size={24}
                color="#666"
                style={{
                  transition: 'transform 0.3s',
                  transform: expandedSection === key ? 'rotate(90deg)' : 'rotate(0deg)'
                }}
              />
            </button>

            {/* Expanded Content */}
            {expandedSection === key && (
              <div style={{
                padding: '0 20px 20px 20px',
                borderTop: '1px solid #E0E0E0',
                backgroundColor: '#F7F9FC'
              }}>
                {section.articles.map((article, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      padding: '20px',
                      borderRadius: '10px',
                      marginBottom: index < section.articles.length - 1 ? '15px' : '0',
                      borderLeft: `4px solid ${section.color}`
                    }}
                  >
                    <h4 style={{
                      margin: '0 0 8px 0',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#2D3436',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Lightbulb size={16} color={section.color} />
                      {article.title}
                    </h4>
                    <p style={{
                      margin: '0 0 12px 0',
                      fontSize: '14px',
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      {article.summary}
                    </p>
                    <ul style={{
                      margin: 0,
                      paddingLeft: '20px',
                      color: '#2D3436',
                      lineHeight: '1.8',
                      fontSize: '14px'
                    }}>
                      {article.tips.map((tip, tipIndex) => (
                        <li key={tipIndex}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* External Resources */}
      <div style={{
        marginTop: '2rem',
        padding: '20px',
        backgroundColor: '#FFF8E1',
        borderRadius: '12px',
        border: '2px dashed #FFE66D'
      }}>
        <h3 style={{
          margin: '0 0 15px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: '#2D3436',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ExternalLink size={20} color="#FFE66D" />
          More Resources
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
            <h5 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '600', color: '#FF6B6B' }}>
              Reading Rockets
            </h5>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
              Research-based reading strategies for parents and teachers
            </p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
            <h5 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '600', color: '#4ECDC4' }}>
              Scholastic Parents
            </h5>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
              Book recommendations, reading tips, and activities
            </p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
            <h5 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '600', color: '#6C5CE7' }}>
              PBS Parents
            </h5>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
              Child development information and educational resources
            </p>
          </div>
        </div>
      </div>

      {/* Encouragement Message */}
      <div style={{
        marginTop: '2rem',
        padding: '20px',
        backgroundColor: '#E8F5E9',
        borderRadius: '12px',
        textAlign: 'center',
        border: '2px solid #4ECDC4'
      }}>
        <p style={{
          margin: 0,
          fontSize: '15px',
          color: '#2D3436',
          fontWeight: '500'
        }}>
          <Heart size={16} color="#FF6B6B" style={{ verticalAlign: 'middle', marginRight: '5px' }} />
          You're doing an amazing job supporting your child's reading journey! Every small step counts.
        </p>
      </div>
    </div>
  );
}
