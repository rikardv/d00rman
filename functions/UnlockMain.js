export default async function UnlockMain(fgt, session, cookie_token, auth) {
  var myHeaders = new Headers();
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

  await fetch(
    'https://aptus.hyresbostader.se/AptusPortalStyra/Lock/UnlockEntryDoor/',
    requestOptions,
  )
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}
