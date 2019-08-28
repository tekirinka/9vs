(global => {
  global['app'] = {
    routes: {
      group1: { rendered: _ => {} },
      group2: { rendered: _ => {} }
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
