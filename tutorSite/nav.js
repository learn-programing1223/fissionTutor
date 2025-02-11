import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
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

document.addEventListener('DOMContentLoaded', () => {
    const signOutBtn = document.getElementById('sign-out-btn');
    
    if (signOutBtn) {
        signOutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                console.log('User signed out successfully');
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Error signing out:', error);
            }
        });
    }
}); 