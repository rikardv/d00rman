import enc_str from './encode';
import CookieManager from '@react-native-cookies/cookies';
import * as cheerio from 'cheerio';

export default async function login(
  fgt,
  session,
  cookie_token,
  body_token,
  PasswordSalt,
) {
  console.log('Trying to login the user.....');
  await CookieManager.clearAll();
  var encoded = enc_str('', PasswordSalt);
  var myHeaders = new Headers();
  //   myHeaders.append('Host', 'aptus.hyresbostader.se');
  //   myHeaders.append('Cache-Control', 'max-age=0');
  //   myHeaders.append(
  //     'sec-ch-ua',
  //     '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
  //   );
  //   myHeaders.append('sec-ch-ua-mobile', '?0');
  //   myHeaders.append('sec-ch-ua-platform', '"macOS"');
  //   myHeaders.append('Upgrade-Insecure-Requests', '1');
  //   myHeaders.append(
  //     'User-Agent',
  //     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
  //   );
  //   myHeaders.append('Origin', 'https://aptus.hyresbostader.se');
  //   myHeaders.append(
  //     'Accept',
  //     'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  //   );
  //   myHeaders.append('Sec-Fetch-Site', 'same-origin');
  //   myHeaders.append('Sec-Fetch-Mode', 'navigate');
  //   myHeaders.append('Sec-Fetch-User', '?1');
  //   myHeaders.append('Sec-Fetch-Dest', 'document');
  //   myHeaders.append(
  //     'Referer',
  //     'https://aptus.hyresbostader.se/AptusPortalStyra/Account/Login?ReturnUrl=%2fAptusPortalStyra%2f',
  //   );
  // myHeaders.append('Accept-Language', 'sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7');
  myHeaders.append(
    'Cookie',
    `FGTServer=${fgt}; ASP.NET_SessionId=${session}; __RequestVerificationToken_L0FwdHVzUG9ydGFsU3R5cmE1=${cookie_token}`,
  );
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  //3220
  //'SSCRMD_4LsX-1mmJafTYCun8gsXWB70ekDkZEk7N0lHc8CffvLfvXi_Xdwxa7DzfOQcEZjwbkP3yQ-a63VEoP_WjWMVpxmY5aHf7zbApo141'

  var urlencoded = new URLSearchParams();
  urlencoded.append('DeviceType', 'PC');
  urlencoded.append('DesktopSelected', 'true');
  urlencoded.append('__RequestVerificationToken', body_token);
  urlencoded.append('UserName', '');
  urlencoded.append('Password', '');
  urlencoded.append('PwEnc', encoded);
  urlencoded.append('PasswordSalt', PasswordSalt);

  console.log('urlEncoded', urlencoded);

  // console.log('Headers', myHeaders);
  // console.log('Body', urlencoded);

  var requestOptions = {
    method: 'POST',
    body: urlencoded.toString(),
    redirect: 'follow',
    credentials: 'same-origin',
    mode: 'cors',
    headers: myHeaders,
  };

  await fetch(
    'https://aptus.hyresbostader.se/AptusPortalStyra/Account/Login?ReturnUrl=%2fAptusPortalStyra%2f',
    requestOptions,
  )
    .then(response => response.text())
    .then(result => {
      return result;
    })
    .catch(error => console.log('error', error));
}
