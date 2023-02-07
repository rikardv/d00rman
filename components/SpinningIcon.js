import React, {Component} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';

class SpinningIcon extends Component {
  state = {
    spinValue: new Animated.Value(0),
  };

  componentDidMount() {
    Animated.loop(
      Animated.timing(this.state.spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  }

  render() {
    const spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={styles.container}>
        <Animated.Image
          source={require('../icons8-synchronize-60.png')}
          style={{transform: [{rotate: spin}], width: 15, height: 15}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SpinningIcon;
