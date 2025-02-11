import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const publicPages = ['/login.html']; // Add any public pages here
const currentPage = window.location.pathname;

// Check if user is authenticated
onAuthStateChanged(auth, (user) => {
    if (!user && !publicPages.includes(currentPage)) {
        window.location.href = 'login.html';
    }
});

function showAuthModal() {
    document.body.classList.add('auth-required');
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.classList.add('show');
    }
}

function hideAuthModal() {
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.classList.remove('show');
    }
}

// Prevent closing modal if authentication is required
document.addEventListener('DOMContentLoaded', () => {
    const authModal = document.getElementById('auth-modal');
    const closeAuth = document.querySelector('.close-auth');
    
    if (document.body.classList.contains('auth-required')) {
        closeAuth.style.display = 'none';
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }
}); 