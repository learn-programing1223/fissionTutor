import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyDzh2pBQu64_pKPaRtyvJaHvraF-S0HrVk",
    authDomain: "tutorsite-868a1.firebaseapp.com",
    projectId: "tutorsite-868a1",
    storageBucket: "tutorsite-868a1.appspot.com",
    messagingSenderId: "449329953509",
    appId: "1:449329953509:web:17468ba73e901e03b7320c",
    measurementId: "G-26L68KYGYT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();

// Sign up function
async function signUp(email, password, role = 'student') {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create user profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email: email,
            role: role,
            freeSessionsRemaining: role === 'student' ? 2 : 0,
            dateCreated: new Date()
        });
        
        return user;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
}

// Check user role
async function checkUserRole(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return userDoc.data().role;
        }
        return null;
    } catch (error) {
        console.error('Error checking user role:', error);
        throw error;
    }
}

// Auth state observer
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const role = await checkUserRole(user.uid);
        if (role === 'tutor') {
            // Show tutor interface
            document.querySelectorAll('.tutor-only').forEach(el => el.style.display = 'block');
        } else {
            // Show student interface
            document.querySelectorAll('.tutor-only').forEach(el => el.style.display = 'none');
        }
    }
});

// Add these event listeners after your existing code
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignUpLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');

    // Form switching
    showSignUpLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.classList.add('hidden');
        signupContainer.classList.remove('hidden');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    });

    // Login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorElement = document.getElementById('login-error');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            hideAuthModal();
        } catch (error) {
            errorElement.textContent = error.message;
        }
    });

    // Signup form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const errorElement = document.getElementById('signup-error');

        try {
            await signUp(email, password);
            hideAuthModal();
        } catch (error) {
            errorElement.textContent = error.message;
        }
    });

    // Social login handlers
    document.getElementById('google-login').addEventListener('click', async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            hideAuthModal();
        } catch (error) {
            console.error('Google login error:', error);
        }
    });

    document.getElementById('github-login').addEventListener('click', async () => {
        try {
            const provider = new GithubAuthProvider();
            await signInWithPopup(auth, provider);
            hideAuthModal();
        } catch (error) {
            console.error('GitHub login error:', error);
        }
    });

    // Add this inside your DOMContentLoaded event listener
    const toggleLoginPw = document.getElementById('toggle-login-pw');
    const toggleSignupPw = document.getElementById('toggle-signup-pw');
    const loginPassword = document.getElementById('login-password');
    const signupPassword = document.getElementById('signup-password');

    toggleLoginPw.addEventListener('click', () => {
        const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        loginPassword.setAttribute('type', type);
        toggleLoginPw.querySelector('i').classList.toggle('fa-eye');
        toggleLoginPw.querySelector('i').classList.toggle('fa-eye-slash');
    });

    toggleSignupPw.addEventListener('click', () => {
        const type = signupPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        signupPassword.setAttribute('type', type);
        toggleSignupPw.querySelector('i').classList.toggle('fa-eye');
        toggleSignupPw.querySelector('i').classList.toggle('fa-eye-slash');
    });
});

// Add this function at the top level of auth.js
function hideAuthModal() {
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.classList.remove('show');
        document.body.classList.remove('auth-required');
    }
}

// Add this function for showing the modal
function showAuthModal() {
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.classList.add('show');
        document.body.classList.add('auth-required');
    }
} 