import React, { useEffect } from 'react';
import { View, Pressable, Text, StyleSheet, Image } from 'react-native';
import { DatabaseConnection } from './database/Database';
import { createStackNavigator } from '@react-navigation/stack';
import Scanner from './Scanner';
import Item from './Item';
import ViewItems from './Pages/ViewItems';
import { vw, vh } from 'react-native-expo-viewport-units';
import * as ScreenOrientation from 'expo-screen-orientation';
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

  /*  useEffect(()=> {
      //Käytetään Tietokanta items nollaukseen / Used to empty items table from information
      
     db.transaction(function (txn) {
       txn.executeSql('drop table items')
     })
     
      //Käytetään Tietokanta loantable nollaukseen / Used to empty loantable from information
 
     db.transaction(function (txn) {
       txn.executeSql('drop table loantable')
     })
   }, []) */

  useEffect(() => {
    let updateTable = true;



    if (updateTable == true) {

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
      updateTable = false
    }
  }, []);


  return (
    <View style={styles.portrait} >
      <Image source={require('../assets/BGimg.jpg')} style={{ position: 'absolute', width: '100%', height: '140%' }} />
      <View styles={{flex:1}} >
        <Text style={{textAlign: 'center', fontSize: vh(6), padding: '5%', textTransform: 'uppercase', fontFamily: 'RobotoMedium', color:'#4475f2', textShadowRadius:10, textShadowColor:'white'}} >HOME</Text>
      </View>
      <View style={{flex:2, width:vw(75), minHeight:vh(10), padding:vh(2)}} >
        <Pressable  onPress={() => navigation.navigate('Scanner')} style={({ pressed }) => [{ backgroundColor: pressed ? '#2b758a' : 'white' }, styles.PressableOn]}>
          <Text style={{textAlign:'center', fontSize: vh(3), textTransform:'uppercase'}} >Scanner search</Text>
        </Pressable>
      </View>
      <View style={{flex:2, width:vw(75),minHeight:vh(10), padding:vh(2)}} >
        <Pressable  onPress={() => navigation.navigate('Item')} style={({ pressed }) => [{ backgroundColor: pressed ? '#2b758a' : 'white' }, styles.PressableOn]} >
          <Text style={{textAlign:'center', fontSize: vh(3), textTransform:'uppercase'}} >Add item</Text>
        </Pressable>
      </View>
      <View style={{flex:2, width:vw(75),minHeight:vh(10), padding:vh(2)}} >
        <Pressable  onPress={() => navigation.navigate('ViewItems')} style={({ pressed }) => [{ backgroundColor: pressed ? '#2b758a' : 'white' }, styles.PressableOn]} >
          <Text style={{textAlign:'center', fontSize: vh(3), textTransform:'uppercase'}} >Browse items</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  portrait: {
    display: 'flex',
    flex:2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'column',
    height: vh(120),
    paddingBottom:'5%',
    paddingTop:'5%',
  },
  moduleStyle: {
    display: 'flex',
    justifyContent: 'center',
    margin:'10%',
    width: vw(80),
    alignSelf: 'center',
  },
  PressableOn: {
    borderWidth: 3,
    borderRadius: 15,
  },
})

export default HomeScreen;
