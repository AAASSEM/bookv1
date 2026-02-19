import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createParent, createChild, login } from '../services/api';
import { Baby, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
    const navigate = useNavigate();
    const { login: authLogin, addChild } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [parentName, setParentName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [childName, setChildName] = useState('');
    const [childAge, setChildAge] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Create Parent
            console.log("Step 1: Creating parent account...");
            await createParent(parentName, email, password);
            console.log("Parent created successfully");

            // 1b. Login to get token (Required for creating child)
            console.log("Step 2: Logging in...");
            const loginData = await login(email, password);
            console.log("Login successful, received data:", loginData);

            if (!loginData.access_token) {
                console.error("No access token in login response!");
                throw new Error("Authentication failed: No token received");
            }

            const parentId = loginData.parent_id;
            console.log("Extracted parentId:", parentId);

            if (!parentId) {
                console.error("parent_id is missing in login response!");
                throw new Error("Authentication failed: No parent ID received");
            }

            localStorage.setItem('token', loginData.access_token);
            localStorage.setItem('parentId', parentId);
            localStorage.setItem('parentName', loginData.parent_name);

            console.log("Token and parent ID stored in localStorage");
            console.log("Token:", localStorage.getItem('token'));
            console.log("Parent ID:", localStorage.getItem('parentId'));

            // 2. Create Child
            console.log("Step 3: Creating child...");
            console.log("Creating child with parentId:", parentId, "childName:", childName, "childAge:", childAge);
            const child = await createChild(parentId, childName, parseInt(childAge));
            console.log("Child created successfully:", child);

            // Use AuthContext methods to manage child state
            addChild(child);

            // 3. Go to Assessment
            console.log("Step 4: Navigating to assessment...");
            navigate('/assessment');
        } catch (error) {
            console.error("Error in signup:", error);
            alert(error.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #FFF3E0 0%, #E0F7FA 100%)',
            padding: '2rem'
        }}>
            <div style={{
                background: 'white',
                padding: '3rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                width: '100%',
                maxWidth: '500px'
            }}>
                <h1 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                    Welcome to BrightBook!
                </h1>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
                    Let's get set up for your reading journey.
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Parent Details */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2d3436', marginBottom: '1rem' }}>
                            <User size={20} /> Parent Details
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={parentName}
                                onChange={e => setParentName(e.target.value)}
                                required
                                style={{
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '2px solid #eee',
                                    fontSize: '1rem'
                                }}
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={{
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '2px solid #eee',
                                    fontSize: '1rem'
                                }}
                            />
                            <input
                                type="password"
                                placeholder="Create Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                style={{
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '2px solid #eee',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>

                    {/* Child Details */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2d3436', marginBottom: '1rem' }}>
                            <Baby size={20} /> Child Details
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Child's Name"
                                value={childName}
                                onChange={e => setChildName(e.target.value)}
                                required
                                style={{
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '2px solid #eee',
                                    fontSize: '1rem'
                                }}
                            />
                            <input
                                type="number"
                                placeholder="Age"
                                value={childAge}
                                onChange={e => setChildAge(e.target.value)}
                                required
                                min="2"
                                max="8"
                                style={{
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '2px solid #eee',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
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
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {loading ? 'Creating...' : 'Start Adventure'} <ArrowRight size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
