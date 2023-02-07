import store from '../store';

export default async function logOff() {
  const state = store.getState();
  var myHeaders = new Headers();
  myHeaders.append(
    'sec-ch-ua',
    '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
  );
  myHeaders.append('sec-ch-ua-mobile', '?0');
  myHeaders.append('sec-ch-ua-platform', '"macOS"');
  myHeaders.append('Upgrade-Insecure-Requests', '1');
  myHeaders.append(
    'User-Agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
  );
  myHeaders.append(
    'Accept',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  );
  myHeaders.append(
    'Cookie',
    `ASP.NET_SessionId=${state.sessionId}; __RequestVerificationToken_L0FwdHVzUG9ydGFsU3R5cmE1=${state.cookieToken}`,
  );

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  fetch(
    'https://aptus.hyresbostader.se/AptusPortalStyra/Account/LogOff',
    requestOptions,
  )
    .then(response => response.text())
    .then(result => console.log('Logged out'))
    .catch(error => console.log('error', error));
}
