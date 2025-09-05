// Service Worker for AI Halal Advisor

// Listens for the installation of the service worker.
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // Use skipWaiting to ensure the new service worker activates immediately.
  self.skipWaiting();
});

// Listens for the activation of the service worker.
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // Use clients.claim() to take control of uncontrolled clients (pages) immediately.
  event.waitUntil(clients.claim());
});

// Handles incoming push notifications from a server.
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push Received.');
  
  // Parse the data from the push event, with a fallback for empty data.
  const data = event.data ? event.data.json() : { title: 'AI Halal Advisor', body: 'You have a new update.' };
  
  const title = data.title;
  const options = {
    body: data.body,
    icon: '/favicon.svg', // Main icon for the notification
    badge: '/favicon.svg', // Smaller icon, often used in the status bar
  };

  // Display the notification to the user.
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handles user clicks on a displayed notification.
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked.');
  
  // Close the notification that was clicked.
  event.notification.close();

  // Focus an existing app window or open a new one.
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If there's an open window, focus it.
      if (clientList.length > 0) {
        let client = clientList[0];
        // Find a focused client if available
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      // Otherwise, open a new window to the app's root URL.
      return clients.openWindow('/');
    })
  );
});
