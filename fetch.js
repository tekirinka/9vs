const apikey = "5d4da79558a35b31adeba65f";
const url = "https://howork-3bce.restdb.io/rest";
err = err => {
  console.error(err);
  postMessage({ type: "error", err });
};
onmessage = evt => {
  let msg = evt.data;
  fetch(`${url}/${msg}`, { headers: { "x-apikey": apikey }, type: "cors" })
    .then(x => x.json())
    .then(json => postMessage({ type: "success", json }))
    .catch(err);
};
