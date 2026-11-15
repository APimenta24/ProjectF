/* Pulse PWA: no caching of authenticated or sensitive responses. */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
  if(!event.data)return;
  let payload;try{payload=event.data.json()}catch{return}
  // No health, cycle, nutrition, or private content in lock-screen notifications.
  if(payload?.type!=='pulse-reminder')return;
  const title='INVICTAS Pulse';
  event.waitUntil(self.registration.showNotification(title,{body:'Tens um lembrete no Pulse.',icon:'/pulse-icon.svg',badge:'/pulse-icon.svg',tag:'pulse-reminder',data:{url:'/pulse/prototipo'}}));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil(self.clients.openWindow('/pulse/prototipo'));
});
