import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Baby, Plus, ChevronDown, X } from 'lucide-react';
import { createChild } from '../services/api';

export default function ChildSwitcher() {
    const { user, children, selectedChild, switchChild, addChild } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newChildName, setNewChildName] = useState('');
    const [newChildAge, setNewChildAge] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddChild = async (e) => {
        e.preventDefault();
        if (!newChildName || !newChildAge) return;

        // Confirm with user that assessment will be required
        const confirmed = window.confirm(
            `${newChildName} will be added to your account and will need to complete a short assessment to determine their reading level. Continue?`
        );

        if (!confirmed) return;

        setLoading(true);
        try {
            const child = await createChild(user.id, newChildName, parseInt(newChildAge));
            addChild(child);

            // Navigate to assessment for the new child
            setShowAddForm(false);
            setNewChildName('');
            setNewChildAge('');

            // Navigate to assessment with the new child
            window.location.href = '/assessment';
        } catch (error) {
            console.error('Error adding child:', error);
            alert('Failed to add child. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (children.length === 0) {
        return null;
    }

    return (
        <div style={{ position: 'relative' }}>
            {/* Selected Child Display */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.8rem 1.2rem',
                    background: 'white',
                    border: '2px solid var(--color-primary)',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: 'var(--color-primary)',
                    transition: 'all 0.2s',
                    boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
                <Baby size={20} />
                <span>{selectedChild?.name || 'Select Child'}</span>
                <ChevronDown size={16} style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '0.5rem',
                    background: 'white',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    minWidth: '250px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    border: '1px solid #eee'
                }}>
                    {/* Children List */}
                    <div style={{ padding: '0.5rem' }}>
                        {children.map(child => (
                            <button
                                key={child.id}
                                onClick={() => {
                                    switchChild(child);
                                    setIsOpen(false);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    width: '100%',
                                    padding: '0.8rem 1rem',
                                    border: 'none',
                                    background: selectedChild?.id === child.id ? 'var(--color-primary)' : 'transparent',
                                    color: selectedChild?.id === child.id ? 'white' : 'var(--color-dark)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: selectedChild?.id === child.id ? 'bold' : 'normal',
                                    marginBottom: '0.3rem',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedChild?.id !== child.id) {
                                        e.target.style.background = '#f5f5f5';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedChild?.id !== child.id) {
                                        e.target.style.background = 'transparent';
                                    }
                                }}
                            >
                                <Baby size={18} />
                                <div style={{ textAlign: 'left', flex: 1 }}>
                                    <div>{child.name}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                        Age: {child.age} • Level: {child.current_level}
                                    </div>
                                </div>
                                {selectedChild?.id === child.id && <span>✓</span>}
                            </button>
                        ))}

                        {/* Add Child Button */}
                        <button
                            onClick={() => {
                                setShowAddForm(true);
                                setIsOpen(false);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                width: '100%',
                                padding: '0.8rem 1rem',
                                border: '2px dashed var(--color-secondary)',
                                background: 'transparent',
                                color: 'var(--color-secondary)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                marginTop: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'var(--color-secondary)';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = 'var(--color-secondary)';
                            }}
                        >
                            <Plus size={18} />
                            Add Another Child
                        </button>
                    </div>
                </div>
            )}

            {/* Add Child Modal */}
            {showAddForm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-lg)',
                        width: '100%',
                        maxWidth: '400px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>Add Another Child</h2>
                            <button
                                onClick={() => setShowAddForm(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                            >
                                <X size={24} color="#666" />
                            </button>
                        </div>

                        <form onSubmit={handleAddChild}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Child's Name</label>
                                <input
                                    type="text"
                                    value={newChildName}
                                    onChange={(e) => setNewChildName(e.target.value)}
                                    required
                                    placeholder="Enter child's name"
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '2px solid #eee',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Age</label>
                                <input
                                    type="number"
                                    value={newChildAge}
                                    onChange={(e) => setNewChildAge(e.target.value)}
                                    required
                                    min="2"
                                    max="8"
                                    placeholder="Age (2-8)"
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '2px solid #eee',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'var(--color-primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? 'Adding...' : 'Add Child'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
