import store from '../store';

export default async function pingServer() {
  console.log('Pinging server......');
  const state = store.getState();
  var myHeaders = new Headers();
  myHeaders.append('Host', 'aptus.hyresbostader.se');
  myHeaders.append(
    'sec-ch-ua',
    '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
  );
  myHeaders.append('Accept', '*/*');
  myHeaders.append('X-Requested-With', 'XMLHttpRequest');
  myHeaders.append('sec-ch-ua-mobile', '?0');
  myHeaders.append(
    'User-Agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
  );
  myHeaders.append('sec-ch-ua-platform', '"macOS"');
  myHeaders.append('Sec-Fetch-Site', 'same-origin');
  myHeaders.append('Sec-Fetch-Mode', 'cors');
  myHeaders.append('Sec-Fetch-Dest', 'empty');
  myHeaders.append(
    'Referer',
    'https://aptus.hyresbostader.se/AptusPortalStyra/Lock',
  );
  myHeaders.append('Accept-Language', 'sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7');
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

  const res = await fetch(
    'https://aptus.hyresbostader.se/AptusPortalStyra/Lock/SetLockStatusTempData',
    requestOptions,
  );

  return res;
}
