app = {
  init: _ => {
    window.addEventListener("hashchange", app.hashchange);
    if (location.hash) {
      app.hashchange();
    } else {
      location.hash = app.data.default;
    }
    app.fetch(true);
    setInterval(app.fetch, 10000);
  },
  hashchange: _ => {
    setTimeout(_ => window.scrollTo(0, 0), 100);
    let page = location.hash.substr(1);
    if (app.routes[page]) {
      app.routes[page]();
    }
  },
  data: {
    default: "#home",
    apikey: "5d4da79558a35b31adeba65f",
    url: "https://howork-3bce.restdb.io/rest",
    template: document.querySelector("template.hw").content,
    groups: [
      { page: "#group1", db: "group1" },
      { page: "#group2", db: "group2" }
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
      app.routes[db] = await new Promise(async (ok, err) => {
        if (!app.data.hw[db]) {
          app.data.hw[db] = await fetch(`${app.data.url}/${db}`, {
            headers: { "x-apikey": app.data.apikey }
          }).then(x => x.json(), err);
        }
        ok(app.data.hw[db]);
      }).then(hw => _ => {
        let dateNow = new Date(Date.now());
        dateNow.setHours(0, 0, 0, 0);
        hw = hw.filter(item => new Date(item.date) >= dateNow);
        hw = hw.sort((a, b) => new Date(a.date) - new Date(b.date));
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
      });
      if (location.hash == group.page) {
        app.routes[group.db]();
      }
    });
  },
  routes: {}
};

window.addEventListener("load", app.init);
