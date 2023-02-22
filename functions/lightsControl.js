import {apiKey, apiUrl} from '../secrets';

export default async function lightsControl(on) {
  var myHeaders = new Headers();
  myHeaders.append('x-api-key', apiKey);
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    pin_number: 0,
    emitter_id: 31415,
    receiver_id: -1,
    action: on ? 'on' : 'off',
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  await fetch(apiUrl, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}
