import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { getNotifications, markNotificationRead } from '../services/api';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const parentId = localStorage.getItem('parentId');
            if (!parentId) return;
            const data = await getNotifications(parentId);
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    // Initial fetch + polling every 30s
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleRead = async (id) => {
        try {
            await markNotificationRead(id);
            // Optimistic update
            const updated = notifications.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            );
            setNotifications(updated);
            setUnreadCount(updated.filter(n => !n.is_read).length);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={toggleOpen}
                style={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    boxShadow: 'var(--shadow-sm)'
                }}
            >
                <Bell size={24} color="#666" />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: 'var(--color-danger)',
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '50px',
                    right: '0',
                    width: '300px',
                    background: 'white',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 1000,
                    border: '1px solid #eee',
                    maxHeight: '400px',
                    overflowY: 'auto'
                }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #eee', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Notifications</span>
                        <button onClick={fetchNotifications} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--color-primary)' }}>Refresh</button>
                    </div>
                    {notifications.length === 0 ? (
                        <div style={{ padding: '1rem', textAlign: 'center', color: '#999' }}>No notifications</div>
                    ) : (
                        notifications.map(n => (
                            <div key={n.id}
                                style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid #f5f5f5',
                                    background: n.is_read ? 'white' : '#f0f9ff',
                                    cursor: 'pointer'
                                }}
                                onClick={() => !n.is_read && handleRead(n.id)}
                            >
                                <div style={{ fontWeight: n.is_read ? 'normal' : 'bold', marginBottom: '0.2rem' }}>{n.title}</div>
                                <div style={{ fontSize: '0.9rem', color: '#555' }}>{n.message}</div>
                                <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '0.5rem' }}>
                                    {new Date(n.created_at).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
