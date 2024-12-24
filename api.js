const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://to-due.onrender.com'
    : 'http://localhost:5001/api';

const api = {
    // Auth endpoints
    login: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return res.json();
    },

    register: async (name, email, password) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        return res.json();
    },

    // Task endpoints
    getTasks: async (token) => {
        const res = await fetch(`${API_URL}/tasks`, {
            headers: {
                'x-auth-token': token
            }
        });
        return res.json();
    },

    createTask: async (task, token) => {
        const res = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify(task)
        });
        return res.json();
    },

    updateTask: async (taskId, updates, token) => {
        const res = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify(updates)
        });
        return res.json();
    },

    deleteTask: async (taskId, token) => {
        const res = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': token
            }
        });
        return res.json();
    }
}; 