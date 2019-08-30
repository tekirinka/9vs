(global => {
  global["app"] = {
    data: {
      apikey: "5d4da79558a35b31adeba65f",
      url: "https://howork-3bce.restdb.io/rest",
      template: document.querySelector("template.hw").innerHTML
    },
    routes: {
      hw: {
        rendered: async (init, hw, group) => {
          if (hw in global.app.data) return;
          if (!init) document.body.classList.add("loading");
          global.app.data[hw] = await fetch(`${global.app.data.url}/${group}`, {
            headers: { "x-apikey": global.app.data.apikey }
          }).then(x => x.json());
          let element = document.querySelector(`${location.hash} .list`);
          element.innerHTML = global.app.data[hw]
            .map(item =>
              global.app.data.template
                .replace("TITLE", item.title)
                .replace("CONTENT", item.content)
            )
            .join("");
          if (!init) document.body.classList.remove("loading");
        },
        hidden: (init, hw) => {
          document.querySelector(`${hw} .list`).innerHTML = "";
        }
      },
      group1: {
        rendered: init => global.app.routes.hw.rendered(init, "hw1", "group1"),
        hidden: init => global.app.routes.hw.hidden(init, "#group1")
      },
      group2: {
        rendered: init => global.app.routes.hw.rendered(init, "hw2", "group2"),
        hidden: init => global.app.routes.hw.hidden(init, "#group2")
      }
    },
    default: "home",
    hashChange: init => {
      if (app.route && app.route.hidden) {
        app.route.hidden(init);
      }
      app.route = app.routes[location.hash.slice(1)];
      if (app.route && app.route.rendered) {
        app.route.rendered(init);
      }
    },
    init: _ => {
      global.addEventListener("hashchange", _ => app.hashChange());
      if (window.location.hash) {
        app.hashChange(true);
      } else {
        location.hash = app.default;
      }
    }
  };
})(window);

app.init();
