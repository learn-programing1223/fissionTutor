# Fission Tutoring Website

A modern, responsive website for Fission Tutoring services, featuring user authentication, session scheduling, and interactive content.

## 🚀 Features

- **User Authentication**: Secure login system with multiple authentication methods
  - Email/Password
  - Google Sign-in
  - GitHub Sign-in
- **Interactive Calendar**: Schedule tutoring sessions with real-time availability
- **Responsive Design**: Mobile-first approach ensuring compatibility across all devices
- **Team Profiles**: Showcase of qualified tutors and their expertise
- **Social Media Integration**: Direct links to social media presence
- **Physics Simulator**: Interactive 1D kinematics demonstration tool

## 🛠 Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Firebase
  - Authentication
  - Firestore Database
  - Hosting
- Google Calendar API

## 📦 Installation

1. Clone the repository:
2. Create a `config.js` file in the root directory:
   
3. Set up Firebase:
   - Create a Firebase project
   - Enable Authentication methods (Email/Password, Google, GitHub)
   - Set up Firestore Database
   - Update config.js with your Firebase credentials

## 🔧 Configuration

1. Copy `config.example.js` to `config.js`
2. Update Firebase configuration in `config.js` with your credentials
3. Never commit `config.js` to version control

## 🚀 Deployment

### Local Development
1. Use a local server (e.g., Live Server VS Code extension)
2. Open `index.html` in your browser

### Production Deployment
1. Configure your web server to serve files from the root directory
2. Ensure all paths are correctly set for production
3. Update Firebase configuration for production environment

## 🔒 Security

- Firebase Authentication handles user security
- API keys are protected in config.js (not committed to repository)
- HTTPS enforced for all connections
- Input validation implemented for all forms

## 🧪 Testing

Manual testing procedures:
1. User authentication flow
2. Session scheduling
3. Mobile responsiveness
4. Cross-browser compatibility

## 📱 Responsive Design

The website is fully responsive and tested on:
- Desktop (1920px and above)
- Laptop (1366px)
- Tablet (768px)
- Mobile (320px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- Aahaan Rathi - President
- Aayan Shah - Vice President
- Mayank Tiku - Vice President
- John Wei - Animation Head

## 📞 Contact

- Email: fissiontutoring@gmail.com
- Instagram: @fissiontutoring
- Website: [fissiontutoring.com](https://fissiontutoring.com)

## 🙏 Acknowledgments

- Firebase for authentication and database services
- Google Calendar API for scheduling functionality
- All our dedicated tutors and students
