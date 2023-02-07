import {synced, syncing} from '../actions';
import store from '../store';

export default async function LockDoomanlock() {
  var myHeaders = new Headers();
  const state = store.getState();
  store.dispatch(syncing());
  myHeaders.append('Host', 'aptus.hyresbostader.se');
  myHeaders.append('Accept', '*/*');
  myHeaders.append(
    'User-Agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15',
  );
  myHeaders.append(
    'Referer',
    'https://aptus.hyresbostader.se/AptusPortalStyra/Lock',
  );
  myHeaders.append('Accept-Language', 'sv-SE,sv;q=0.9');
  myHeaders.append('X-Requested-With', 'XMLHttpRequest');
  myHeaders.append(
    'Cookie',
    `FGTServer=${state.fgtServer}; FGTServer=${state.fgtServer}; ASP.NET_SessionId=${state.sessionId}; __RequestVerificationToken_L0FwdHVzUG9ydGFsU3R5cmE1=${state.cookieToken}; .ASPXAUTH=${state.authX}`,
  );

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
    credentials: 'same-origin',
    mode: 'cors',
  };

  await fetch(
    'https://aptus.hyresbostader.se/AptusPortalStyra/Lock/LockDoormanLock',
    requestOptions,
  )
    .then(res => {
      return res.json();
    })
    .then(data => {
      store.dispatch(synced());
      console.log('Lock response....', data);
    });
}
