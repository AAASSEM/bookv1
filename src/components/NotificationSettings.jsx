import React, { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Clock, Check, X, Save } from 'lucide-react';
import { getNotificationPreferences, saveNotificationPreferences } from '../services/api';

export default function NotificationSettings({ parentId }) {
  const [settings, setSettings] = useState({
    // Notification Channels
    emailNotifications: true,
    pushNotifications: false,
    inAppNotifications: true,

    // Notification Types
    activityCompleted: true,
    achievementEarned: true,
    streakReminder: true,
    weeklyReport: true,
    assessmentAlert: true,
    dailyReminder: false,
    milestoneReached: true,

    // Timing Preferences
    dailyReminderTime: '16:00', // 4 PM
    weeklyReportDay: 'Friday',
    digestMode: false, // Combine notifications into digest

    // Quiet Hours
    quietHoursEnabled: false,
    quietHoursStart: '20:00', // 8 PM
    quietHoursEnd: '08:00', // 8 AM
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load preferences from backend on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const data = await getNotificationPreferences(parentId);
        setSettings(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load notification preferences:', error);
        setLoading(false);
      }
    };

    if (parentId) {
      loadPreferences();
    }
  }, [parentId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveNotificationPreferences(parentId, settings);
      console.log('Saving notification settings:', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          Loading notification settings...
        </div>
      ) : (
        <>
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        paddingBottom: '1.5rem',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Bell size={32} color="var(--color-primary)" />
          Notification Settings
        </h1>
        <p style={{ color: '#666', margin: 0 }}>
          Choose how and when you want to receive updates about your child's progress
        </p>
      </div>

      {/* Notification Channels */}
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
          <Mail size={24} color="var(--color-primary)" />
          Notification Channels
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { key: 'emailNotifications', label: 'Email Notifications', icon: <Mail size={20} />, desc: 'Receive updates via email' },
            { key: 'pushNotifications', label: 'Push Notifications', icon: <Smartphone size={20} />, desc: 'Get instant alerts on your device' },
            { key: 'inAppNotifications', label: 'In-App Notifications', icon: <Bell size={20} />, desc: 'See notifications in the app' }
          ].map(({ key, label, icon, desc }) => (
            <div
              key={key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: '#f9f9f9',
                borderRadius: 'var(--radius-md)',
                border: settings[key] ? '2px solid var(--color-primary)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onClick={() => toggleSetting(key)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f9f9f9';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  padding: '0.8rem',
                  background: 'white',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#2D3436' }}>{label}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{desc}</div>
                </div>
              </div>

              <div style={{
                width: '50px',
                height: '26px',
                background: settings[key] ? 'var(--color-primary)' : '#ccc',
                borderRadius: '13px',
                position: 'relative',
                transition: 'background 0.3s'
              }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  background: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: settings[key] ? '26px' : '2px',
                  transition: 'left 0.3s'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Types */}
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
          <Bell size={24} color="var(--color-secondary)" />
          What to Notify You About
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {[
            { key: 'activityCompleted', label: 'Activity Completed', icon: '✅' },
            { key: 'achievementEarned', label: 'Achievement Earned', icon: '🏆' },
            { key: 'streakReminder', label: 'Streak Reminder', icon: '🔥' },
            { key: 'weeklyReport', label: 'Weekly Report', icon: '📊' },
            { key: 'assessmentAlert', label: 'Assessment Ready', icon: '📝' },
            { key: 'dailyReminder', label: 'Daily Reminder', icon: '⏰' },
            { key: 'milestoneReached', label: 'Milestone Reached', icon: '🎯' }
          ].map(({ key, label, icon }) => (
            <div
              key={key}
              onClick={() => toggleSetting(key)}
              style={{
                padding: '1rem',
                background: settings[key] ? '#FFF3E0' : '#f9f9f9',
                border: `2px solid ${settings[key] ? 'var(--color-primary)' : 'transparent'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{icon}</span>
              <span style={{
                fontWeight: '500',
                color: '#2D3436',
                flex: 1
              }}>
                {label}
              </span>
              {settings[key] ? (
                <Check size={20} color="#00b894" />
              ) : (
                <X size={20} color="#ccc" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Timing Preferences */}
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
          <Clock size={24} color="var(--color-accent)" />
          Timing Preferences
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Daily Reminder Time */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#2D3436'
            }}>
              Daily Reminder Time
            </label>
            <input
              type="time"
              value={settings.dailyReminderTime}
              onChange={(e) => setSettings({ ...settings, dailyReminderTime: e.target.value })}
              style={{
                padding: '0.8rem',
                border: '2px solid #e0e0e0',
                borderRadius: 'var(--radius-sm)',
                fontSize: '1rem',
                width: '200px'
              }}
            />
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem', margin: 0 }}>
              When would you like to receive daily practice reminders?
            </p>
          </div>

          {/* Weekly Report Day */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#2D3436'
            }}>
              Weekly Report Day
            </label>
            <select
              value={settings.weeklyReportDay}
              onChange={(e) => setSettings({ ...settings, weeklyReportDay: e.target.value })}
              style={{
                padding: '0.8rem',
                border: '2px solid #e0e0e0',
                borderRadius: 'var(--radius-sm)',
                fontSize: '1rem',
                width: '200px'
              }}
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem', margin: 0 }}>
              Which day would you like to receive the weekly progress report?
            </p>
          </div>

          {/* Digest Mode */}
          <div
            onClick={() => toggleSetting('digestMode')}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              background: '#f9f9f9',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold', color: '#2D3436', marginBottom: '0.3rem' }}>
                Digest Mode
              </div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>
                Combine notifications into a daily summary instead of instant alerts
              </div>
            </div>

            <div style={{
              width: '50px',
              height: '26px',
              background: settings.digestMode ? 'var(--color-primary)' : '#ccc',
              borderRadius: '13px',
              position: 'relative'
            }}>
              <div style={{
                width: '22px',
                height: '22px',
                background: 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: '2px',
                left: settings.digestMode ? '26px' : '2px',
                transition: 'left 0.3s'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quiet Hours */}
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
          <Clock size={24} color="#9B59B6" />
          Quiet Hours
        </h3>

        <div
          onClick={() => toggleSetting('quietHoursEnabled')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: '#f9f9f9',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            cursor: 'pointer'
          }}
        >
          <div>
            <div style={{ fontWeight: 'bold', color: '#2D3436', marginBottom: '0.3rem' }}>
              Enable Quiet Hours
            </div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>
              Pause notifications during specific hours
            </div>
          </div>

          <div style={{
            width: '50px',
            height: '26px',
            background: settings.quietHoursEnabled ? 'var(--color-primary)' : '#ccc',
            borderRadius: '13px',
            position: 'relative'
          }}>
            <div style={{
              width: '22px',
              height: '22px',
              background: 'white',
              borderRadius: '50%',
              position: 'absolute',
              top: '2px',
              left: settings.quietHoursEnabled ? '26px' : '2px',
              transition: 'left 0.3s'
            }} />
          </div>
        </div>

        {settings.quietHoursEnabled && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            padding: '1rem',
            background: '#f9f9f9',
            borderRadius: 'var(--radius-md)'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#2D3436'
              }}>
                Start Time
              </label>
              <input
                type="time"
                value={settings.quietHoursStart}
                onChange={(e) => setSettings({ ...settings, quietHoursStart: e.target.value })}
                style={{
                  padding: '0.6rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  width: '100%'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#2D3436'
              }}>
                End Time
              </label>
              <input
                type="time"
                value={settings.quietHoursEnd}
                onChange={(e) => setSettings({ ...settings, quietHoursEnd: e.target.value })}
                style={{
                  padding: '0.6rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  width: '100%'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div style={{
        position: 'sticky',
        bottom: '2rem',
        background: 'white',
        padding: '1rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          {saved && (
            <div style={{
              color: '#00b894',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Check size={18} />
              Settings saved successfully!
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '0.8rem 2rem',
            background: saving ? '#ccc' : 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: saving ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            if (!saving) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </>
      )}
    </div>
  );
}
