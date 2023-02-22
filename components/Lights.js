import React, {Component} from 'react';
import {ActivityIndicator, FlatList, View, StyleSheet} from 'react-native';
import {Text} from '@ui-kitten/components';
import OnOff from './OnOff';
import {apiKey, apiUrl} from '../secrets';
import {createSelector} from '@reduxjs/toolkit';
import {connect} from 'react-redux';
import {toggleLight} from '../actions';

class Lights extends Component {
  render() {
    return (
      <View styles={styles.row}>
        <View style={styles.textContainer}>
          <View style={styles.text}>
            <Text category="s2">Golv</Text>
          </View>
          <OnOff
            primaryIcon={'bulb-outline'}
            secondaryIcon={'flash-off-outline'}
            active={this.props.data.lights[0].on}
            onChange={() =>
              this.sendLightCommand(this.props.data.lights[0])
            }></OnOff>
        </View>
        <View style={styles.textContainer}>
          <View style={styles.text}>
            <Text category="s2">Hall</Text>
          </View>
          <OnOff
            primaryIcon={'bulb-outline'}
            secondaryIcon={'flash-off-outline'}
            active={this.props.data.lights[1].on}
            onChange={() =>
              this.sendLightCommand(this.props.data.lights[1])
            }></OnOff>
        </View>
        <View style={styles.textContainer}>
          <View style={styles.text}>
            <Text category="s2">Skrivbord</Text>
          </View>
          <OnOff
            primaryIcon={'bulb-outline'}
            secondaryIcon={'flash-off-outline'}
            active={this.props.data.lights[2].on}
            onChange={() =>
              this.sendLightCommand(this.props.data.lights[2])
            }></OnOff>
        </View>
      </View>
    );
  }

  sendLightCommand = async light => {
    // this.setState({[id]: !this.state[id]});
    this.props.dispatchAction(toggleLight(light.id));
    var myHeaders = new Headers();
    myHeaders.append('x-api-key', apiKey);
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      pin_number: 0,
      emitter_id: 31415,
      receiver_id: light.id,
      action: !light.on ? 'on' : 'off',
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    await fetch(apiUrl, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  };
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

export default connect(mapStateToProps, mapDispatchToProps)(Lights);
