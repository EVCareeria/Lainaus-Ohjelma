import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Items from './components/Items'

export default function App() {
  return (
    <View style={styles.container}>
      <Items />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7ba1c9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
