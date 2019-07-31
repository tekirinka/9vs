if ('serwiceWorker' in navigator)
{
  window.addEventListener('load', _ => {
    navigator.serviceWorker.register('/js/sw.js');
  })
}
