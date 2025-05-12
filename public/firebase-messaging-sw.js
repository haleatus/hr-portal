// IMPORTANT: Do NOT use process.env here - hard-code all values!

// eslint-disable-next-line @typescript-eslint/no-unused-vars
self.addEventListener('install', event => {
  console.log('Installing Firebase Messaging Service Worker...');
  self.skipWaiting(); // Force activation
});

self.addEventListener('activate', event => {
  console.log('Firebase Messaging Service Worker activated');
  // Take control of all clients
  event.waitUntil(clients.claim());
});

// Hard-code your Firebase configuration
// IMPORTANT: Make sure this config matches EXACTLY what's in src/notification/firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyAenenFbxDWVskMcggeeW5OovTuBEgudXw",
  authDomain: "hr-portal-notifications.firebaseapp.com",
  projectId: "hr-portal-notifications",
  storageBucket: "hr-portal-notifications.firebasestorage.app",
  messagingSenderId: "814851903871",
  appId: "1:814851903871:web:74ebe3d18e8ed1d1d0ca4a",
  measurementId: "G-YTEB1PBL3J"
};


// Import Firebase scripts with specific versions matching your project
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Log success
console.log('Firebase Messaging Service Worker initialized successfully');

// Handle background messages
messaging.onBackgroundMessage(payload => {
  console.log('[firebase-messaging-sw.js] Received background message', payload);
  
  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/path/to/notification-icon.png', // Use a local icon path
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});