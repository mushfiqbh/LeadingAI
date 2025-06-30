# LucidAI - AI-Powered Chat Application

LucidAI is a real-time chat application powered by AI, built with a modern tech stack including Firebase for real-time data synchronization and backend services.

## 🚀 Features

- Real-time chat with AI assistant
- Conversation history with Firestore persistence
- Streaming responses for better UX
- User authentication and conversation management
- Responsive web interface

## 📦 Prerequisites

- Node.js 16+
- npm or yarn
- Firebase project with Firestore
- Google Cloud account (for Firebase Admin)

## 🛠️ Quick Start

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd LucidAI
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   Create `.env` files in both `server` and `client` directories with required configurations.
   See [Firebase Setup Guide](./FIREBASE_SETUP.md) for detailed instructions.

4. **Start the development servers**
   ```bash
   # In server directory
   npm run dev
   
   # In client directory (new terminal)
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Documentation

- [Firebase Setup & Configuration](./FIREBASE_SETUP.md) - Complete guide to setting up Firebase
- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Common issues and solutions
- [Migration Guide](./MIGRATION_GUIDE.md) - Information about recent changes and updates
- [Architecture Overview](./ARCHITECTURE.md) - System design and component documentation

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Your Team Name]