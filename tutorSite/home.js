import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const auth = getAuth();
    const signOutBtn = document.getElementById('sign-out-btn');

    if (signOutBtn) {
        signOutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                // Redirect to login page after sign out
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Error signing out:', error);
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            } else if (this.getAttribute('href') === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Login Modal Functionality
    const loginButton = document.getElementById('login-button');
    const authModal = document.getElementById('auth-modal');
    const closeAuth = document.querySelector('.close-auth');

    loginButton.addEventListener('click', () => {
        authModal.classList.add('show');
    });

    closeAuth.addEventListener('click', () => {
        authModal.classList.remove('show');
    });

    // Close modal when clicking outside
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('show');
        }
    });

    // Update login button based on auth state
    auth.onAuthStateChanged((user) => {
        if (user) {
            loginButton.textContent = 'Logout';
            loginButton.addEventListener('click', () => {
                auth.signOut();
            });
        } else {
            loginButton.textContent = 'Login';
            loginButton.addEventListener('click', () => {
                authModal.classList.add('show');
            });
        }
    });
}); 