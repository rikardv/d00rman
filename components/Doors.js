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
  Toggle,
  Card,
} from '@ui-kitten/components';
import {connect} from 'react-redux';
import {createSelector} from '@reduxjs/toolkit';
import {
  synced,
  syncing,
  toggleApartmentDoor,
  toggleMainEntranceDoor,
} from '../actions';
import UnlockDoomanlock from '../functions/UnlockDoomanlock';
import UnlockMain from '../functions/UnlockMain';
import LockDoomanlock from '../functions/LockDoomanlock';
import OnOff from './OnOff';

class Doors extends Component {
  render() {
    return (
      <View styles={styles.row}>
        <View style={styles.textContainer}>
          <View style={styles.text}>
            <Text category="s1">Entrédörr</Text>
          </View>
          <OnOff
            displayLocks
            active={this.props.data.mainEntranceUnlocked}
            onChange={e => this.mainDoorLogic(e)}></OnOff>
        </View>
        <View style={styles.textContainer}>
          <View style={styles.text}>
            <Text category="s1">Lägenhetsdörr</Text>
          </View>
          <OnOff
            displayLocks
            active={this.props.data.apartmentUnlocked}
            onChange={e => {
              this.props.dispatchAction(toggleApartmentDoor(e));
              this.doorLogic(e);
            }}></OnOff>
        </View>
      </View>
    );
  }

  async doorLogic(e) {
    if (e) {
      await UnlockDoomanlock();
    } else {
      await LockDoomanlock();
    }
  }

  async mainDoorLogic(e) {
    this.props.dispatchAction(toggleMainEntranceDoor(e));
    await UnlockMain();

    await new Promise(resolve => setTimeout(resolve, 3000)).then(() => {
      this.props.dispatchAction(toggleMainEntranceDoor(false));
    });
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

const stateSelector = createSelector(
  state => state,
  data => data,
);

function mapStateToProps(state) {
  return {
    data: stateSelector(state),
  };
}

const mapDispatchToProps = dispatch => ({
  dispatchAction: action => dispatch(action),
});

export default connect(mapStateToProps, mapDispatchToProps)(Doors);
