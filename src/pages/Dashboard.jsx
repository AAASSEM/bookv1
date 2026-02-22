import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../services/api';
import ChildMap from '../components/ChildMap';
import Badges from '../components/Badges';
import NotificationCenter from '../components/NotificationCenter';
import ChildSwitcher from '../components/ChildSwitcher';
import SkillsChart from '../components/SkillsChart';
import SiblingCard from '../components/SiblingCard';
import StatsOverview from '../components/StatsOverview';
import LearningPlan from '../components/LearningPlan';
import ProgressCharts from '../components/ProgressCharts';
import WeeklyReport from '../components/WeeklyReport';
import { Trophy, Calendar, Star, Activity, Baby, BookOpen, Music, Gamepad2, Pencil, PenTool, Book, Settings as SettingsIcon, Users, BarChart2, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const navigate = useNavigate();
    const { children, selectedChild, switchChild, loading: authLoading, user } = useAuth();
    const [level, setLevel] = useState('Beginner');
    const [learningPlan, setLearningPlan] = useState(null); // Full learning plan with weekly goals
    const [achievements, setAchievements] = useState([]);
    const [isChildMode, setIsChildMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [childName, setChildName] = useState("Child");
    const [dashboardData, setDashboardData] = useState(null);
    const [showSiblings, setShowSiblings] = useState(false);
    const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard', 'charts', 'report'

    // Initialize plan with default values to prevent crashes
    const [plan, setPlan] = useState({
        title: 'Level: Beginner',
        weeklyFocus: 'General Learning',
        streak: 0,
        progress: 0,
        duration_weeks: 6,
        focus_areas: 'General Learning',
        weekly_goals: null,
        dailyActivities: []
    });

    // Helper to map backend icon types to React components
    const getIcon = (type) => {
        switch (type?.toUpperCase()) {
            case 'GAME': return <Gamepad2 size={24} color="#FF6347" />;
            case 'VIDEO': return <Music size={24} color="#87CEEB" />;
            case 'TRACING': return <PenTool size={24} color="#FFA500" />;
            case 'READING': return <Book size={24} color="#9370DB" />;
            default: return <Star size={24} color="#FFD700" />;
        }
    };

    // Helper to map activity type to route
    const getActivityRoute = (activityType, activityName) => {
        const type = activityType?.toLowerCase() || '';

        // Map activity names/content to routes
        if (activityName?.toLowerCase().includes('letter hunt') || type === 'game') {
            return '/activity/letter-hunt';
        }
        if (activityName?.toLowerCase().includes('phonics') || activityName?.toLowerCase().includes('sound')) {
            return '/activity/phonics-match';
        }
        if (activityName?.toLowerCase().includes('tracing') || activityName?.toLowerCase().includes('trace')) {
            return '/activity/letter-tracing';
        }
        if (activityName?.toLowerCase().includes('reading') || activityName?.toLowerCase().includes('story')) {
            return '/activity/letter-hunt'; // Default to letter hunt for now
        }

        // Fallback by type
        if (type === 'game') return '/activity/letter-hunt';
        if (type === 'tracing') return '/activity/letter-tracing';
        if (type === 'video' || type === 'reading') return '/activity/phonics-match';

        // Default fallback
        return '/activity/letter-hunt';
    };

    // Always available activities
    const mainActivities = [
        {
            id: 'letter-hunt',
            title: 'Letter Hunt',
            type: 'Game',
            link: '/activity/letter-hunt',
            icon: <Gamepad2 size={32} color="#FF6B6B" />,
            description: 'Find all the matching letters!'
        },
        {
            id: 'phonics-match',
            title: 'Phonics Match',
            type: 'Game',
            link: '/activity/phonics-match',
            icon: <Music size={32} color="#4ECDC4" />,
            description: 'Match sounds to pictures!'
        },
        {
            id: 'letter-tracing',
            title: 'Letter Tracing',
            type: 'Tracing',
            link: '/activity/letter-tracing',
            icon: <PenTool size={32} color="#FFA500" />,
            description: 'Trace letters with your finger!'
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedChild) {
                setLoading(false);
                return;
            }

            try {
                const data = await getDashboardData(selectedChild.id);
                setDashboardData(data);

                setChildName(data.child_name || selectedChild.name);
                setLevel(data.level || selectedChild.current_level);
                setAchievements(data.achievements || []);

                // Map API data to component state structure
                setPlan({
                    title: `Level: ${data.level || selectedChild.current_level}`,
                    weeklyFocus: data.weekly_focus || 'General Learning',
                    streak: data.streak || 0,
                    progress: data.weekly_progress || 0,
                    duration_weeks: data.duration_weeks || 6,
                    focus_areas: data.weekly_focus || 'General Learning',
                    weekly_goals: data.weekly_goals || null,
                    dailyActivities: data.activities ? data.activities.map(act => ({
                        id: act.id,
                        title: act.title,
                        type: act.type,
                        completed: act.completed,
                        icon: getIcon(act.icon_type),
                        link: getActivityRoute(act.type, act.title)
                    })) : []
                });

                // Set learning plan separately for the LearningPlan component
                if (data.weekly_goals) {
                    setLearningPlan({
                        duration_weeks: data.duration_weeks || 6,
                        focus_areas: data.weekly_focus,
                        weekly_goals: data.weekly_goals
                    });
                }
            } catch (error) {
                console.error("Error loading dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        fetchData();
    }, [selectedChild, navigate]);

    useEffect(() => {
        if (isChildMode) {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.3 },
                colors: ['#FFD700', '#FF6347', '#87CEEB']
            });
        }
    }, [isChildMode]);

    // Wait for auth context to finish loading
    if (authLoading || loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your adventure...</div>;
    if (!selectedChild) return <div style={{ padding: '2rem', textAlign: 'center' }}>No child selected. Please add a child first.</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            {/* Header Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                background: isChildMode ? 'var(--color-secondary)' : 'var(--color-primary)',
                color: 'white',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                transition: 'background 0.3s'
            }}>
                {isChildMode ? (
                    <div>
                        <h1 style={{ color: 'white', marginBottom: '0.5rem', fontFamily: 'Comic Neue' }}>Hi {childName}! 👋</h1>
                        <p style={{ opacity: 0.9 }}>Ready to play?</p>
                    </div>
                ) : (
                    <div>
                        <h1 style={{ color: 'white', marginBottom: '0.5rem' }}>Parents Dashboard</h1>
                        <p style={{ opacity: 0.9 }}>Here is <strong>{childName}'s</strong> progress today.</p>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <ChildSwitcher />
                    {!isChildMode && <NotificationCenter parentId={user?.id} />}

                    {/* View Mode Buttons - Parent Only */}
                    {!isChildMode && (
                        <>
                            <button
                                onClick={() => setViewMode('dashboard')}
                                style={{
                                    background: viewMode === 'dashboard' ? 'white' : 'rgba(255,255,255,0.3)',
                                    color: viewMode === 'dashboard' ? '#FF6B6B' : 'white',
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: 'var(--radius-full)',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.3s'
                                }}
                                title="Dashboard View"
                            >
                                <Activity size={18} />
                                Dashboard
                            </button>

                            <button
                                onClick={() => setViewMode('charts')}
                                style={{
                                    background: viewMode === 'charts' ? 'white' : 'rgba(255,255,255,0.3)',
                                    color: viewMode === 'charts' ? '#FF6B6B' : 'white',
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: 'var(--radius-full)',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.3s'
                                }}
                                title="Progress Charts"
                            >
                                <BarChart2 size={18} />
                                Charts
                            </button>

                            <button
                                onClick={() => setViewMode('report')}
                                style={{
                                    background: viewMode === 'report' ? 'white' : 'rgba(255,255,255,0.3)',
                                    color: viewMode === 'report' ? '#FF6B6B' : 'white',
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: 'var(--radius-full)',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.3s'
                                }}
                                title="Weekly Report"
                            >
                                <FileText size={18} />
                                Report
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '/login';
                        }}
                        style={{
                            background: 'white',
                            color: '#e74c3c',
                            padding: '0.8rem 1.5rem',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        Logout
                    </button>

                    <button
                        onClick={() => setIsChildMode(!isChildMode)}
                        style={{
                            background: 'white',
                            color: isChildMode ? 'var(--color-secondary)' : 'var(--color-primary)',
                            padding: '0.8rem 1.5rem',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        {isChildMode ? <BookOpen size={20} /> : <Baby size={20} />}
                        {isChildMode ? 'Parents Mode' : 'Child Mode'}
                    </button>

                    {!isChildMode && (
                        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{plan.streak} 🔥</div>
                            <div style={{ fontSize: '0.8rem' }}>Day Streak</div>
                        </div>
                    )}

                    {!isChildMode && (
                        <button
                            onClick={() => navigate('/settings')}
                            style={{
                                background: 'white',
                                border: 'none',
                                padding: '0.6rem', // Adjusted to match bell
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: 'var(--shadow-sm)',
                                width: '40px',
                                height: '40px'
                            }}
                            title="Settings"
                        >
                            <SettingsIcon size={24} color="#666" />
                        </button>
                    )}
                </div>
            </div>

            {
                isChildMode ? (
                    <ChildMap level={level} />
                ) : viewMode === 'charts' ? (
                    <ProgressCharts dashboardData={dashboardData} />
                ) : viewMode === 'report' ? (
                    <WeeklyReport dashboardData={dashboardData} />
                ) : (
                    <div>
                        {/* Enhanced Stats Overview */}
                        {dashboardData && <StatsOverview stats={dashboardData} />}

                        {/* Multi-Child View Toggle */}
                        {children.length > 1 && (
                            <div style={{ marginBottom: '2rem' }}>
                                <button
                                    onClick={() => setShowSiblings(!showSiblings)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '1rem 1.5rem',
                                        background: 'white',
                                        border: '2px solid var(--color-primary)',
                                        borderRadius: 'var(--radius-full)',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        color: 'var(--color-primary)',
                                    }}
                                >
                                    <Users size={20} />
                                    {showSiblings ? 'Hide Siblings' : `View All Children (${children.length})`}
                                </button>

                                {showSiblings && (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                        gap: '1.5rem',
                                        marginTop: '1.5rem'
                                    }}>
                                        {/* Selected Child Card */}
                                        <SiblingCard
                                            child={{
                                                id: selectedChild.id,
                                                name: selectedChild.name,
                                                age: selectedChild.age,
                                                level: selectedChild.current_level,
                                                streak: dashboardData?.streak || 0,
                                                weekly_progress: dashboardData?.weekly_progress || 0,
                                                activities_completed: dashboardData?.activities?.filter(a => a.completed).length || 0,
                                                total_activities: dashboardData?.activities?.length || 0
                                            }}
                                        />
                                        {/* Sibling Cards */}
                                        {dashboardData?.sibling_summaries?.map(sibling => (
                                            <SiblingCard
                                                key={sibling.id}
                                                child={sibling}
                                                onClick={(child) => switchChild(children.find(c => c.id === child.id))}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Skills Mastery Chart */}
                        {dashboardData && <SkillsChart skills={dashboardData.skills} />}

                        {/* Learning Plan Journey */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Trophy size={24} color="var(--color-primary)" /> Your Learning Journey
                            </h2>
                            <LearningPlan plan={learningPlan} currentProgress={dashboardData?.weekly_progress || 0} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                            {/* Main Content: Daily Plan */}
                            <div>
                                <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={24} color="var(--color-secondary)" /> Today's Activities
                                </h2>

                                {/* Main Learning Activities - Always Available */}
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ marginBottom: '1rem', color: '#666', fontSize: '1rem' }}>🎮 Learning Games</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                        {mainActivities.map((activity) => (
                                            <div
                                                key={activity.id}
                                                onClick={() => navigate(activity.link)}
                                                style={{
                                                    background: 'white',
                                                    padding: '1.5rem',
                                                    borderRadius: 'var(--radius-md)',
                                                    boxShadow: 'var(--shadow-md)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s',
                                                    border: '3px solid transparent'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                                                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                                    e.currentTarget.style.borderColor = 'transparent';
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
                                                    <div style={{
                                                        padding: '0.8rem',
                                                        background: 'linear-gradient(135deg, #667eea15, #764ba215)',
                                                        borderRadius: 'var(--radius-sm)'
                                                    }}>
                                                        {activity.icon}
                                                    </div>
                                                    <div>
                                                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#2D3436' }}>{activity.title}</h4>
                                                        <span style={{ fontSize: '0.8rem', color: '#888' }}>{activity.type}</span>
                                                    </div>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{activity.description}</p>
                                                <div style={{
                                                    marginTop: '1rem',
                                                    padding: '0.5rem 1rem',
                                                    background: 'var(--color-primary)',
                                                    color: 'white',
                                                    borderRadius: 'var(--radius-full)',
                                                    textAlign: 'center',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 'bold'
                                                }}>
                                                    Play Now →
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Backend Assigned Activities */}
                                {plan.dailyActivities.length > 0 && (
                                    <div>
                                        <h3 style={{ marginBottom: '1rem', color: '#666', fontSize: '1rem' }}>📋 Assigned Activities</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {plan.dailyActivities.map((activity) => (
                                                <div key={activity.id} style={{
                                                    background: 'white',
                                                    padding: '1.5rem',
                                                    borderRadius: 'var(--radius-md)',
                                                    boxShadow: 'var(--shadow-sm)',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    borderLeft: `5px solid ${activity.completed ? 'var(--color-success)' : 'var(--color-secondary)'}`
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <span style={{ fontSize: '2rem' }}>{activity.icon}</span>
                                                        <div>
                                                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{activity.title}</h3>
                                                            <span style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>{activity.type}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => activity.link && navigate(activity.link, { state: { activityId: activity.id } })}
                                                        style={{
                                                            background: activity.completed ? 'var(--color-success)' : 'var(--color-dark)',
                                                            color: 'white',
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: 'var(--radius-full)',
                                                            fontSize: '0.9rem',
                                                            opacity: activity.completed ? 0.8 : 1
                                                        }}
                                                    >
                                                        {activity.completed ? 'Done ✅' : 'Start'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                        </div>

                        {/* Sidebar: Progress & Level */}
                        <div>
                            <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={24} color="var(--color-primary)" /> Current Level
                            </h2>
                            <div style={{
                                background: 'white',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-sm)',
                                marginBottom: '2rem'
                            }}>
                                <h3 style={{ color: 'var(--color-primary)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>{plan.title}</h3>
                                <p style={{ color: '#666', marginBottom: '1rem' }}>Focus: {plan.weeklyFocus}</p>

                                <div style={{ background: '#eee', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
                                    <div style={{ width: `${plan.progress}%`, background: 'var(--color-success)', height: '100%' }}></div>
                                </div>
                                <p style={{ textAlign: 'right', fontSize: '0.8rem', marginTop: '0.5rem', color: '#888' }}>{plan.progress}% to next level</p>
                            </div>

                            <Badges earnedBadges={achievements} />
                        </div>
                    </div>
                    </div>
                )
            }
        </div >
    );
}
