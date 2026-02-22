// In development, use localhost. In production, use environment variable or empty string for relative URLs
const API_URL = import.meta.env.DEV
  ? 'http://localhost:8000'
  : (import.meta.env.VITE_API_URL || '');

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    console.log("getAuthHeaders token:", token); // Debug
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

export async function createParent(name, email, password) {
    const response = await fetch(`${API_URL}/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Public endpoint
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to create parent');
    }
    return response.json();
}

export async function login(email, password) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    });

    if (!response.ok) throw new Error('Login failed');
    return response.json();
}

export async function createChild(parentId, childName, childAge) {
    const response = await fetch(`${API_URL}/users/${parentId}/children`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            name: childName,
            age: childAge,
            level: "Beginner"
        })
    });
    if (!response.ok) throw new Error('Failed to create child');
    return response.json();
}

/**
 * Submit assessment results to the backend.
 * @param {object} submissionData - { child_id, answers: [{ question_id, question_content, selected_answer, correct_answer, time_spent }] }
 */
export async function submitAssessment(submissionData) {
    const response = await fetch(`${API_URL}/assessments/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(submissionData)
    });
    if (!response.ok) {
        throw new Error('Failed to submit assessment');
    }
    return response.json();
}

export async function getDashboardData(childId) {
    const response = await fetch(`${API_URL}/dashboard/${childId}`, { headers: getAuthHeaders() });
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
    }
    return response.json();
}

/**
 * Record progress for an activity
 * @param {number} childId 
 * @param {number} activityId 
 */
export async function recordActivityProgress(childId, activityId) {
    const response = await fetch(`${API_URL}/activities/progress`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            child_id: parseInt(childId),
            activity_id: parseInt(activityId),
            completion_status: "Completed",
            time_spent_minutes: 5, // Mock time or track real time
            score: 10 // Mock score assumption
        })
    });
    if (!response.ok) throw new Error('Failed to record progress');
    return response.json();
}

export async function getNotifications(parentId) {
    const response = await fetch(`${API_URL}/notifications/${parentId}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
}

export async function markNotificationRead(notificationId) {
    await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
}

export async function getNotificationPreferences(parentId) {
    const response = await fetch(`${API_URL}/notifications/${parentId}/preferences`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch notification preferences');
    return response.json();
}

export async function saveNotificationPreferences(parentId, preferences) {
    const response = await fetch(`${API_URL}/notifications/${parentId}/preferences`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(preferences)
    });
    if (!response.ok) throw new Error('Failed to save notification preferences');
    return response.json();
}

// --- Profile Management ---

export async function getParent(parentId) {
    const response = await fetch(`${API_URL}/users/${parentId}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch parent');
    return response.json();
}

export async function getChildren(parentId) {
    const response = await fetch(`${API_URL}/users/${parentId}/children`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch children');
    return response.json();
}

export async function updateParent(parentId, data) {
    const response = await fetch(`${API_URL}/users/${parentId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update parent');
    return response.json();
}

export async function updateChild(childId, data) {
    const response = await fetch(`${API_URL}/users/children/${childId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update child');
    return response.json();
}

export async function changePassword(parentId, currentPassword, newPassword) {
    const response = await fetch(`${API_URL}/users/${parentId}/change-password`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword
        })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to change password');
    }
    return response.json();
}

export async function deleteChild(childId) {
    const response = await fetch(`${API_URL}/users/children/${childId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete child');
    return response.json();
}
