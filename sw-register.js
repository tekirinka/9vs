if ("serviceWorker" in navigator) {
  //navigator.serviceWorker.register("/sw.js");
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}
