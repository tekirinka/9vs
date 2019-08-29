(global => {
  global['app'] = {
    data: {
      apikey: '5d4da79558a35b31adeba65f',
      url: 'https://howork-3bce.restdb.io/rest',
      template: document.querySelector('template.hw').innerHTML
    },
    routes: {
      hw: {
        rendered: async (hw, group) => {
        if (!(hw in global.app.data)) return;
        let loading = document.querySelector(`body > .loading`);
        loading.style.opacity = '1';
        global.app.data[hw] = await fetch(`${global.app.data.url}/${group}`, {
          headers: {
            'x-apikey': global.app.data.apikey
          }
        });
        let element = document.querySelector(`${location.hash} .list`);
        element.innerHTML = global.app.data[hw].map(
          item => global.app.data.template
            .replace('TITLE', item.title)
            .replace('CONTENT', item.content)
        );
        
        loading.style.opacity = '0';
        }
      },
      group1: {p
        rendered: _ => global.app.routes.hw('hw1', 'group1')
      }
      group2: {
        rendered: _ => global.app.routes.hw('hw2', 'group2')
      }
    },
    default: 'home',
    hashChange: _ => {
      app.route = app.routes[location.hash.slice(1)];
      if (app.route) {
        app.route.rendered();
      }
    },
    init: _ => {
      global.addEventListener('hashchange', _ => app.hashChange());
      if (window.location.hash) {
        app.hashChange();
      } else {
        location.hash = app.default;
      }
    }
  };
})(window);

app.init();