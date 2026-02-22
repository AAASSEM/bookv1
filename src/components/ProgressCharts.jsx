import React, { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Calendar, Clock, Award, Target, BookOpen } from 'lucide-react';

export default function ProgressCharts({ dashboardData = {} }) {
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'all'

  // Mock data for demonstration (in real app, this comes from backend)
  const weeklyProgressData = [
    { week: 'Week 1', activities: 5, score: 120, accuracy: 65 },
    { week: 'Week 2', activities: 8, score: 180, accuracy: 72 },
    { week: 'Week 3', activities: 12, score: 250, accuracy: 78 },
    { week: 'Week 4', activities: 10, score: 200, accuracy: 75 },
    { week: 'Week 5', activities: 15, score: 320, accuracy: 82 },
    { week: 'Week 6', activities: 18, score: 380, accuracy: 85 },
  ];

  const dailyActivityData = [
    { day: 'Mon', completed: 3, timeSpent: 45 },
    { day: 'Tue', completed: 5, timeSpent: 60 },
    { day: 'Wed', completed: 2, timeSpent: 30 },
    { day: 'Thu', completed: 6, timeSpent: 75 },
    { day: 'Fri', completed: 4, timeSpent: 50 },
    { day: 'Sat', completed: 7, timeSpent: 90 },
    { day: 'Sun', completed: 3, timeSpent: 40 },
  ];

  const skillBreakdownData = [
    { skill: 'Letter Recognition', mastered: 85, total: 100, color: '#FF6B6B' },
    { skill: 'Phonics', mastered: 72, total: 100, color: '#4ECDC4' },
    { skill: 'Rhyming', mastered: 68, total: 100, color: '#FFE66D' },
    { skill: 'Grammar', mastered: 55, total: 100, color: '#95E1D3' },
    { skill: 'Reading Fluency', mastered: 45, total: 100, color: '#DDA0DD' },
  ];

  const activityTypeData = [
    { name: 'Letter Hunt', value: 35, color: '#FF6B6B' },
    { name: 'Phonics Match', value: 30, color: '#4ECDC4' },
    { name: 'Letter Tracing', value: 25, color: '#FFE66D' },
    { name: 'Story Time', value: 10, color: '#95E1D3' },
  ];

  const statsCards = [
    {
      title: 'Total Activities',
      value: dashboardData.activities_this_week || 0,
      unit: 'completed',
      icon: <BookOpen size={24} color="#FF6B6B" />,
      trend: '+12%',
      positive: true
    },
    {
      title: 'Time Spent',
      value: Math.round(dashboardData.total_time_spent_minutes || 0),
      unit: 'minutes',
      icon: <Clock size={24} color="#4ECDC4" />,
      trend: '+25%',
      positive: true
    },
    {
      title: 'Current Streak',
      value: dashboardData.streak || 0,
      unit: 'days',
      icon: <TrendingUp size={24} color="#FFE66D" />,
      trend: 'Active!',
      positive: true
    },
    {
      title: 'Badges Earned',
      value: dashboardData.achievements?.length || 0,
      unit: 'badges',
      icon: <Award size={24} color="#DDA0DD" />,
      trend: 'Great!',
      positive: true
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid #f0f0f0'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#2D3436' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '0.3rem 0', color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: '2rem' }}>
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
            Progress Insights
          </h1>
          <p style={{ color: '#666', margin: 0 }}>
            Track {dashboardData.child_name || 'your child'}'s learning journey
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['week', 'month', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: 'var(--radius-full)',
                border: '2px solid',
                borderColor: timeRange === range ? 'var(--color-primary)' : '#e0e0e0',
                background: timeRange === range ? 'var(--color-primary)' : 'white',
                color: timeRange === range ? 'white' : '#666',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s',
                textTransform: 'capitalize'
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {statsCards.map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              borderLeft: `4px solid ${stat.icon.props.color}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              {stat.icon}
              <span style={{
                padding: '0.3rem 0.8rem',
                background: stat.positive ? '#00b894' : '#e74c3c',
                color: 'white',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {stat.trend}
              </span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2D3436' }}>
              {stat.value}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>
              {stat.title} ({stat.unit})
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Weekly Progress Line Chart */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{
            marginBottom: '1rem',
            color: '#2D3436',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <TrendingUp size={20} color="var(--color-primary)" />
            Weekly Progress
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyProgressData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#FF6B6B"
                fillOpacity={1}
                fill="url(#colorScore)"
                name="Score"
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#4ECDC4"
                strokeWidth={2}
                name="Accuracy %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Activity Bar Chart */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{
            marginBottom: '1rem',
            color: '#2D3436',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Calendar size={20} color="var(--color-secondary)" />
            Daily Activities (This Week)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="completed" fill="#FF6B6B" name="Completed" radius={[8, 8, 0, 0]} />
              <Bar dataKey="timeSpent" fill="#4ECDC4" name="Minutes Spent" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Breakdown Bar Chart */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{
            marginBottom: '1rem',
            color: '#2D3436',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Target size={20} color="var(--color-accent)" />
            Skill Mastery Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillBreakdownData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#666" />
              <YAxis dataKey="skill" type="category" width={120} stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="mastered" name="Mastered %" radius={[0, 8, 8, 0]}>
                {skillBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Type Distribution Pie Chart */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{
            marginBottom: '1rem',
            color: '#2D3436',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <BookOpen size={20} color="#9B59B6" />
            Activity Types Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activityTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {activityTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea15, #764ba215)',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        borderLeft: '5px solid var(--color-primary)'
      }}>
        <h3 style={{
          marginBottom: '1rem',
          color: '#2D3436',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Award size={24} color="var(--color-primary)" />
          This Week's Summary
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
              {weeklyProgressData[weeklyProgressData.length - 1].activities}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>Activities Completed</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-secondary)' }}>
              {weeklyProgressData[weeklyProgressData.length - 1].score}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Points Earned</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
              {weeklyProgressData[weeklyProgressData.length - 1].accuracy}%
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>Average Accuracy</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00b894' }}>
              +{Math.round((weeklyProgressData[weeklyProgressData.length - 1].accuracy - weeklyProgressData[0].accuracy) / weeklyProgressData[0].accuracy * 100)}%
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>Improvement Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
