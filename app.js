app = {
  init: _ => {
    setTimeout(_ => window.scrollTo(0, 0), 100);
    window.addEventListener("hashchange", app.hashchange);
    document
      .querySelectorAll("a")
      .forEach(item =>
        item.addEventListener("click", _ =>
          setTimeout(_ => window.scrollTo(0, 0), 100)
        )
      );
    if (location.hash) {
      app.hashchange();
    } else {
      location.hash = app.data.default;
    }
    app.fetch();
  },
  hashchange: _ => {
    let page = location.hash.substr(1);
    if (app.routes[page]) {
      app.routes[page]();
    }
  },
  data: {
    default: "#home",
    template: document.querySelector("template.hw").content,
    groups: [
      { page: "#group2", db: "group2" },
      { page: "#group1", db: "group1" }
    ],
    hw: [],
    months: "января,февраля,марта,апреля,мая,июня,июля,августа,сентября,октября,ноября,декабря".split(
      ","
    ),
    weekdays: "понедельник,вторник,среда,четверг,пятница,суббота,воскресенье".split(
      ","
    )
  },
  fetch: _ => {
    app.data.groups.map(async group => {
      let { page, db } = group;
      new Promise((ok, err) => {
        if (!app.data.hw[db]) {
          let worker = new Worker("fetch.js");
          worker.onmessage = evt => {
            if (evt.data.type == "err") {
              err(evt.data.err);
            }
            app.data.hw[db] = evt.data.json;
            ok(app.data.hw[db]);
          };
          worker.postMessage(db);
        } else {
          ok(app.data.hw[db]);
        }
      })
        .then(hw => {
          const dateNow = new Date(Date.now());
          dateNow.setHours(0, 0, 0, 0);
          hw = hw
            .filter(item => new Date(item.date) >= dateNow)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          const element = document.querySelector(`${page} .list`);
          element.innerHTML = "";
          for (item of hw) {
            const template = document.importNode(app.data.template, true);
            const date = new Date(item.date);
            const dateText = `${date.getDate()} ${
              app.data.months[date.getMonth()]
            } ${date.getFullYear()} года, ${
              date.getDate() == dateNow.getDate()
                ? "сегодня"
                : date.getDate() == dateNow.getDate() + 1
                ? "завтра"
                : app.data.weekdays[date.getDay() - 1]
            }`;
            template.querySelector(
              ".title"
            ).innerHTML = `${item.title} (${dateText})`;
            template.querySelector(".content").innerHTML = item.content;
            element.appendChild(template);
          }
        })
        .catch(console.err);
    });
  },
  routes: {}
};

window.addEventListener("load", app.init);
