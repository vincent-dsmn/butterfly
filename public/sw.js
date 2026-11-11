// Service Worker for Butterfly background notifications
const NOTIFICATION_DELAY = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
const DB_NAME = 'butterfly-db';
const STORE_NAME = 'dates';

// Open IndexedDB - Service Workers cannot access localStorage
const openDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e);
  });
};

// Show notification
const showNotification = () => {
  if (Notification.permission === 'granted') {
    self.registration.showNotification('Butterflies!', {
      body: 'It has been 3+ days since you found Butterflies!',
      icon: '/Butterfly.png',
      data: { url: '/' }
    });
  }
};

// Service Worker lifecycle events
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Listen for messages from the page
self.addEventListener('message', async (event) => {
  if (event.data.type === 'SET_DATE') {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      
      // Clear any existing timeout
      if (self.notificationTimeout) {
        clearTimeout(self.notificationTimeout);
      }
      
      // Store the date in IndexedDB
      store.put({ id: 'butterflyDate', date: event.data.date });
      
      // Calculate delay until 3 days pass
      const currentTime = Date.now();
      const storedDate = new Date(event.data.date).getTime();
      const targetTime = storedDate + NOTIFICATION_DELAY;
      const delay = targetTime - currentTime;
      
      if (delay > 0) {
        self.notificationTimeout = setTimeout(showNotification, delay);
      } else {
        showNotification();
      }
      
      await tx.done;
      db.close();
    } catch (error) {
      // Silently handle errors
    }
  }
});

// Handle notification click - open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.notification.data && event.notification.data.url) {
    clients.openWindow(event.notification.data.url);
  }
});
