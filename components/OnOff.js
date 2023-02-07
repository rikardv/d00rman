import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {Component} from 'react';
import {TouchableWithoutFeedback} from '@ui-kitten/components/devsupport';
import {Icon} from '@ui-kitten/components';

export default class OnOff extends Component {
  state = {
    active: false,
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => this.props.onChange(false)}
          style={{
            ...styles.btn,
            backgroundColor: !this.props.active ? '#42AAFF' : 'grey',
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
          }}>
          {this.props.displayLocks ? (
            <Icon
              name={'lock-outline'}
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
              OFF
            </Text>
          )}
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => this.props.onChange(true)}
          style={{
            ...styles.btn,
            backgroundColor: this.props.active ? '#42AAFF' : 'grey',
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
          }}>
          {this.props.displayLocks ? (
            <Icon
              name={'unlock-outline'}
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
              ON
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
