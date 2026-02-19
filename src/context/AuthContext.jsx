import React, { createContext, useState, useContext, useEffect } from 'react';
import { getChildren } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children: childrenProp }) => {
    console.log('🔴 AUTHCONTEXT FILE LOADING - AuthProvider component is mounting');
    const [user, setUser] = useState(null);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('AuthContext: useEffect running'); // Debug

        // Check for token on mount
        const token = localStorage.getItem('token');
        const parentId = localStorage.getItem('parentId');
        const parentName = localStorage.getItem('parentName');
        const savedChildId = localStorage.getItem('childId');

        console.log('LocalStorage data:', { token, parentId, parentName, savedChildId }); // Debug

        const initializeAuth = async () => {
            console.log('initializeAuth called'); // Debug

            if (token && parentId) {
                console.log('Token and parentId exist, setting user'); // Debug
                setUser({ id: parseInt(parentId), name: parentName, token });

                // Load all children for this parent
                try {
                    console.log('Fetching children for parent:', parentId); // Debug
                    const childrenData = await getChildren(parseInt(parentId));
                    console.log('Loaded children:', childrenData); // Debug
                    setChildren(childrenData);

                    // Set selected child from localStorage or first child
                    if (childrenData.length > 0) {
                        const childToSelect = savedChildId
                            ? childrenData.find(c => c.id === parseInt(savedChildId)) || childrenData[0]
                            : childrenData[0];
                        console.log('Selecting child:', childToSelect); // Debug
                        setSelectedChild(childToSelect);
                    } else {
                        console.log('No children found in response'); // Debug
                    }
                } catch (error) {
                    console.error('Error loading children:', error);
                }
            } else {
                console.log('No token or parentId found'); // Debug
            }
            // Only set loading to false AFTER everything is loaded
            setLoading(false);
            console.log('AuthContext initialized, loading set to false'); // Debug
        };

        initializeAuth();
    }, []);

    const login = async (data) => {
        // Data = { access_token, parent_id, parent_name }
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('parentId', data.parent_id.toString());
        localStorage.setItem('parentName', data.parent_name);

        setUser({
            id: data.parent_id, // This should already be an integer from the backend
            name: data.parent_name,
            token: data.access_token
        });

        // Load children immediately after login
        try {
            const childrenData = await getChildren(data.parent_id);
            setChildren(childrenData);

            // Auto-select first child
            if (childrenData.length > 0) {
                setSelectedChild(childrenData[0]);
                localStorage.setItem('childId', childrenData[0].id.toString());
                localStorage.setItem('childName', childrenData[0].name);
                localStorage.setItem('childLevel', childrenData[0].current_level);
            }
        } catch (error) {
            console.error('Error loading children after login:', error);
        }

        setLoading(false);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        setChildren([]);
        setSelectedChild(null);
        window.location.href = '/login'; // Force redirect
    };

    const switchChild = (child) => {
        setSelectedChild(child);
        localStorage.setItem('childId', child.id);
        localStorage.setItem('childName', child.name);
        localStorage.setItem('childLevel', child.current_level);
    };

    const addChild = (child) => {
        setChildren([...children, child]);
        if (children.length === 0) {
            // If this is the first child, select them
            switchChild(child);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            children,
            selectedChild,
            switchChild,
            addChild,
            login,
            logout,
            loading
        }}>
            {!loading && childrenProp}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
