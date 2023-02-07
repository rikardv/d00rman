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

export default class Lights extends Component {
  state = {
    checked: true,
  };
  render() {
    return (
      <View styles={styles.row}>
        <View style={styles.textContainer}>
          <View style={styles.text}>
            <Text category="p2">Skrivbord</Text>
          </View>
          <Toggle
            status="info"
            checked={this.state.checked}
            onChange={() => this.setState({checked: !this.state.checked})}
          />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.text}>
            <Text category="p2">Golv</Text>
          </View>
          <Toggle
            status="info"
            checked={this.state.checked}
            onChange={() => this.setState({checked: !this.state.checked})}
          />
        </View>
      </View>
    );
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
    justifyContent: 'space-between',
  },
  text: {
    marginHorizontal: '5%',
  },
});
