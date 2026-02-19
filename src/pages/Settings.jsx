import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Save, Baby, Lock, Trash2, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { getParent, getChildren, updateParent, updateChild, changePassword, deleteChild } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
    const navigate = useNavigate();
    const { children, setChildren } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('parent');

    // Parent Data
    const [parent, setParent] = useState({ name: '', email: '', phone_number: '' });

    // Password Change
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [passwordError, setPasswordError] = useState('');

    // Children Data
    const [childrenList, setChildrenList] = useState([]);

    // UI State
    const [statusMsg, setStatusMsg] = useState('');
    const [statusType, setStatusType] = useState('success'); // 'success' or 'error'

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const parentId = localStorage.getItem('parentId');
            if (!parentId) {
                navigate('/');
                return;
            }

            const pData = await getParent(parentId);
            setParent({
                name: pData.name,
                email: pData.email,
                phone_number: pData.phone_number || ''
            });

            const cData = await getChildren(parentId);
            setChildrenList(cData);
        } catch (error) {
            console.error("Failed to load settings data", error);
            showStatus('Failed to load settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showStatus = (msg, type = 'success') => {
        setStatusMsg(msg);
        setStatusType(type);
        setTimeout(() => setStatusMsg(''), 3000);
    };

    const handleParentSubmit = async (e) => {
        e.preventDefault();
        setStatusMsg('');
        try {
            const parentId = localStorage.getItem('parentId');
            await updateParent(parentId, parent);
            showStatus('Parent profile updated successfully!', 'success');
        } catch (error) {
            showStatus('Failed to update parent profile.', 'error');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');

        if (passwordData.new !== passwordData.confirm) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordData.new.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        try {
            const parentId = localStorage.getItem('parentId');
            await changePassword(parentId, passwordData.current, passwordData.new);
            showStatus('Password changed successfully!', 'success');
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (error) {
            setPasswordError(error.message || 'Failed to change password');
        }
    };

    const handleChildUpdate = async (childId, field, value) => {
        const updatedChildren = childrenList.map(c =>
            c.id === childId ? { ...c, [field]: value } : c
        );
        setChildrenList(updatedChildren);
    };

    const saveChild = async (child) => {
        try {
            await updateChild(child.id, {
                name: child.name,
                age: child.age,
                native_language: child.native_language,
                date_of_birth: child.date_of_birth
            });
            showStatus(`Saved changes for ${child.name}!`, 'success');
        } catch (error) {
            showStatus('Failed to update child.', 'error');
        }
    };

    const handleDeleteChild = async (child) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${child.name}'s profile? This action cannot be undone and all their progress will be lost.`
        );

        if (!confirmed) return;

        try {
            await deleteChild(child.id);
            showStatus(`${child.name}'s profile deleted successfully`, 'success');

            // Remove from local state
            const updatedChildren = childrenList.filter(c => c.id !== child.id);
            setChildrenList(updatedChildren);

            // Update AuthContext
            if (setChildren) {
                setChildren(updatedChildren);
            }
        } catch (error) {
            showStatus('Failed to delete child profile.', 'error');
        }
    };

    const handleRetakeAssessment = (child) => {
        if (window.confirm(`${child.name} will retake the assessment to determine their new reading level. Continue?`)) {
            // Store child ID for assessment and navigate
            localStorage.setItem('childId', child.id);
            navigate('/assessment');
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading settings...</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#eee'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ margin: 0 }}>Settings</h1>
            </div>

            {/* Status Message */}
            {statusMsg && (
                <div style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: statusType === 'error' ? '#fee2e2' : '#e0f2f1',
                    color: statusType === 'error' ? '#dc2626' : '#047857',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {statusType === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                    {statusMsg}
                </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #eee' }}>
                <button
                    onClick={() => setActiveTab('parent')}
                    style={{
                        padding: '1rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'parent' ? '3px solid var(--color-primary)' : '3px solid transparent',
                        fontWeight: 'bold',
                        color: activeTab === 'parent' ? 'var(--color-primary)' : '#888',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        transition: 'all 0.2s'
                    }}
                >
                    <User size={20} /> Parent Profile
                </button>
                <button
                    onClick={() => setActiveTab('password')}
                    style={{
                        padding: '1rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'password' ? '3px solid var(--color-primary)' : '3px solid transparent',
                        fontWeight: 'bold',
                        color: activeTab === 'password' ? 'var(--color-primary)' : '#888',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        transition: 'all 0.2s'
                    }}
                >
                    <Lock size={20} /> Change Password
                </button>
                <button
                    onClick={() => setActiveTab('children')}
                    style={{
                        padding: '1rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'children' ? '3px solid var(--color-primary)' : '3px solid transparent',
                        fontWeight: 'bold',
                        color: activeTab === 'children' ? 'var(--color-primary)' : '#888',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        transition: 'all 0.2s'
                    }}
                >
                    <Baby size={20} /> Children Profiles
                </button>
            </div>

            {/* Content */}
            {activeTab === 'parent' && (
                <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Edit Your Profile</h2>
                    <form onSubmit={handleParentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>
                                Your Name
                            </label>
                            <input
                                type="text"
                                value={parent.name}
                                onChange={e => setParent({ ...parent, name: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '2px solid #ddd',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={parent.email}
                                onChange={e => setParent({ ...parent, email: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '2px solid #ddd',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>
                                Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                value={parent.phone_number}
                                onChange={e => setParent({ ...parent, phone_number: e.target.value })}
                                placeholder="+1 234 567 8900"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '2px solid #ddd',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                alignSelf: 'flex-start',
                                background: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                padding: '1rem 2rem',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                gap: '0.5rem',
                                alignItems: 'center',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            <Save size={20} /> Update Profile
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'password' && (
                <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Change Password</h2>
                    <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={passwordData.current}
                                onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '2px solid #ddd',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>
                                New Password
                            </label>
                            <input
                                type="password"
                                value={passwordData.new}
                                onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                                placeholder="Minimum 6 characters"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '2px solid #ddd',
                                    fontSize: '1rem'
                                }}
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={passwordData.confirm}
                                onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '2px solid #ddd',
                                    fontSize: '1rem'
                                }}
                                required
                                minLength={6}
                            />
                        </div>

                        {passwordError && (
                            <div style={{
                                padding: '0.8rem',
                                borderRadius: 'var(--radius-sm)',
                                background: '#fee2e2',
                                color: '#dc2626',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <AlertCircle size={16} /> {passwordError}
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{
                                alignSelf: 'flex-start',
                                background: 'var(--color-secondary)',
                                color: 'white',
                                border: 'none',
                                padding: '1rem 2rem',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                gap: '0.5rem',
                                alignItems: 'center',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            <Lock size={20} /> Change Password
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'children' && (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {childrenList.map(child => (
                        <div key={child.id} style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                                <h3 style={{ margin: 0 }}>Edit {child.name}</h3>
                                <button
                                    onClick={() => handleDeleteChild(child)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.6rem 1rem',
                                        background: '#fee2e2',
                                        color: '#dc2626',
                                        border: 'none',
                                        borderRadius: 'var(--radius-full)',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => { e.target.style.background = '#dc2626'; e.target.style.color = 'white'; }}
                                    onMouseLeave={(e) => { e.target.style.background = '#fee2e2'; e.target.style.color = '#dc2626'; }}
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Name</label>
                                    <input
                                        type="text"
                                        value={child.name}
                                        onChange={e => handleChildUpdate(child.id, 'name', e.target.value)}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '2px solid #ddd' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Age</label>
                                    <input
                                        type="number"
                                        value={child.age}
                                        onChange={e => handleChildUpdate(child.id, 'age', parseInt(e.target.value))}
                                        min="2"
                                        max="12"
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '2px solid #ddd' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Date of Birth</label>
                                    <input
                                        type="date"
                                        value={child.date_of_birth || ''}
                                        onChange={e => handleChildUpdate(child.id, 'date_of_birth', e.target.value)}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '2px solid #ddd' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Native Language</label>
                                    <select
                                        value={child.native_language || 'English'}
                                        onChange={e => handleChildUpdate(child.id, 'native_language', e.target.value)}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '2px solid #ddd', fontSize: '1rem' }}
                                    >
                                        <option value="English">English</option>
                                        <option value="Arabic">Arabic</option>
                                        <option value="Spanish">Spanish</option>
                                        <option value="French">French</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Current Level</label>
                                    <div style={{
                                        padding: '0.8rem',
                                        background: '#f5f5f5',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '2px solid #ddd',
                                        color: '#666',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span>{child.current_level}</span>
                                        <button
                                            onClick={() => handleRetakeAssessment(child)}
                                            style={{
                                                padding: '0.4rem 0.8rem',
                                                background: 'var(--color-accent)',
                                                color: '#333',
                                                border: 'none',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.85rem',
                                                fontWeight: 'bold',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Retake Assessment
                                        </button>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.3rem' }}>Level is determined by assessment</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => saveChild(child)}
                                    style={{
                                        background: 'var(--color-secondary)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.8rem 1.5rem',
                                        borderRadius: 'var(--radius-full)',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        gap: '0.5rem',
                                        alignItems: 'center',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </div>
                    ))}

                    {childrenList.length === 0 && (
                        <div style={{
                            padding: '3rem',
                            textAlign: 'center',
                            background: 'white',
                            borderRadius: 'var(--radius-md)',
                            color: '#888'
                        }}>
                            <Baby size={48} style={{ margin: '0 auto 1rem', color: '#ddd' }} />
                            <p>No children added yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
