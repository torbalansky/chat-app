## Chat App
### Chat App Overview
Chat App is a native application available for both Android and iOS mobile devices. It offers users a chat interface with the ability to share images and their location. The app was developed using Expo and written in React Native. The chat interface is created using the Gifted Chat Library, which provides customized message bubbles. Users have the option to choose a theme color on the start screen before joining the chat. They can also send images and their current location, which is displayed in a map view. User authentication is handled using Google Firebase, allowing for anonymous login, and data is stored using both cloud and local storage.

### Key Features
Start screen: Users can enter their name and choose a background color for the chat screen before joining the chat.
Image and location sharing: Users can send images and their current location. The app prompts for necessary permissions to access the device's hardware.
Data storage: Data is stored both online and offline, providing a seamless user experience.

### Technologies Used
- JavaScript
- React Native
- Expo
- Gifted Chat
- Google Firebase

### Development Environment Setup
To set up the development environment, follow these steps:

1. Clone the repository: git clone https://github.com/torbalansky/chat-app
2. Install Expo CLI as a global npm package: npm install -g expo-cli
3. Create an Expo account at https://expo.dev/ and log in to Expo using the terminal.
4. Follow the instructions provided by Expo CLI based on your preferred simulator/emulator (Xcode, Android Studio, Expo Go).
5. To start the Chat-App, type npx expo start or expo start.

### Database Configuration
To configure the database for the Chat-App, follow these steps:

1. Go to https://firebase.google.com/ and sign in with your existing Google account or create a new one.
2. In the Firebase console, click "Create Project" and follow the instructions to set up a new project.
3. On your project's dashboard, click "Develop" on the left sidebar, then select "Cloud Firestore" and choose "Create Database".
4. Select "Test Mode" for simplicity.
5. In the "Rules" tab of the Firestore section, ensure that the rules are set to: allow read, write: if true;
6. You can either create the "messages" collection manually or let the app create it when it's executed for the first time.
7. Under "Project Settings", scroll down and click the "Firestore for Web" button (</>).
8. Choose a name for your chat app, click "Register", and copy the provided configuration code.
9. Open the "app.js" file in the cloned repository and replace the existing configuration code with your own.
10. Ensure that you update the following fields: apiKey, authDomain, projectId, storageBucket, messagingSenderId, and appId.
11. To enable photo uploads, navigate to the "Storage" section on the left sidebar, and in the "Rules" tab, set it to: allow read, write: if true;

If you have any questions or encounter any issues during the setup process, feel free to reach out for assistance.

### Dependencies
```plaintext
"dependencies": {
    "@expo/react-native-action-sheet": "^4.0.1",
    "@react-native-async-storage/async-storage": "1.17.11",
    "@react-native-community/netinfo": "9.3.7",
    "@react-native-firebase/app": "^17.5.0",
    "@react-native-firebase/firestore": "^17.5.0",
    "@react-navigation/bottom-tabs": "^6.5.7",
    "@react-navigation/native": "^6.1.6",
    "@react-navigation/native-stack": "^6.9.12",
    "dayjs": "^1.11.7",
    "expo": "~48.0.15",
    "expo-image-picker": "~14.1.1",
    "expo-location": "~15.1.1",
    "expo-media-library": "~15.2.3",
    "expo-status-bar": "~1.4.4",
    "firebase": "^9.22.0",
    "react": "18.2.0",
    "react-native": "0.71.7",
    "react-native-gifted-chat": "^2.1.0",
    "react-native-maps": "1.3.2",
    "react-native-safe-area-context": "4.5.0",
    "react-native-screens": "~3.20.0",
    "react-native-typing-animation": "^0.1.7"
}