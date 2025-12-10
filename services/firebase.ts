import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken } from 'firebase/messaging';

// TODO: Replace with your actual Firebase project configuration
// You can get this from the Firebase Console -> Project Settings
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyD-YOUR-API-KEY",
  authDomain: "kiamovie-app.firebaseapp.com",
  projectId: "kiamovie-app",
  storageBucket: "kiamovie-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-ABCDEF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in production or if supported)
let analytics = null;
if (typeof window !== 'undefined') {
    try {
        analytics = getAnalytics(app);
    } catch (e) {
        console.log("Firebase Analytics not supported in this environment");
    }
}

// Initialize Messaging (for Push Notifications)
export const requestNotificationPermission = async () => {
  try {
    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_PUBLIC_VAPID_KEY_FROM_FIREBASE_CONSOLE' 
      });
      console.log('FCM Token:', token);
      return token;
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
    return null;
  }
};

export { app, analytics };
