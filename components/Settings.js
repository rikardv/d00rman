import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Toggle} from '@ui-kitten/components';
import {connect} from 'react-redux';
import {
  isAtHome,
  isAway,
  readyForGpsToggle,
  signIn,
  signOut,
  startGps,
  toggleAll,
  updatePos,
  updatePositionState,
} from '../actions';
import {stateSelector} from './Dashboard';
import BackgroundGeolocation from 'react-native-background-geolocation';
import logOff from '../functions/logOff';
import authenticateUser from '../functions/authenticateUser';
import pingServer from '../functions/pingServer';
import CookieManager from '@react-native-cookies/cookies';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import UnlockMain from '../functions/UnlockMain';
import UnlockDoomanlock from '../functions/UnlockDoomanlock';
import OnOff from './OnOff';
import lightsControl from '../functions/lightsControl';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.timer = null;
    this.check = null;
  }

  subscriptions = [];
  /// When view is destroyed (or refreshed during development live-reload),
  /// remove BackgroundGeolocation event subscriptions.
  componentWillUnmount() {
    this.subscriptions.forEach(subscription => subscription.remove());
  }

  startGpsTracker = () => {
    /// 1.  Subscribe to BackgroundGeolocation events.
    this.subscriptions.push(
      BackgroundGeolocation.onLocation(
        async location => {
          console.log('[onLocation]', location);
          const lat1 = location.coords.latitude;
          const lon1 = location.coords.longitude;
          const lat2 = 58.585879;
          const lon2 = 16.182769;
          const R = 6371e3; // metres
          const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
          const φ2 = (lat2 * Math.PI) / 180;
          const Δφ = ((lat2 - lat1) * Math.PI) / 180;
          const Δλ = ((lon2 - lon1) * Math.PI) / 180;

          const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          const d = R * c; // in metres

          const roundedDistance = Math.round(d);

          this.props.dispatchAction(updatePos(roundedDistance));

          const prevPosition = this.props.data.prevPosition;
          let nextPosition = '';

          if (roundedDistance <= 11) nextPosition = 'ENTRANCE';
          else if (roundedDistance < 150) nextPosition = 'ZONE';
          else nextPosition = 'AWAY';

          // prepare authentication in order to lock/unlock door at later stage
          if (
            !this.props.data.authenticated &&
            !this.props.data.awaitingAuth &&
            prevPosition === 'AWAY' &&
            nextPosition === 'ZONE'
          ) {
            this.authenticateAndPing(true);
          }

          if (prevPosition === 'ZONE' && nextPosition === 'ENTRANCE') {
            PushNotificationIOS.addNotificationRequest({
              id: 'test',
              title: 'Välkommen hem herr Rikard',
              subtitle: 'Jag öppnar dörren åt dig och tänder lamporna',
              body: '',
              category: 'test',
              threadId: 'thread-id',
              repeats: false,
            });
            if (this.props.data.authenticated) {
              await UnlockMain();
              await UnlockDoomanlock();
              await new Promise(r => setTimeout(r, 10000));
              this.authenticateAndPing(false);
            }
            await lightsControl(true);
            this.props.dispatchAction(toggleAll(true));

            BackgroundGeolocation.stop();
          }

          if (prevPosition === 'ZONE' && nextPosition === 'AWAY') {
            PushNotificationIOS.addNotificationRequest({
              id: 'test',
              title: 'Hejdå herr Rikard',
              subtitle: '',
              body: 'Jag låser och släcker lamporna åt dig',
              category: 'test',
              threadId: 'thread-id',
              repeats: false,
            });
            await lightsControl(false);
            this.props.dispatchAction(toggleAll(false));
          }

          this.props.dispatchAction(updatePositionState(nextPosition));
        },
        error => {
          console.log('[onLocation] ERROR:', error);
        },
      ),
    );

    /// 2. ready the plugin.
    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true, // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      url: 'http://yourserver.com/locations',
      batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
      headers: {
        // <-- Optional HTTP headers
        'X-FOO': 'bar',
      },
      params: {
        // <-- Optional HTTP params
        auth_token: 'maybe_your_server_authenticates_via_token_YES?',
      },
    }).then(state => {
      BackgroundGeolocation.start();
      // BackgroundGeolocation.getCurrentPosition();
    });
  };
  render() {
    return (
      <View styles={styles.row}>
        <View style={styles.textContainer}>
          <View style={styles.text}>
            <Text category="p2">GPS-automatisering</Text>
          </View>
          <OnOff
            active={this.props.data.gpsOn}
            onChange={e => {
              this.props.dispatchAction(startGps(e));
              if (e) {
                PushNotificationIOS.requestPermissions();
                this.startGpsTracker();
              } else {
                BackgroundGeolocation.stop();
              }
            }}></OnOff>
        </View>
        <View style={styles.textContainer}>
          <View style={styles.text}>
            <Text category="p2">Synka med dörrar</Text>
          </View>
          <OnOff
            active={this.props.data.toggledAuth}
            onChange={e => this.authenticateAndPing(e)}></OnOff>
        </View>
      </View>
    );
  }

  async authenticateAndPing(e) {
    if (!e) {
      this.props.dispatchAction(signOut());
      clearInterval(this.timer);
      logOff();
    } else {
      this.props.dispatchAction(signIn(e));
      await authenticateUser();
      //ping server for setting new aspx auth
      this.timer = setInterval(async () => {
        await pingServer().then(res => {
          CookieManager.getAll().then(res => {
            if (res['.ASPXAUTH']?.value) {
              this.props.dispatchAction(setAuthX(res['.ASPXAUTH'].value));
            }
          });
        });
      }, 20000);
    }
  }
}

const styles = StyleSheet.create({
  layout: {
    height: 500,
    width: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  textContainer: {
    marginVertical: '5%',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  text: {
    marginHorizontal: '5%',
  },
});

function mapStateToProps(state) {
  return {
    data: stateSelector(state),
  };
}

const mapDispatchToProps = dispatch => ({
  dispatchAction: action => dispatch(action),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
