import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDzh2pBQu64_pKPaRtyvJaHvraF-S0HrVk",
    authDomain: "tutorsite-868a1.firebaseapp.com",  // Updated this line
    projectId: "tutorsite-868a1",
    storageBucket: "tutorsite-868a1.appspot.com",  // Fixed this line
    messagingSenderId: "449329953509",
    appId: "1:449329953509:web:17468ba73e901e03b7320c",
    measurementId: "G-26L68KYGYT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// UI Elements
const loginContainer = document.getElementById("login-container");
const signupContainer = document.getElementById("signup-container");
const loadingOverlay = document.getElementById("loading-overlay");

// Form Elements
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

// Toggle Elements
const showSignUpLink = document.getElementById("show-signup");
const showLoginLink = document.getElementById("show-login");
const toggleLoginPw = document.getElementById("toggle-login-pw");
const toggleSignUpPw = document.getElementById("toggle-signup-pw");

// Social Login Buttons
const googleLoginBtn = document.getElementById("google-login");
const githubLoginBtn = document.getElementById("github-login");
const facebookLoginBtn = document.getElementById("facebook-login");

// Loading State Management
const showLoading = (show = true) => {
    loadingOverlay.classList.toggle('visible', show);
};

// Error Handling
const showError = (elementId, message) => {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('visible');
    setTimeout(() => {
        errorElement.classList.remove('visible');
    }, 5000);
};

// Form Switching Animation
const switchForm = (showLogin) => {
    if (showLogin) {
        signupContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    } else {
        loginContainer.classList.add('hidden');
        signupContainer.classList.remove('hidden');
    }
};

// Event Listeners for Form Switching
showSignUpLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchForm(false);
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchForm(true);
});

// Password Toggle Functionality
const setupPasswordToggle = (toggleBtn, inputId) => {
    toggleBtn.addEventListener('click', () => {
        const input = document.getElementById(inputId);
        input.type = input.type === 'password' ? 'text' : 'password';
        toggleBtn.textContent = input.type === 'password' ? '👁️' : '👁️‍🗨️';
    });
};

setupPasswordToggle(toggleLoginPw, 'login-password');
setupPasswordToggle(toggleSignUpPw, 'signup-password');

// Function to send token to backend
const sendTokenToBackend = async (token) => {
    try {
        const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
        });
        
        if (!response.ok) {
            throw new Error('Backend verification failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Backend verification error:', error);
        throw error;
    }
};

// Email/Password Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    showLoading(true);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        
        // Here you can send the token to your backend
        // await sendTokenToBackend(idToken);
        
        window.location.href = '/dashboard';
    } catch (error) {
        console.error('Login error:', error);
        showError('login-email-error', getErrorMessage(error));
    } finally {
        showLoading(false);
    }
});

// Email/Password Sign Up
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    showLoading(true);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        
        // Here you can send the token to your backend
        // await sendTokenToBackend(idToken);
        
        alert('Account created successfully! Please sign in.');
        switchForm(true);
    } catch (error) {
        console.error('Signup error:', error);
        showError('signup-email-error', getErrorMessage(error));
    } finally {
        showLoading(false);
    }
});

// Google Login
googleLoginBtn.addEventListener('click', async () => {
    showLoading(true);
    try {
        console.log('Starting Google sign-in process...');
        const provider = new GoogleAuthProvider();
        
        provider.addScope('https://www.googleapis.com/auth/userinfo.email');
        provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
        
        provider.setCustomParameters({
            prompt: 'select_account'
        });

        console.log('Initiating Google sign-in popup...');
        const result = await signInWithPopup(auth, provider);
        console.log('Sign-in successful:', result.user.email);
        
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        
        const user = result.user;
        console.log('User info retrieved:', user.displayName);

        // You can send the token to your backend here
        // await sendTokenToBackend(token);

        window.location.href = '/dashboard';
    } catch (error) {
        console.error('Detailed Google sign-in error:', error);
        console.log('Error code:', error.code);
        console.log('Error message:', error.message);
        
        switch (error.code) {
            case 'auth/popup-blocked':
                showError('login-email-error', 'Please enable popups for this website to use Google sign-in.');
                break;
            case 'auth/popup-closed-by-user':
                showError('login-email-error', 'Sign-in was cancelled. Please try again.');
                break;
            case 'auth/cancelled-popup-request':
                showError('login-email-error', 'Only one sign-in window can be open at a time.');
                break;
            case 'auth/unauthorized-domain':
                showError('login-email-error', 'This domain is not authorized for Google sign-in. Please contact support.');
                break;
            default:
                showError('login-email-error', 'An error occurred during sign-in. Please try again later.');
        }
    } finally {
        showLoading(false);
    }
});

// GitHub Login (disabled for now)
githubLoginBtn.addEventListener('click', () => {
    showError('login-email-error', 'GitHub login will be available soon.');
});

// Facebook Login (disabled for now)
facebookLoginBtn.addEventListener('click', () => {
    showError('login-email-error', 'Facebook login will be available soon.');
});

// Error Message Handler
const getErrorMessage = (error) => {
    switch (error.code) {
        case 'auth/invalid-email':
            return 'Invalid email address format.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/email-already-in-use':
            return 'Email already in use. Try logging in instead.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/popup-closed-by-user':
            return 'Login popup was closed before completion.';
        default:
            return 'An error occurred. Please try again.';
    }
};

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is signed in:', user.email);
    } else {
        console.log('User is signed out');
    }
});