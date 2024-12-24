// Simple user management
let users = JSON.parse(localStorage.getItem('users')) || [];
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Check if user is logged in (add to index.html)
function checkAuth() {
    if (!currentUser) {
        window.location.href = 'login.html';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        console.log('Attempting login with:', { email }); // Log login attempt

        const response = await api.login(email, password);
        console.log('Login response:', response); // Log server response
        
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            window.location.href = 'index.html';
        } else {
            alert(response.message || 'Login failed');
        }
    } catch (err) {
        console.error('Login error:', err); // Log any errors
        alert('Login failed. Please try again.');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    try {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await api.register(name, email, password);
        
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            window.location.href = 'index.html';
        } else {
            alert(response.message || 'Registration failed');
        }
    } catch (err) {
        alert('Registration failed. Please try again.');
    }
}

// Add event listeners
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
} 