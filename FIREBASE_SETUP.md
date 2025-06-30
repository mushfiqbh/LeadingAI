# 🔥 Firebase Setup & Configuration

This guide covers everything you need to set up Firebase for the LucidAI application, including authentication methods, architecture, and troubleshooting.

## Table of Contents

1. [Authentication Methods](#authentication-methods)
2. [Architecture Overview](#architecture-overview)
3. [Setup Instructions](#setup-instructions)
4. [Testing Your Setup](#testing-your-setup)
5. [Troubleshooting](#troubleshooting)
6. [Mock Mode](#mock-mode)

## Authentication Methods

### Option 1: Application Default Credentials (Recommended for Development)

1. Install Google Cloud SDK
2. Run:
   ```bash
   gcloud auth application-default login
   ```
3. Set your project ID in `.env`:
   ```
   FIREBASE_PROJECT_ID=your-project-id
   ```

### Option 2: Service Account Key File

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Save the JSON file in your project
6. Update `.env`:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccountKey.json
   FIREBASE_PROJECT_ID=your-project-id
   ```

### Option 3: Environment Variables

Add to `.env`:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
```

## Architecture Overview

### Data Flow

1. **User Sends Message**
   - Frontend sends message to `/chat` endpoint
   - Includes `conversationId` and `userId`

2. **Backend Processing**
   - Creates user message in Firestore
   - Creates empty AI message in Firestore
   - Streams AI response while updating Firestore
   - Updates conversation metadata

3. **Frontend Updates**
   - Listens to Firestore changes
   - Updates UI in real-time
   - Handles streaming feedback

### Benefits

- **Single Source of Truth**: All data in Firestore
- **Atomic Operations**: Backend handles all writes
- **Real-time Sync**: All clients stay in sync
- **Error Resilience**: Better error handling and recovery

## Setup Instructions

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Firestore Database
   - Set up Authentication if needed

2. **Set Up Service Account**
   - Go to Project Settings → Service Accounts
   - Generate new private key (if using Option 2)
   - Note the service account email

3. **Configure Security Rules**
   - Go to Firestore → Rules
   - Update rules based on your security requirements

## Testing Your Setup

1. **Test Firebase Connection**
   ```bash
   cd server
   npm run test:firebase
   ```
   Or visit: `http://localhost:5000/health/firebase`

2. **Send Test Message**
   ```bash
   curl -X POST http://localhost:5000/chat \
     -F "text=Hello" \
     -F "conversationId=test-conv" \
     -F "userId=test-user"
   ```

## Troubleshooting

### Common Issues

#### ❌ "Default credentials not found"
- Verify your authentication method
- Check `.env` file for typos
- Ensure service account has proper permissions

#### ❌ "Permission denied"
- Check service account roles in Google Cloud Console
- Verify Firestore security rules
- Ensure the service account email is correct

#### ❌ "Project not found"
- Double-check `FIREBASE_PROJECT_ID`
- Verify project exists in Firebase Console
- Check for typos in project ID

## Mock Mode

If Firebase credentials are not configured, the application will run in mock mode:
- AI responses still work
- No data persistence
- No real-time sync between clients

To exit mock mode, set up Firebase credentials following the instructions above.

## Next Steps

- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Detailed solutions to common issues
- [Migration Guide](./MIGRATION_GUIDE.md) - Information about recent changes
