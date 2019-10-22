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
    function scrollWorkaround() {
      setTimeout(_ => scrollTo(0, 0), 100);
      document
        .querySelectorAll("a")
        .forEach(item =>
          item.addEventListener("click", _ =>
            setTimeout(_ => window.scrollTo(0, 0), 100)
          )
        );
    },
    function worker() {
      fetch("//tekirinka.github.io/hw/hw.js", { mode: "cors" })
        .then(x => x.text())
        .then(json => (app.data.hw = JSON.parse(json)))
        .then(_ => app.utils.showHW());
    },
    function sw() {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js");
      }
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
    },
    showHW() {
      for (let key in app.data.hw) {
        const val = app.data.hw[key];
        const oldNode = document.querySelector(key);
        let newNode = document.createElement(oldNode.tagName);
        newNode.classList = oldNode.classList;
        newNode.id = oldNode.id;
        for (let hwData of val) {
          let { title, content, date } = hwData;
          date = new Date(date);
          const dateNow = new Date(Date.now());
          dateNow.setHours(0, 0, 0, 0);
          let today =
              dateNow == date
                ? "today, "
                : dateNow.getDate() + 1 == date.getDate()
                ? "tomorrow, "
                : "",
            dateText = date.toLocaleString();
          const hwNode = app.data.template.cloneNode(true);
          hwNode.querySelector(
            ".title"
          ).innerHTML = `${title} (${today}${dateText})`;
          hwNode.querySelector(".content").innerHTML = content;
          newNode.appendChild(hwNode);
        }
        oldNode.replaceWith(newNode);
      }
    }
  }
};

window.addEventListener("load", app.init);
