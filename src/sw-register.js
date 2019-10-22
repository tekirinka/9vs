if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then(() =>
      navigator.serviceWorker.ready.then(worker => {
        worker.sync.register("syncdata");
      })
    )
    .catch(console.log);
}
