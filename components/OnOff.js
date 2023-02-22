import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {Component} from 'react';
import {TouchableWithoutFeedback} from '@ui-kitten/components/devsupport';
import {Icon} from '@ui-kitten/components';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

var on = new Sound('on.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // if loaded successfully
  console.log(
    'duration in seconds: ' +
      on.getDuration() +
      'number of channels: ' +
      on.getNumberOfChannels(),
  );
});

var off = new Sound('off.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // if loaded successfully
  console.log(
    'duration in seconds: ' +
      off.getDuration() +
      'number of channels: ' +
      off.getNumberOfChannels(),
  );
});

export default class OnOff extends Component {
  state = {
    active: false,
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            off.play();
            this.props.onChange(false);
          }}
          disabled={!this.props.active}
          style={{
            ...styles.btn,
            backgroundColor: !this.props.active
              ? this.props.color ?? '#42AAFF'
              : 'grey',
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
          }}>
          {this.props.secondaryIcon ? (
            <Icon
              name={this.props.secondaryIcon}
              fill={'white'}
              size="giant"
              width={20}
              height={20}
            />
          ) : (
            <Text
              style={{
                color: 'white',
                fontWeight: '700',
              }}>
              Av
            </Text>
          )}
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            on.play();
            this.props.onChange(true);
          }}
          disabled={this.props.active}
          style={{
            ...styles.btn,
            backgroundColor: this.props.active
              ? this.props.color ?? '#42AAFF'
              : 'grey',
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
          }}>
          {this.props.primaryIcon ? (
            <Icon
              name={this.props.primaryIcon}
              fill={'white'}
              size="giant"
              width={20}
              height={20}
            />
          ) : (
            <Text
              style={{
                color: 'white',
                fontWeight: '700',
              }}>
              På
            </Text>
          )}
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,

    width: 100,
    height: 30,
    flexDirection: 'row',
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
