import React, { useEffect } from 'react';
import { View, Pressable, Text } from 'react-native';
import { DatabaseConnection } from './database/Database';
import { createStackNavigator } from '@react-navigation/stack';
import Scanner from './Scanner';
import Item from './Item';
import ViewItems from './Pages/ViewItems';

const Stack = createStackNavigator();

const db = DatabaseConnection.getConnection();

export function ScannerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Scanner" component={Scanner} />
      <Stack.Screen name="Item" component={Item} />
      <Stack.Screen name="ViewItems" component={ViewItems} />
    </Stack.Navigator>
  );
}

const HomeScreen = ({ navigation }) => {

  useEffect(() => {
    /* db.transaction(function (txn) {
      txn.executeSql('drop table items')
    }) */
    
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='items'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS items', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS items(item_id INTEGER PRIMARY KEY AUTOINCREMENT, item_name VARCHAR(30), codetype VARCHAR(25), codedata VARCHAR(255), image VARCHAR(255), )',
              []
            );
            console.log('Database lisätty')
          }
        }
      );
    });
  }, []);

  useEffect(() => {
    /* db.transaction(function (txn) {
      txn.executeSql('drop table loantable')
    }) */

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='loantable'",
        [],
        function (tx, res) {
          console.log('loantable:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS loantable', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS loantable(loan_id INTEGER PRIMARY KEY AUTOINCREMENT, loaner VARCHAR(50), startdate VARCHAR(25), enddate VARCHAR(25), loanstatus INTEGER, item_reference INTEGER REFERENCES items(item_id))',
              []
            );
            console.log('Taulu loantable lisätty')
          }
        }
      );
    });
  }, []);

  return (
    <View style={{ flex: 12, justifyContent: 'center', alignSelf: 'center' }}>
      <Text style={{ textAlign: 'center', justifyContent: 'center', fontSize: 30, padding: '10%', textTransform:'uppercase' }}>HOME</Text>
      <View style={{ flex: 2, justifyContent: 'center', margin: 30, padding: '15%' }}>
        <Pressable style={{ flex: 1, justifyContent: 'center' }} onPress={() => navigation.navigate('Scanner')}>
          <Text style={{ fontSize: 20, borderWidth: 3, borderRadius: 15, padding: '20%', borderColor: 'blue' }}>Scannaa itemi</Text>
        </Pressable>
      </View>
      <View style={{ flex: 2, justifyContent: 'center', margin: 30, padding: '15%' }}>
        <Pressable style={{ flex: 1, justifyContent: 'center' }} onPress={() => navigation.navigate('Item')}>
          <Text style={{ fontSize: 20, borderWidth: 3, borderRadius: 15, padding: '20%', borderColor: 'green' }}>Lisää itemi</Text>
        </Pressable>
      </View>
      <View style={{ flex: 2, justifyContent: 'center', margin: 30, padding: '15%' }}>
        <Pressable style={{ flex: 1, justifyContent: 'center' }} onPress={() => navigation.navigate('ViewItems')}>
          <Text style={{ fontSize: 20, borderWidth: 3, borderRadius: 15, padding: '20%', borderColor: 'cyan' }}>Selaa itemeitä</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default HomeScreen;
