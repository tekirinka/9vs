const url = "https://github.com/tekirinka/hw/raw/master/hw.json";
err = err => {
  console.error(err);
  postMessage({ type: "error", err });
};
onmessage = _ => {
  fetch(`${url}`, { type: "cors" })
    .then(x => x.json())
    .then(json => postMessage({ type: "success", json }))
    .catch(err);
};
