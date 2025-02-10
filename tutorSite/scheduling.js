import { getAuth } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const modal = document.getElementById('signupModal');
    const closeBtn = document.querySelector('.close');
    const signupForm = document.getElementById('sessionSignupForm');
    
    // Close modal when clicking the close button or outside the modal
    closeBtn.onclick = () => modal.classList.remove('show');
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    };

    // Initialize FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        events: fetchEvents,
        eventClick: handleEventClick
    });
    
    calendar.render();

    // Handle form submission
    signupForm.addEventListener('submit', handleSignup);
});

async function fetchEvents(info, successCallback) {
    const db = getFirestore();
    try {
        const querySnapshot = await getDocs(collection(db, 'tutoring_sessions'));
        const events = [];
        querySnapshot.forEach((doc) => {
            const session = doc.data();
            events.push({
                id: doc.id,
                title: session.subject,
                start: session.datetime.toDate(),
                extendedProps: {
                    description: session.description,
                    tutor: session.tutorName
                }
            });
        });
        successCallback(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        successCallback([]);
    }
}

function handleEventClick(info) {
    const auth = getAuth();
    if (!auth.currentUser) {
        alert('Please log in to sign up for sessions');
        return;
    }

    const modal = document.getElementById('signupModal');
    const sessionDate = document.getElementById('sessionDate');
    const sessionTime = document.getElementById('sessionTime');
    const sessionSubject = document.getElementById('sessionSubject');

    // Format date and time
    const date = info.event.start;
    sessionDate.textContent = `Date: ${date.toLocaleDateString()}`;
    sessionTime.textContent = `Time: ${date.toLocaleTimeString()}`;
    sessionSubject.textContent = `Subject: ${info.event.title}`;

    // Store event ID for form submission
    modal.dataset.eventId = info.event.id;
    modal.classList.add('show');
}

async function handleSignup(e) {
    e.preventDefault();
    const auth = getAuth();
    const db = getFirestore();
    const modal = document.getElementById('signupModal');
    
    try {
        await addDoc(collection(db, 'session_bookings'), {
            sessionId: modal.dataset.eventId,
            userId: auth.currentUser.uid,
            studentName: e.target.name.value,
            studentEmail: e.target.email.value,
            bookingDate: new Date()
        });
        
        alert('Session booked successfully!');
        modal.classList.remove('show');
        e.target.reset();
    } catch (error) {
        console.error('Error booking session:', error);
        alert('Error booking session. Please try again.');
    }
}

// For tutors - add session form
if (document.getElementById('addSessionForm')) {
    document.getElementById('addSessionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const db = getFirestore();
        
        if (auth.currentUser) {
            try {
                await addDoc(collection(db, 'tutoring_sessions'), {
                    tutorId: auth.currentUser.uid,
                    tutorName: auth.currentUser.displayName,
                    subject: e.target.subject.value,
                    datetime: new Date(e.target.datetime.value),
                    description: e.target.description.value
                });
                alert('Session added successfully!');
            } catch (error) {
                console.error('Error adding session:', error);
                alert('Error adding session');
            }
        }
    });
} 