import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Trophy, Clock, Calendar, TrendingUp, Settings } from 'lucide-react';
import { getNotifications, markNotificationRead } from '../services/api';

export default function NotificationCenter({ parentId }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [parentId]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications(parentId);
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    for (const notification of unread) {
      await handleMarkAsRead(notification.id);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'Achievement': return <Trophy size={20} color="#FFD700" />;
      case 'Reminder': return <Clock size={20} color="#4ECDC4" />;
      case 'Alert': return <AlertCircle size={20} color="#E74C3C" />;
      case 'Milestone': return <TrendingUp size={20} color="#00b894" />;
      case 'Activity': return <Calendar size={20} color="#9B59B6" />;
      default: return <Bell size={20} color="#666" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'Achievement': return '#FFF3E0';
      case 'Reminder': return '#E3F2FD';
      case 'Alert': return '#FFEBEE';
      case 'Milestone': return '#E8F5E9';
      case 'Activity': return '#F3E5F5';
      default: return '#F5F5F5';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'white',
          border: 'none',
          padding: '0.6rem',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)',
          width: '40px',
          height: '40px',
          position: 'relative',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }}
      >
        <Bell size={20} color="#666" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <div style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#E74C3C',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            border: '2px solid white'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
          />

          {/* Panel */}
          <div style={{
            position: 'absolute',
            top: '50px',
            right: 0,
            width: '400px',
            maxHeight: '600px',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            zIndex: 1000,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #667eea15, #764ba215)'
            }}>
              <div>
                <h3 style={{ margin: 0, color: '#2D3436', fontSize: '1.2rem' }}>
                  Notifications
                </h3>
                <p style={{ margin: '0.3rem 0 0', color: '#666', fontSize: '0.85rem' }}>
                  {unreadCount} unread
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                  style={{
                    padding: '0.5rem 0.8rem',
                    background: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    cursor: unreadCount > 0 ? 'pointer' : 'not-allowed',
                    opacity: unreadCount > 0 ? 1 : 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    color: '#666'
                  }}
                >
                  <Check size={14} />
                  Mark all read
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={20} color="#666" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem'
            }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  color: '#999'
                }}>
                  <Bell size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                  <p style={{ margin: 0 }}>No notifications yet</p>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem' }}>
                    You'll see updates here
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        background: notification.is_read ? '#f9f9f9' : getNotificationColor(notification.notification_type),
                        border: notification.is_read ? '1px solid #f0f0f0' : '2px solid var(--color-primary)',
                        cursor: !notification.is_read ? 'pointer' : 'default',
                        transition: 'all 0.2s',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (!notification.is_read) {
                          e.currentTarget.style.transform = 'translateX(4px)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Unread Indicator */}
                      {!notification.is_read && (
                        <div style={{
                          position: 'absolute',
                          left: '0.5rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '8px',
                          height: '8px',
                          background: 'var(--color-primary)',
                          borderRadius: '50%'
                        }} />
                      )}

                      <div style={{ display: 'flex', gap: '1rem', marginLeft: !notification.is_read ? '1rem' : 0 }}>
                        {/* Icon */}
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: 'white',
                          borderRadius: 'var(--radius-full)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {getNotificationIcon(notification.notification_type)}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '0.3rem'
                          }}>
                            <h4 style={{
                              margin: 0,
                              fontSize: '0.95rem',
                              fontWeight: notification.is_read ? 'normal' : 'bold',
                              color: '#2D3436'
                            }}>
                              {notification.notification_type}
                            </h4>

                            {!notification.is_read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '0.2rem',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                                title="Mark as read"
                              >
                                <Check size={14} color="#00b894" />
                              </button>
                            )}
                          </div>

                          <p style={{
                            margin: 0,
                            fontSize: '0.9rem',
                            color: '#666',
                            lineHeight: '1.4'
                          }}>
                            {notification.message}
                          </p>

                          <p style={{
                            margin: '0.5rem 0 0',
                            fontSize: '0.75rem',
                            color: '#999'
                          }}>
                            {notification.sent_time && new Date(notification.sent_time).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '1rem',
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => {
                  // Navigate to settings page and open notification settings tab
                  setIsOpen(false);
                  window.location.href = '/settings?tab=notifications';
                }}
                style={{
                  padding: '0.6rem 1.2rem',
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#666',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.color = '#666';
                }}
              >
                <Settings size={16} />
                Notification Settings
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
