import CookieManager from '@react-native-cookies/cookies';
import React, {Component} from 'react';
import {ActivityIndicator, FlatList, View, StyleSheet} from 'react-native';
import * as eva from '@eva-design/eva';
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
  Button,
  Spinner,
  Icon,
} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import login from './functions/login';
import obtaincookies from './functions/obtaincookies';
import redirectLogin from './functions/redirectLogin';
import redirectHome from './functions/redirectHome';
import UnlockDoomanlock from './functions/UnlockDoomanlock';
import logOff from './functions/logOff';
import LockDoomanlock from './functions/LockDoomanlock';
import GetStatus from './functions/GetStatus';
import UnlockMain from './functions/UnlockMain';
import pingServer from './functions/pingServer';

const LoadingIndicator = props => (
  <View style={[props.style, styles.indicator]}>
    <Spinner size="small" status={'basic'} />
  </View>
);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.timer = null;
    this.check = null;

    this.state = {
      isLoading: false,
      authenticated: false,
      status: 'success',
      doormanPendingState: false,
      fgtserver:
        'FCC6DDCA37429F02BB6A7773E8C85DD85E55FDE3D8EEFABCD80299A5837862055EAD27A627279A3CAE81E9C8B9',
      session_id: '',
      cookie_token: '',
      aspx_auth: '',
      isClosedAndLocked: false,
      mainEntranceUnlocked: false,
      loginStatus: '',
      lowBattery: false,
      checkingBattery: true,
    };
  }

  componentDidMount() {}

  async authenticateUser() {
    this.setState({
      isLoading: true,
      loginStatus:
        'Getting the ASP.NET_SessionId and __RequestVerificationToken cookie.....',
    });

    // scrape html for salt and body token + receive cookies
    const credentials = await obtaincookies();

    const cookies = await CookieManager.getAll().then(cookies => cookies);

    this.setState({
      session_id: cookies['ASP.NET_SessionId'].value,
      cookie_token:
        cookies['__RequestVerificationToken_L0FwdHVzUG9ydGFsU3R5cmE1'].value,
      loginStatus: 'Getting the .ASPXAUTH cookie.....',
    });

    //post login request with cookies and obtain auth
    await login(
      this.state.fgtserver,
      cookies['ASP.NET_SessionId'].value,
      cookies['__RequestVerificationToken_L0FwdHVzUG9ydGFsU3R5cmE1'].value,
      credentials[1],
      credentials[0],
    );

    const authorization = await CookieManager.getAll().then(aspx => aspx);

    this.setState({
      aspx_auth: authorization['.ASPXAUTH'].value,
    });

    //wait for async setstate
    // await new Promise(resolve => setTimeout(resolve, 1000));

    //simulate user navigation to homepage
    this.setState({
      loginStatus: 'Simulating a redirect to homepage.....',
    });
    await redirectHome(
      this.state.fgtserver,
      cookies['ASP.NET_SessionId'].value,
      cookies['__RequestVerificationToken_L0FwdHVzUG9ydGFsU3R5cmE1'].value,
      authorization['.ASPXAUTH'].value,
    );

    //wait few seconds for next navigate
    await new Promise(resolve => setTimeout(resolve, 500));

    //simulate user naviation to lockpage
    this.setState({
      loginStatus: 'Simulating a redirect to lockpage.....',
    });
    await redirectLogin(
      this.state.fgtserver,
      cookies['ASP.NET_SessionId'].value,
      cookies['__RequestVerificationToken_L0FwdHVzUG9ydGFsU3R5cmE1'].value,
      authorization['.ASPXAUTH'].value,
    ).then(() => {
      this.setState({
        isLoading: false,
        authenticated: true,
        doormanPendingState: true,
      });
    });

    //check status of door
    // await new Promise(resolve => setTimeout(resolve, 500));
    await GetStatus(
      this.state.fgtserver,
      cookies['ASP.NET_SessionId'].value,
      cookies['__RequestVerificationToken_L0FwdHVzUG9ydGFsU3R5cmE1'].value,
      authorization['.ASPXAUTH'].value,
    )
      .then(res => res.json())
      .then(data => {
        if (data.IsClosedAndLocked !== null) {
          this.setState({
            isClosedAndLocked: data.IsClosedAndLocked,
            lowBattery: data.BatteryLevelLow,
            checkingBattery: false,
          });
        }
      })
      .finally(() => {
        this.setState({
          doormanPendingState: false,
        });
      });

    await new Promise(resolve => setTimeout(resolve, 1000));
    this.checkStatusInterval();

    //ping server for setting new aspx auth
    this.timer = setInterval(async () => {
      await pingServer(
        this.state.fgtserver,
        cookies['ASP.NET_SessionId'].value,
        cookies['__RequestVerificationToken_L0FwdHVzUG9ydGFsU3R5cmE1'].value,
        authorization['.ASPXAUTH'].value,
      ).then(res => {
        console.log('Pinged success');
        CookieManager.getAll().then(res => {
          if (res['.ASPXAUTH']?.value) {
            console.log(
              'Received new authorization...',
              res['.ASPXAUTH'].value,
            );
            this.setState({
              aspx_auth: res['.ASPXAUTH']?.value,
            });
          }
        });
      });
    }, 20000);
  }

  async doorLogic() {
    this.setState({
      doormanPendingState: true,
    });
    if (this.state.isClosedAndLocked) {
      await UnlockDoomanlock(
        this.state.fgtserver,
        this.state.session_id,
        this.state.cookie_token,
        this.state.aspx_auth,
      )
        .then(res => {
          console.log(res);
          return res.json();
        })
        .then(data => {
          console.log('Unlock response....', data);
          this.setState({
            isClosedAndLocked:
              data?.StatusText === 'Dörren är upplåst'
                ? false
                : this.state.isClosedAndLocked,
            doormanPendingState: false,
          });
        });
    } else {
      await LockDoomanlock(
        this.state.fgtserver,
        this.state.session_id,
        this.state.cookie_token,
        this.state.aspx_auth,
      )
        .then(res => {
          console.log(res);
          return res.json();
        })
        .then(data => {
          console.log('Lock response....', data);
          this.setState({
            isClosedAndLocked:
              data?.StatusText === 'Dörren är låst'
                ? true
                : this.state.isClosedAndLocked,
            doormanPendingState: false,
          });
        });
    }
  }

  logUserOff() {
    console.log('Logging the user off...');
    clearInterval(this.timer);
    clearInterval(this.check);
    logOff(this.state.session_id, this.state.cookie_token).then(() => {
      this.setState({
        authenticated: false,
      });
    });
  }

  async unlockMain() {
    this.setState({
      mainEntranceUnlocked: true,
    });
    await UnlockMain(
      this.state.fgtserver,
      this.state.session_id,
      this.state.cookie_token,
      this.state.aspx_auth,
    );
    await new Promise(resolve => setTimeout(resolve, 3000)).then(() => {
      this.setState({
        mainEntranceUnlocked: false,
      });
    });
  }

  checkStatusInterval() {
    this.check = setInterval(async () => {
      await GetStatus(
        this.state.fgtserver,
        this.state.session_id,
        this.state.cookie_token,
        this.state.aspx_auth,
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          console.log(data);
          this.setState({
            isClosedAndLocked: data?.IsClosedAndLocked,
            doormanPendingState: false,
            checkingBattery: false,
            lowBattery: data?.BatteryLevelLow,
          });
        });
    }, 30000);
  }

  renderButtonContent(locked, pending) {
    if (pending) {
      return <LoadingIndicator />;
    } else if (locked) {
      return (
        <Icon
          name="lock-outline"
          fill="#959595"
          size="giant"
          width={80}
          height={80}
        />
      );
    } else {
      return (
        <Icon
          name="unlock-outline"
          fill="#B3FFD6"
          size="giant"
          width={80}
          height={80}
        />
      );
    }
  }

  renderBatteryIndicator() {
    let color = '';
    let text = '';
    if (this.state.checkingBattery) {
      text = 'Kollar batterinivå...';
      color = '#959595';
    } else if (this.state.lowBattery) {
      text = 'Batterinivå är låg';
      color = '#FFD6D9';
    } else {
      text = 'Batterinivå är bra';
      color = '#B3FFD6';
    }

    return (
      <View
        style={{
          height: 100,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={{
            ...styles.header,
            fontSize: 15,
            margin: 5,
            color,
            fontWeight: '800',
          }}>
          {text}
        </Text>
        {this.state.checkingBattery ? (
          <LoadingIndicator />
        ) : (
          <Icon name="flash-outline" fill={color} width={20} height={20} />
        )}
      </View>
    );
  }

  render() {
    const {isLoading, authenticated} = this.state;

    return (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <View
            style={{
              flex: 1,
              padding: 24,
              backgroundColor: '#101010',
              justifyContent: 'center',
            }}>
            {isLoading ? (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text
                  style={{...styles.header, marginBottom: 100, fontSize: 17}}>
                  {this.state.loginStatus}
                </Text>
                <LoadingIndicator />
              </View>
            ) : (
              <View style={styles.container}>
                {authenticated ? (
                  <View style={styles.buttoncontainer}>
                    {this.renderBatteryIndicator()}
                    <Text style={styles.header}>Lägenhetsdörr</Text>
                    <Button
                      style={styles.button}
                      onPress={() => this.doorLogic()}
                      size="giant"
                      status={'basic'}
                      disabled={this.state.doormanPendingState}
                      appearance="outline">
                      {this.renderButtonContent(
                        this.state.isClosedAndLocked,
                        this.state.doormanPendingState,
                      )}
                    </Button>
                    <Text style={styles.header}>Entrédörr</Text>
                    <Button
                      style={styles.button}
                      onPress={() => this.unlockMain()}
                      disabled={this.state.mainEntrancePendingState}
                      size="giant"
                      status={'basic'}
                      appearance="outline">
                      {this.renderButtonContent(
                        !this.state.mainEntranceUnlocked,
                        false,
                      )}
                    </Button>
                    <View style={styles.logoutcontainer}>
                      <Button
                        onPress={() => this.logUserOff()}
                        style={{width: 200, height: 50}}
                        status="basic"
                        appearance="ghost">
                        Log out
                      </Button>
                    </View>
                  </View>
                ) : (
                  <View style={styles.authcontainer}>
                    <Text style={styles.header}>d00rman</Text>
                    <Button
                      style={styles.authbutton}
                      onPress={() => this.authenticateUser()}
                      size="giant"
                      status={this.state.status}
                      accessoryLeft={
                        this.state.pendingState && LoadingIndicator
                      }
                      appearance="outline">
                      Authenticate
                    </Button>
                  </View>
                )}

                {/* <Button
                  style={styles.button}
                  onPress={() => this.test()}
                  size="giant"
                  status={this.state.status}
                  accessoryLeft={this.state.pendingState && LoadingIndicator}
                  disabled={this.state.pendingState}
                  appearance="outline">
                  test
                </Button> */}
                {/*
            <Button title="Status" onPress={() => this.status()}/>
            <Button title="Unlock" onPress={() => this.unlock()}/>
            <Button title="Lock" onPress={() => this.lock()}/>
            <Button title="Logout" onPress={() => this.logout()}/>
            <Button title="test" onPress={() => this.test()}/>
        */}
              </View>
            )}
          </View>
        </ApplicationProvider>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttoncontainer: {
    alignItems: 'center',
  },
  logoutcontainer: {
    margin: '10%',
  },

  header: {
    fontSize: 17,
    fontWeight: '400',
    color: '#959595',
  },
  button: {
    margin: 40,
    height: 150,
    width: 150,
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  authbutton: {
    height: 60,
    width: 200,
    margin: '20%',
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
