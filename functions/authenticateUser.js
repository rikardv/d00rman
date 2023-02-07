import {
  doormanStatus,
  isAuthenticated,
  setAuthX,
  setCookieToken,
  setSessionId,
  synced,
  syncing,
} from '../actions';
import store from '../store';
import CookieManager from '@react-native-cookies/cookies';
import obtaincookies from './obtaincookies';
import login from './login';
import GetStatus from './GetStatus';
import redirectHome from './redirectHome';
import redirectLogin from './redirectLogin';

export default async function authenticateUser() {
  const fgtServer =
    'FCC6DDCA37429F02BB6A7773E8C85DD85E55FDE3D8EEFABCD80299A5837862055EAD27A627279A3CAE81E9C8B9';

  const credentials = await obtaincookies();

  const cookies = await CookieManager.getAll().then(cookies => cookies);

  await login(
    fgtServer,
    cookies['ASP.NET_SessionId'].value,
    cookies['__RequestVerificationToken_L0FwdHVzUG9ydGFsU3R5cmE1'].value,
    credentials[1],
    credentials[0],
  );

  const authorization = await CookieManager.getAll().then(aspx => aspx);

  await redirectHome(
    fgtServer,
    cookies['ASP.NET_SessionId'].value,
    cookies['__RequestVerificationToken_L0FwdHVzUG9ydGFsU3R5cmE1'].value,
    authorization['.ASPXAUTH'].value,
  );

  await new Promise(resolve => setTimeout(resolve, 500));

  await redirectLogin(
    fgtServer,
    cookies['ASP.NET_SessionId'].value,
    cookies['__RequestVerificationToken_L0FwdHVzUG9ydGFsU3R5cmE1'].value,
    authorization['.ASPXAUTH'].value,
  );

  store.dispatch(setAuthX(authorization['.ASPXAUTH'].value));
  store.dispatch(setSessionId(cookies['ASP.NET_SessionId'].value));
  store.dispatch(
    setCookieToken(
      cookies['__RequestVerificationToken_L0FwdHVzUG9ydGFsU3R5cmE1'].value,
    ),
  );

  store.dispatch(isAuthenticated());
  store.dispatch(syncing());

  await GetStatus(
    fgtServer,
    cookies['ASP.NET_SessionId'].value,
    cookies['__RequestVerificationToken_L0FwdHVzUG9ydGFsU3R5cmE1'].value,
    authorization['.ASPXAUTH'].value,
  )
    .then(res => res.json())
    .then(data => {
      if (data.IsClosedAndLocked !== null) {
        store.dispatch(doormanStatus(data));
      }
      console.log(data);
    })
    .finally(() => {
      store.dispatch(synced());
    });

  // await new Promise(resolve => setTimeout(resolve, 1000));
  // this.checkStatusInterval();
}
