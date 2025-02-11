import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, sendPasswordResetEmail, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

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

// Add error handling function
function handleAuthError(error) {
    console.error('Auth error:', error);
    let errorMessage = 'An error occurred. Please try again.';
    
    switch (error.code) {
        case 'auth/missing-email':
            errorMessage = 'Please enter your email address';
            break;
        case 'auth/reset-email-sent':
        case 'auth/verification-email-sent':
        case 'auth/email-not-verified':
            errorMessage = error.customMessage;
            break;
        case 'auth/email-already-in-use':
            errorMessage = 'Email already in use';
            break;
        case 'auth/account-exists-with-different-credential':
            errorMessage = 'Email already in use with a different login method';
            break;
        case 'auth/popup-closed-by-user':
            errorMessage = 'Sign in was cancelled';
            break;
        case 'auth/popup-blocked':
            errorMessage = 'Please allow pop-ups for this site';
            break;
        case 'auth/unauthorized-domain':
            errorMessage = 'Please use an authorized domain';
            break;
        default:
            errorMessage = error.customMessage || 'Something went wrong. Please try again';
    }
    
    // Show error in UI
    const loginError = document.getElementById('login-error');
    const signupError = document.getElementById('signup-error');
    
    if (loginError) loginError.textContent = errorMessage;
    if (signupError) signupError.textContent = errorMessage;
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignUpLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const loginContainer = document.querySelector('.form-container');
    const signupContainer = document.getElementById('signup-container');
    const googleBtn = document.getElementById('google-login');
    const githubBtn = document.getElementById('github-login');

    // Form switching
    if (showSignUpLink) {
        showSignUpLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginContainer.classList.add('hidden');
            signupContainer.classList.remove('hidden');
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            signupContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
        });
    }

    // Add forgot password handler
    const forgotPasswordLink = document.getElementById('forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            if (!email) {
                handleAuthError({ code: 'auth/missing-email' });
                return;
            }
            
            try {
                await sendPasswordResetEmail(auth, email);
                handleAuthError({ 
                    code: 'auth/reset-email-sent',
                    customMessage: 'Password reset email sent. Please check your inbox.'
                });
            } catch (error) {
                handleAuthError(error);
            }
        });
    }

    // Regular login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                if (!userCredential.user.emailVerified) {
                    await sendEmailVerification(userCredential.user);
                    handleAuthError({ 
                        code: 'auth/email-not-verified',
                        customMessage: 'Please verify your email. Verification link sent.'
                    });
                    await auth.signOut();
                    return;
                }
                window.location.href = 'index.html';
            } catch (error) {
                handleAuthError(error);
            }
        });
    }

    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(userCredential.user);
                handleAuthError({ 
                    code: 'auth/verification-email-sent',
                    customMessage: 'Account created! Please check your email to verify your account.'
                });
                await auth.signOut();
            } catch (error) {
                handleAuthError(error);
            }
        });
    }

    // Google login
    if (googleBtn) {
        googleBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
                const provider = new GoogleAuthProvider();
                provider.setCustomParameters({
                    prompt: 'select_account'
                });
                const result = await signInWithPopup(auth, provider);
                console.log("Google sign in successful:", result.user);
                window.location.href = 'index.html';
            } catch (error) {
                handleAuthError(error);
            }
        });
    }

    // GitHub login
    if (githubBtn) {
        githubBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
                console.log("Starting GitHub sign-in process...");
                const provider = new GithubAuthProvider();
                provider.addScope('read:user');
                provider.addScope('user:email');
                
                // Set custom OAuth parameters
                provider.setCustomParameters({
                    'allow_signup': 'true'
                });
                
                console.log("Initiating GitHub popup...");
                const result = await signInWithPopup(auth, provider);
                console.log("GitHub sign in successful:", result.user);
                
                // Get the GitHub OAuth access token
                const credential = GithubAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                console.log("GitHub token received:", token ? "Yes" : "No");
                
                // Check if we have a user before redirecting
                if (result.user) {
                    console.log("Redirecting to index.html...");
                    window.location.replace('./index.html');
                } else {
                    console.error("No user data received after GitHub login");
                    throw new Error("Login successful but no user data received");
                }
            } catch (error) {
                console.error("GitHub login error:", {
                    code: error.code,
                    message: error.message,
                    email: error.email,
                    credential: error.credential
                });
                
                // Update error message to be more user-friendly
                if (error.code === 'auth/account-exists-with-different-credential') {
                    error.customMessage = 'Email already in use with a different login method';
                }
                handleAuthError(error);
            }
        });
    }

    // Check if user is already signed in
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('User is already signed in:', user);
            window.location.href = 'index.html';
        }
    });
}); 