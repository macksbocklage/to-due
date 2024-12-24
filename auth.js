// Simple user management
let users = JSON.parse(localStorage.getItem('users')) || [];
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Check if user is logged in (add to index.html)
function checkAuth() {
    if (!currentUser) {
        window.location.href = 'login.html';
    }
}

// Login handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'index.html';
        } else {
            alert('Invalid email or password');
        }
    });
}

// Register handler
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (users.find(u => u.email === email)) {
            alert('Email already registered');
            return;
        }

        const user = {
            id: Date.now(),
            name,
            email,
            password // In a real app, this should be hashed
        };

        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    });
} 