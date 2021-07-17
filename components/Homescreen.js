import React, { useEffect } from 'react';
import { View, SafeAreaView, Button, Text } from 'react-native';
import { DatabaseConnection } from './database/Database';

const db = DatabaseConnection.getConnection();

const HomeScreen = ({navigation}) => {
  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='items'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS items', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS items(item_id INTEGER PRIMARY KEY AUTOINCREMENT, item_name VARCHAR(30), codetype VARCHAR(25), codedata VARCHAR(255), image VARCHAR(255))',
              []
            );
            console.log('Database lisätty')
          }
        }
      );
    });
  }, []);

  return (
    <View style={{flex:6}}>
        <Text style={{textAlign:'center', justifyContent:'center'}}>Jotain sisältöä</Text>
    </View>
  );
};

export default HomeScreen;