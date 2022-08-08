import CookieManager from '@react-native-cookies/cookies';
import * as cheerio from 'cheerio';

export default async function obtaincookies() {
  console.log('Obtaining initial cookies......');
  await CookieManager.clearAll();
  var myHeaders = new Headers();
  myHeaders.append('Upgrade-Insecure-Requests', '1');
  myHeaders.append(
    'User-Agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
  );
  myHeaders.append(
    'Accept',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  );
  //   myHeaders.append(
  //     'sec-ch-ua',
  //     '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
  //   );
  //   myHeaders.append('sec-ch-ua-mobile', '?0');
  //   myHeaders.append('sec-ch-ua-platform', '"macOS"');

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
    credentials: 'same-origin',
    mode: 'cors',
  };

  const res = await fetch(
    'https://aptus.hyresbostader.se/AptusPortalStyra/Account/Login?ReturnUrl=%2fAptusPortalStyra%2f',
    requestOptions,
  )
    .then(response => response.text())
    .then(result => {
      let arr = [];
      const $ = cheerio.load(result);
      arr.push($('#PasswordSalt').val());
      arr.push($('[name=__RequestVerificationToken]').val());
      console.log('PasswordSalt found: ', arr[0]);
      console.log('Token from html found: ', arr[1]);
      return arr;
    })
    .catch(error => console.log('error', error));

  return res;
}
