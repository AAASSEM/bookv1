import React from 'react';
import { Calendar, Download, Share2, Trophy, TrendingUp, Target, Clock } from 'lucide-react';

export default function WeeklyReport({ dashboardData = {} }) {
  const reportData = {
    weekOf: 'Feb 12 - Feb 18, 2026',
    childName: dashboardData.child_name || 'Your Child',
    level: dashboardData.level || 'Beginner',
    summary: {
      totalActivities: 12,
      totalTimeSpent: 285, // minutes
      averageAccuracy: 78,
      totalPoints: 380,
      badgesEarned: 3,
      streakDays: 5
    },
    highlights: [
      {
        icon: '🌟',
        title: 'Perfect Score!',
        description: 'Got 100% on Letter Hunt activity'
      },
      {
        icon: '🔥',
        title: '5-Day Streak!',
        description: 'Practiced every day this week'
      },
      {
        icon: '📚',
        title: 'Speed Reader',
        description: 'Completed 3 activities in one day'
      }
    ],
    skillsImproved: [
      { skill: 'Letter Recognition', progress: '+15%', current: 85 },
      { skill: 'Phonics', progress: '+12%', current: 72 },
      { skill: 'Rhyming', progress: '+8%', current: 68 }
    ],
    recommendations: [
      'Focus more on Grammar activities (currently at 55%)',
      'Great progress in Letter Recognition! Keep it up!',
      'Try to practice at the same time each day for better routine',
      'Consider reading bedtime stories to improve Reading Fluency'
    ],
    nextWeekGoals: [
      'Complete 15 activities total',
      'Improve Grammar score to 65%',
      'Maintain the 5-day streak',
      'Try 2 new activity types'
    ]
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            marginBottom: '0.5rem',
            color: '#2D3436'
          }}>
            Weekly Progress Report
          </h1>
          <p style={{ color: '#666', margin: 0 }}>
            {reportData.weekOf}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button
            onClick={() => alert('Report downloaded!')}
            style={{
              padding: '0.8rem 1.5rem',
              background: 'white',
              border: '2px solid var(--color-primary)',
              color: 'var(--color-primary)',
              borderRadius: 'var(--radius-full)',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-primary)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
          >
            <Download size={18} />
            Download PDF
          </button>

          <button
            onClick={() => alert('Share link copied!')}
            style={{
              padding: '0.8rem 1.5rem',
              background: 'var(--color-secondary)',
              border: 'none',
              color: 'white',
              borderRadius: 'var(--radius-full)',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(78, 205, 196, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>

      {/* Child Info Card */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0' }}>
              {reportData.childName}
            </h2>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Current Level: <strong>{reportData.level}</strong>
            </p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {reportData.summary.totalActivities}
            </div>
            <div style={{ fontSize: '0.85rem' }}>Activities Completed</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center'
        }}>
          <Clock size={28} color="#4ECDC4" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2D3436' }}>
            {Math.round(reportData.summary.totalTimeSpent / 60)}h {reportData.summary.totalTimeSpent % 60}m
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>Time Spent Learning</div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center'
        }}>
          <Target size={28} color="#FF6B6B" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2D3436' }}>
            {reportData.summary.averageAccuracy}%
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>Average Accuracy</div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center'
        }}>
          <Trophy size={28} color="#FFE66D" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2D3436' }}>
            {reportData.summary.totalPoints}
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>Points Earned</div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center'
        }}>
          <TrendingUp size={28} color="#00b894" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2D3436' }}>
            {reportData.summary.streakDays}
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>Day Streak</div>
        </div>
      </div>

      {/* Weekly Highlights */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          marginBottom: '1.5rem',
          color: '#2D3436',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Trophy size={24} color="var(--color-primary)" />
          Weekly Highlights
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reportData.highlights.map((highlight, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: '#f9f9f9',
                borderRadius: 'var(--radius-md)',
                borderLeft: `4px solid var(--color-${['primary', 'secondary', 'accent'][index]})`
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                background: 'white',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-full)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {highlight.icon}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#2D3436', marginBottom: '0.3rem' }}>
                  {highlight.title}
                </div>
                <div style={{ color: '#666', fontSize: '0.95rem' }}>
                  {highlight.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Improved */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          marginBottom: '1.5rem',
          color: '#2D3436',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <TrendingUp size={24} color="var(--color-success)" />
          Skills Improved
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {reportData.skillsImproved.map((skill, index) => (
            <div key={index}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontWeight: '500', color: '#2D3436' }}>{skill.skill}</span>
                <span style={{ color: '#00b894', fontWeight: 'bold' }}>
                  {skill.progress} (Current: {skill.current}%)
                </span>
              </div>
              <div style={{
                height: '10px',
                background: '#f0f0f0',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    height: '100%',
                    width: `${skill.current}%`,
                    background: 'linear-gradient(90deg, var(--color-success), #00b894)',
                    borderRadius: '10px',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '2rem',
        borderLeft: '5px solid var(--color-secondary)'
      }}>
        <h3 style={{
          marginBottom: '1rem',
          color: '#2D3436',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Target size={24} color="var(--color-secondary)" />
          Recommendations
        </h3>

        <ul style={{
          margin: 0,
          paddingLeft: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem'
        }}>
          {reportData.recommendations.map((rec, index) => (
            <li key={index} style={{
              color: '#2D3436',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Next Week Goals */}
      <div style={{
        background: 'linear-gradient(135deg, #FFE66D15, #FFD70015)',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        borderLeft: '5px solid var(--color-accent)'
      }}>
        <h3 style={{
          marginBottom: '1rem',
          color: '#2D3436',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Calendar size={24} color="var(--color-accent)" />
          Next Week's Goals
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {reportData.nextWeekGoals.map((goal, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                background: 'var(--color-accent)',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                {index + 1}
              </div>
              <span style={{ color: '#2D3436', fontSize: '0.95rem' }}>
                {goal}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '3rem',
        textAlign: 'center',
        color: '#666',
        fontSize: '0.9rem'
      }}>
        <p style={{ margin: 0 }}>
          Keep up the great work! 🌟 Consistent practice leads to success.
        </p>
      </div>
    </div>
  );
}
