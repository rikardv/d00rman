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
import GetStatus from './functions/GetStatus';
import Dashboard from './components/Dashboard';
import {Provider} from 'react-redux';
import store from './store';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default class App extends Component {
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

  render() {
    return (
      <Provider store={store}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.dark}>
          <View style={{flex: 1, backgroundColor: '#151515'}}>
            <Dashboard />
          </View>
        </ApplicationProvider>
      </Provider>
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
