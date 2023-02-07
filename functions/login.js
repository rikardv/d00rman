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
  var encoded = enc_str('12345', PasswordSalt);
  var myHeaders = new Headers();
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
  urlencoded.append('UserName', '199802026956');
  urlencoded.append('Password', '12345');
  urlencoded.append('PwEnc', encoded);
  urlencoded.append('PasswordSalt', PasswordSalt);

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
