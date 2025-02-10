import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

const auth = getAuth();
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