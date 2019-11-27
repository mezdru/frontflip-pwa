self.addEventListener('push', event => {
  let data;

  if (event.data) {
    data = event.data.json();
  } else {
    data = 'Push message no payload';
  }

  console.log('New notification', data)
  const options = {
    body: data.body,
    vibrate: [100, 50, 100],
    icon: './wingzy_512.png',
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'loading', title: 'Loading action',
        icon: './loading.gif'
      },
      {
        action: 'close', title: 'Close notification',
        // icon: 'images/xmark.png'
      },
    ]
  }
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
})

self.addEventListener('notificationclick', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  var action = e.action;

  console.log(action);

  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow('https://wingzy.com');
    notification.close();
  }
});