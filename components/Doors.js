import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@ui-kitten/components';
import {connect} from 'react-redux';
import {createSelector} from '@reduxjs/toolkit';
import {toggleApartmentDoor, toggleMainEntranceDoor} from '../actions';
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
            <Text category="s2">Entrédörr</Text>
          </View>
          <OnOff
            primaryIcon={'unlock-outline'}
            secondaryIcon={'lock-outline'}
            displayLocks
            active={this.props.data.mainEntranceUnlocked}
            onChange={e => this.mainDoorLogic(e)}></OnOff>
        </View>
        <View style={styles.textContainer}>
          <View style={styles.text}>
            <Text category="s2">Lägenhetsdörr</Text>
          </View>
          <OnOff
            primaryIcon={'unlock-outline'}
            secondaryIcon={'lock-outline'}
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
