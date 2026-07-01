// ============================================
// Weather Dashboard - Login Page JavaScript
// Authentication Logic
// ============================================

// DOM Elements
const loginToggle = document.getElementById('loginToggle');
const registerToggle = document.getElementById('registerToggle');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const toastContainer = document.getElementById('toastContainer');

// Password Toggle Elements
const loginPasswordToggle = document.getElementById('loginPasswordToggle');
const registerPasswordToggle = document.getElementById('registerPasswordToggle');
const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');

// Form Input Elements
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const registerUsername = document.getElementById('registerUsername');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const confirmPassword = document.getElementById('confirmPassword');
const rememberMe = document.getElementById('rememberMe');

// ============================================
// Toggle Between Login and Register Forms
// ============================================
loginToggle.addEventListener('click', () => {
    loginToggle.classList.add('active');
    registerToggle.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    clearValidationMessages();
});

registerToggle.addEventListener('click', () => {
    registerToggle.classList.add('active');
    loginToggle.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    clearValidationMessages();
});

// ============================================
// Password Toggle Functionality
// ============================================
function togglePassword(inputElement, toggleElement) {
    if (inputElement.type === 'password') {
        inputElement.type = 'text';
        toggleElement.textContent = '🙈';
    } else {
        inputElement.type = 'password';
        toggleElement.textContent = '👁️';
    }
}

loginPasswordToggle.addEventListener('click', () => {
    togglePassword(loginPassword, loginPasswordToggle);
});

registerPasswordToggle.addEventListener('click', () => {
    togglePassword(registerPassword, registerPasswordToggle);
});

confirmPasswordToggle.addEventListener('click', () => {
    togglePassword(confirmPassword, confirmPasswordToggle);
});

// ============================================
// Fetch Default Users from users.json
// ============================================
async function getDefaultUsers() {
    try {
        const response = await fetch('users.json');
        const data = await response.json();
        return data.users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

// ============================================
// Get Users from localStorage
// ============================================
function getLocalUsers() {
    const users = localStorage.getItem('weatherAppUsers');
    return users ? JSON.parse(users) : [];
}

// ============================================
// Save User to localStorage
// ============================================
function saveLocalUser(user) {
    const users = getLocalUsers();
    users.push(user);
    localStorage.setItem('weatherAppUsers', JSON.stringify(users));
}

// ============================================
// Validate Login Credentials
// ============================================
async function validateLogin(username, password) {
    const defaultUsers = await getDefaultUsers();
    const localUsers = getLocalUsers();
    const allUsers = [...defaultUsers, ...localUsers];

    const user = allUsers.find(u => 
        u.username === username && u.password === password
    );

    return user;
}

// ============================================
// Form Validation
// ============================================
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function showValidationMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `validation-message ${type}`;
}

function clearValidationMessages() {
    const messages = document.querySelectorAll('.validation-message');
    messages.forEach(msg => {
        msg.textContent = '';
        msg.className = 'validation-message';
    });

    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.classList.remove('error', 'success');
    });
}

function setInputStatus(input, status) {
    input.classList.remove('error', 'success');
    if (status) {
        input.classList.add(status);
    }
}

// ============================================
// Login Form Submission
// ============================================
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = loginUsername.value.trim();
    const password = loginPassword.value;

    // Clear previous validation
    clearValidationMessages();

    // Validate inputs
    let isValid = true;

    if (!username) {
        showValidationMessage('loginUsernameError', 'Username is required', 'error');
        setInputStatus(loginUsername, 'error');
        isValid = false;
    }

    if (!password) {
        showValidationMessage('loginPasswordError', 'Password is required', 'error');
        setInputStatus(loginPassword, 'error');
        isValid = false;
    }

    if (!isValid) return;

    // Show loading state
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;

    // Validate credentials
    const user = await validateLogin(username, password);

    // Hide loading state
    loginBtn.classList.remove('loading');
    loginBtn.disabled = false;

    if (user) {
        // Successful login
        showToast('Login successful!', 'success');
        
        // Save logged in user
        localStorage.setItem('loggedInUser', JSON.stringify({
            username: user.username,
            email: user.email
        }));

        // Save remember me preference
        if (rememberMe.checked) {
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('rememberMe');
        }

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        // Failed login
        showValidationMessage('loginPasswordError', 'Invalid username or password', 'error');
        setInputStatus(loginPassword, 'error');
        showToast('Invalid credentials', 'error');
    }
});

// ============================================
// Register Form Submission
// ============================================
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = registerUsername.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value;
    const confirmPass = confirmPassword.value;

    // Clear previous validation
    clearValidationMessages();

    // Validate inputs
    let isValid = true;

    if (!username) {
        showValidationMessage('registerUsernameError', 'Username is required', 'error');
        setInputStatus(registerUsername, 'error');
        isValid = false;
    } else if (username.length < 3) {
        showValidationMessage('registerUsernameError', 'Username must be at least 3 characters', 'error');
        setInputStatus(registerUsername, 'error');
        isValid = false;
    }

    if (!email) {
        showValidationMessage('registerEmailError', 'Email is required', 'error');
        setInputStatus(registerEmail, 'error');
        isValid = false;
    } else if (!validateEmail(email)) {
        showValidationMessage('registerEmailError', 'Please enter a valid email', 'error');
        setInputStatus(registerEmail, 'error');
        isValid = false;
    }

    if (!password) {
        showValidationMessage('registerPasswordError', 'Password is required', 'error');
        setInputStatus(registerPassword, 'error');
        isValid = false;
    } else if (!validatePassword(password)) {
        showValidationMessage('registerPasswordError', 'Password must be at least 6 characters', 'error');
        setInputStatus(registerPassword, 'error');
        isValid = false;
    }

    if (!confirmPass) {
        showValidationMessage('confirmPasswordError', 'Please confirm your password', 'error');
        setInputStatus(confirmPassword, 'error');
        isValid = false;
    } else if (password !== confirmPass) {
        showValidationMessage('confirmPasswordError', 'Passwords do not match', 'error');
        setInputStatus(confirmPassword, 'error');
        isValid = false;
    }

    if (!isValid) return;

    // Check if username already exists
    const defaultUsers = await getDefaultUsers();
    const localUsers = getLocalUsers();
    const allUsers = [...defaultUsers, ...localUsers];

    if (allUsers.some(u => u.username === username)) {
        showValidationMessage('registerUsernameError', 'Username already exists', 'error');
        setInputStatus(registerUsername, 'error');
        showToast('Username already taken', 'error');
        return;
    }

    if (allUsers.some(u => u.email === email)) {
        showValidationMessage('registerEmailError', 'Email already registered', 'error');
        setInputStatus(registerEmail, 'error');
        showToast('Email already registered', 'error');
        return;
    }

    // Show loading state
    registerBtn.classList.add('loading');
    registerBtn.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
        // Create new user
        const newUser = {
            username: username,
            email: email,
            password: password
        };

        // Save to localStorage
        saveLocalUser(newUser);

        // Hide loading state
        registerBtn.classList.remove('loading');
        registerBtn.disabled = false;

        // Show success message
        showToast('Registration successful! Please login.', 'success');

        // Switch to login form
        setTimeout(() => {
            loginToggle.click();
            // Pre-fill login form
            loginUsername.value = username;
            loginPassword.value = '';
        }, 1500);
    }, 1000);
});

// ============================================
// Forgot Password
// ============================================
document.getElementById('forgotPassword').addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Password reset feature coming soon!', 'warning');
});

// ============================================
// Toast Notifications
// ============================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '';
    if (type === 'success') icon = '✓';
    else if (type === 'error') icon = '✕';
    else if (type === 'warning') icon = '⚠';

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}

// ============================================
// Check for Remembered User
// ============================================
function checkRememberedUser() {
    const remembered = localStorage.getItem('rememberMe');
    if (remembered === 'true') {
        const savedUser = localStorage.getItem('loggedInUser');
        if (savedUser) {
            rememberMe.checked = true;
        }
    }
}

// ============================================
// Input Validation on Blur
// ============================================
loginUsername.addEventListener('blur', () => {
    if (loginUsername.value.trim()) {
        setInputStatus(loginUsername, 'success');
    }
});

loginPassword.addEventListener('blur', () => {
    if (loginPassword.value) {
        setInputStatus(loginPassword, 'success');
    }
});

registerUsername.addEventListener('blur', () => {
    const value = registerUsername.value.trim();
    if (value) {
        if (value.length >= 3) {
            setInputStatus(registerUsername, 'success');
        } else {
            showValidationMessage('registerUsernameError', 'Username must be at least 3 characters', 'error');
            setInputStatus(registerUsername, 'error');
        }
    }
});

registerEmail.addEventListener('blur', () => {
    const value = registerEmail.value.trim();
    if (value) {
        if (validateEmail(value)) {
            setInputStatus(registerEmail, 'success');
        } else {
            showValidationMessage('registerEmailError', 'Please enter a valid email', 'error');
            setInputStatus(registerEmail, 'error');
        }
    }
});

registerPassword.addEventListener('blur', () => {
    const value = registerPassword.value;
    if (value) {
        if (value.length >= 6) {
            setInputStatus(registerPassword, 'success');
        } else {
            showValidationMessage('registerPasswordError', 'Password must be at least 6 characters', 'error');
            setInputStatus(registerPassword, 'error');
        }
    }
});

confirmPassword.addEventListener('blur', () => {
    const value = confirmPassword.value;
    const password = registerPassword.value;
    if (value) {
        if (value === password) {
            setInputStatus(confirmPassword, 'success');
        } else {
            showValidationMessage('confirmPasswordError', 'Passwords do not match', 'error');
            setInputStatus(confirmPassword, 'error');
        }
    }
});

// ============================================
// Enter Key Support
// ============================================
loginForm.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        loginBtn.click();
    }
});

registerForm.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        registerBtn.click();
    }
});

// ============================================
// Social Login Buttons (Placeholder)
// ============================================
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const provider = btn.classList.contains('google') ? 'Google' : 
                         btn.classList.contains('apple') ? 'Apple' : 'Facebook';
        showToast(`${provider} login coming soon!`, 'warning');
    });
});

// ============================================
// Account Link Navigation
// ============================================
const createAccountLink = document.getElementById('createAccountLink');
const loginAccountLink = document.getElementById('loginAccountLink');

if (createAccountLink) {
    createAccountLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerToggle.click();
    });
}

if (loginAccountLink) {
    loginAccountLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginToggle.click();
    });
}

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    checkRememberedUser();
});
