import React, { useEffect } from 'react';
import { View, Pressable, Text, StyleSheet, Image } from 'react-native';
import { DatabaseConnection } from './database/Database';
import { createStackNavigator } from '@react-navigation/stack';
import Scanner from './Scanner';
import Item from './Item';
import ViewItems from './Pages/ViewItems';
import { vw, vh } from 'react-native-expo-viewport-units';
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
    //Käytetään Tietokanta items nollaukseen / Used to empty items table from information

    /* db.transaction(function (txn) {
      txn.executeSql('drop table items')
    }) */

    db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
      console.log('Foreign keys turned on')
    );

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='items'",
        [],
        function (tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS items', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS items(item_id INTEGER PRIMARY KEY AUTOINCREMENT, item_name VARCHAR(50), codetype VARCHAR(25), codedata VARCHAR(255), image VARCHAR(255), loanstatus VARCHAR(25))',
              []
            );
          }
        }
      );
    });
    //Käytetään Tietokanta loantable nollaukseen / Used to empty loantable from information

    /* db.transaction(function (txn) {
      txn.executeSql('drop table loantable')
    }) */

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='loantable'",
        [],
        function (tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS loantable', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS loantable(loan_id INTEGER PRIMARY KEY AUTOINCREMENT, loaner VARCHAR(50), startdate VARCHAR(25), enddate VARCHAR(25), loanorder INTEGER, item_reference INTEGER REFERENCES items(item_id))',
              []
            );
          }
        }
      );
    });
  }, []);


  return (
    <View style={{ flex: 6, justifyContent: 'center' }}>
      <Image source={require('../assets/BGimg.jpg')} style={{position:'absolute', width:'100%',height:'100%'}} />
      <Text style={{ textAlign: 'center', justifyContent: 'center', fontSize: 36, padding: '10%', textTransform: 'uppercase', fontFamily: 'RobotoMedium' }}>HOME</Text>
      <View style={styles.moduleStyle}>
        <Pressable style={{display:'flex', flex: 1, justifyContent: 'center' }} onPress={() => navigation.navigate('Scanner')} style={({pressed}) =>[{backgroundColor: pressed ? 'red' : 'transparent'}]}>
          <Text style={{ fontSize: 26, borderWidth: 3, borderRadius: 15, padding: '20%', borderColor: 'blue', fontFamily: 'RobotoMedium', textAlign:'center',backgroundColor:'#F6F4EC' }}>Scanner search</Text>
        </Pressable>
      </View>
      <View style={styles.moduleStyle}>
        <Pressable style={{display:'flex', flex: 1, justifyContent: 'center' }} onPress={() => navigation.navigate('Item')} style={({pressed}) =>[{backgroundColor: pressed ? 'red' : 'transparent'}]} >
          <Text style={{ fontSize: 26, borderWidth: 3, borderRadius: 15, padding: '20%', borderColor: 'green', fontFamily: 'RobotoMedium', textAlign:'center',backgroundColor:'#F6F4EC' }}>Add item</Text>
        </Pressable>
      </View>
      <View style={styles.moduleStyle}>
        <Pressable style={{display:'flex', flex: 1, justifyContent: 'center' }} onPress={() => navigation.navigate('ViewItems')} style={({pressed}) =>[{backgroundColor: pressed ? 'red' : 'transparent'}]} >
          <Text style={{ fontSize: 26, borderWidth: 3, borderRadius: 15, padding: '20%', borderColor: 'cyan', fontFamily: 'RobotoMedium', textAlign:'center',backgroundColor:'#F6F4EC' }}>Browse items</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  moduleStyle: {
    display:'flex',
    flex: 2,
    justifyContent: 'center',
    margin: '10%',
    padding: '15%',
    width:vw(100),
    alignSelf:'center',
    
  },
})

export default HomeScreen;
