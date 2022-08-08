export default async function LockDoomanlock(fgt, session, cookie_token, auth) {
  var myHeaders = new Headers();
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
    `FGTServer=${fgt}; FGTServer=${fgt}; ASP.NET_SessionId=${session}; __RequestVerificationToken_L0FwdHVzUG9ydGFsU3R5cmE1=${cookie_token}; .ASPXAUTH=${auth}`,
  );

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
    credentials: 'same-origin',
    mode: 'cors',
  };

  const res = await fetch(
    'https://aptus.hyresbostader.se/AptusPortalStyra/Lock/LockDoormanLock',
    requestOptions,
  );

  return res;
}
