app = {
  init() {
    location.hash = location.hash || app.data.defaultHash;
    for (i of app.setup) i();
  },
  data: {
    defaultHash: "#home",
    template: document.querySelector("template.hw").content,
    groups: [{ page: "#home", db: "group2" }],
    hw: null,
    worker: null
  },
  setup: [
    function unIframe() {
      window.parent.location = location;
    },
    function setupScrollWorkaround() {
      setTimeout(_ => scrollTo(0, 0), 100);
      document
        .querySelectorAll("a")
        .forEach(item =>
          item.addEventListener("click", _ =>
            setTimeout(_ => window.scrollTo(0, 0), 100)
          )
        );
    },
    function setupWorker() {
      app.data.worker = new Worker("/fetch.js");
      app.data.worker.onmessage = e => (app.data.hw = e.data);
    }
  ],
  routes: {},
  utils: {
    show(selector = ".hidden") {
      document
        .querySelectorAll(selector)
        .forEach(i => i.classList.add("uncover"));
    },
    hide(selector = ".hidden") {
      document
        .querySelectorAll(selector)
        .forEach(i => i.classList.remove("uncover"));
    }
  }
};

window.addEventListener("load", app.init);
