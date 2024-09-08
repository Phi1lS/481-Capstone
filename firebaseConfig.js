// Import the necessary Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, browserLocalPersistence, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native'; // Import to detect platform

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBS5dERajmh-dwgRE5FlIY9EsM2We2H9rk',
  authDomain: 'investalign-f0168.firebaseapp.com',
  projectId: 'investalign-f0168',
  storageBucket: 'investalign-f0168.appspot.com',
  messagingSenderId: '376150329835',
  appId: '1:376150329835:web:e36caadafc78556c5831ae',
  measurementId: 'G-VFKZM4PGKX',
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

let auth;

// Check if the platform is web or native
if (Platform.OS === 'web') {
  // For web platform, use browserLocalPersistence
  auth = getAuth(app);
  auth.setPersistence(browserLocalPersistence);
} else {
  // For native platforms (iOS/Android), use React Native persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Initialize Firestore
const db = getFirestore(app);

// Export both auth and db for use in your app
export { auth, db };
