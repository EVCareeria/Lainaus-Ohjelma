import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Items from './components/Items'
import Scanner from './components/Scanner';

export default function App() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Items />
        <Scanner />
      </ScrollView>
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
