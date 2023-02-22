import React, {Component} from 'react';
import {ActivityIndicator, FlatList, View, StyleSheet} from 'react-native';
import {Layout, Text, Icon, Divider} from '@ui-kitten/components';
import Doors from './Doors';
import SpinningIcon from './SpinningIcon';
import Settings from './Settings';

import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import Lights from './Lights';

const iconProps = {
  LOCATION: {
    name: 'navigation-2-outline',
    fill: '#0495EE',
    text: 'till hem',
    spinning: false,
  },
  SYNCING: {
    name: 'sync-outline',
    fill: '#FFBE43',
    text: 'Synkar med lås',
    spinning: true,
  },
  AWAY: {
    name: 'home-outline',
    fill: '#FFBE43',
    text: 'Borta',
    spinning: false,
  },
  ZONE: {
    name: 'home-outline',
    fill: '#60AF20',
    text: 'Zon',
    spinning: false,
  },
  ENTRANCE: {
    name: 'home-outline',
    fill: '#60AF20',
    text: 'Entré',
    spinning: false,
  },
  SYNCED: {
    name: 'checkmark-outline',
    fill: '#60AF20',
    text: 'Synkad',
    spinning: false,
  },
  AWAIT_AUTH: {
    name: 'sync-outline',
    fill: '#FFBE43',
    text: 'Loggar in',
    spinning: true,
  },
  AUTHENTICATED: {
    name: 'checkmark-outline',
    fill: '#60AF20',
    text: 'Inloggad',
    spinning: false,
  },
  NOT_LOGGED_IN: {
    name: 'close-outline',
    fill: 'red',
    text: 'Ej inloggad',
    spinning: false,
  },
  NO_GPS_ACTIVATED: {
    name: 'close-outline',
    fill: 'red',
    text: 'GPS avstängd',
  },
  OK_BATTERY: {
    name: 'battery-outline',
    fill: '#60AF20',
    text: 'Batteri',
    spinning: false,
  },
  LOW_BATTERY: {
    name: 'battery-outline',
    fill: 'red',
    text: 'Lågt batteri',
    spinning: false,
  },
};

const CustomIcon = (name, extra) => (
  <View style={styles.section}>
    <View style={styles.textContainer}>
      <Text style={styles.text}>{extra ?? iconProps[name].text}</Text>
      {iconProps[name].spinning ? (
        <SpinningIcon />
      ) : (
        <Icon
          name={iconProps[name].name}
          fill={iconProps[name].fill}
          size="giant"
          width={15}
          height={15}
        />
      )}
    </View>
  </View>
);

class Dashboard extends Component {
  render() {
    const {
      synced,
      syncing,
      awaitingAuth,
      authenticated,
      distanceToZone,
      gpsOn,
      prevPosition,
      lowBattery,
    } = this.props.data;
    return (
      <Layout style={styles.layout}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            {gpsOn && CustomIcon('LOCATION', `${distanceToZone}m till entré`)}
            {gpsOn &&
              (prevPosition === 'ZONE'
                ? CustomIcon('ZONE')
                : prevPosition === 'ENTRANCE'
                ? CustomIcon('ENTRANCE')
                : CustomIcon('AWAY'))}
            {!gpsOn && CustomIcon('NO_GPS_ACTIVATED')}
          </View>
          <View>
            {syncing && CustomIcon('SYNCING')}

            {synced && CustomIcon('SYNCED')}

            {awaitingAuth && CustomIcon('AWAIT_AUTH')}

            {authenticated && CustomIcon('AUTHENTICATED')}

            {!awaitingAuth && !authenticated && CustomIcon('NOT_LOGGED_IN')}

            {authenticated &&
              synced &&
              (!lowBattery
                ? CustomIcon('OK_BATTERY')
                : CustomIcon('LOW_BATTERY'))}
          </View>
        </View>
        {!!authenticated && (
          <View>
            <Divider
              style={{backgroundColor: '#757575', marginVertical: '5%'}}
            />

            <Doors />
          </View>
        )}
        <Divider style={{backgroundColor: '#757575', marginVertical: '5%'}} />
        <Lights />
        <Divider style={{backgroundColor: '#757575', marginVertical: '5%'}} />
        <Settings />
        {!!this.props.data.showModal && (
          <View
            style={{
              marginTop: '20%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text category="s1">{this.props.data.modalText}</Text>
          </View>
        )}
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: '#151515',
    marginVertical: '15%',
    paddingHorizontal: '5%',
  },

  section: {
    marginVertical: '1%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    fontSize: 13,
    fontWeight: '200',
    marginRight: '5%',
  },

  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export const stateSelector = createSelector(
  state => state,
  data => data,
);

function mapStateToProps(state) {
  return {
    data: stateSelector(state),
  };
}

export default connect(mapStateToProps)(Dashboard);
