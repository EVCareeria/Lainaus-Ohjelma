import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, SafeAreaView, StyleSheet, Image, Pressable } from 'react-native';
import { DatabaseConnection } from './database/Database';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { Alert } from 'react-native';

const db = DatabaseConnection.getConnection();

const ViewItems = () => {
  let [flatListItems, setFlatListItems] = useState([]);
  const [update, setUpdate] = useState()

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM items',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFlatListItems(temp);
          Alert.alert('List updated')
          console.log(temp)
        }
      );
    });
  }, [update]);

  let listItemView = (item) => {
    return (
      <View
        key={item.item_id}
        style={{ backgroundColor: '#EEE', marginTop: 20, padding: 30, borderRadius: 10 }}>
        <Text style={styles.textheader}>ID</Text>
        <Text style={styles.textbottom}>{item.item_id}</Text>

        <Text style={styles.textheader}>Name</Text>
        <Text style={styles.textbottom}>{item.item_name}</Text>

        <Text style={styles.textheader}>Type</Text>
        <Text style={styles.textbottom}>{item.codetype}</Text>

        <Text style={styles.textheader}>Data</Text>
        <Text style={styles.textbottom}>{item.codedata}</Text>

        <Text style={styles.textheader}>Image</Text>
        <Image source={{ uri: item.image }} style={{ width: vw(50), height: vh(25) }} />


      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 12 }}>
        <Pressable onPress={() => setUpdate(!update)} style={{flex:2, justifyContent:'center', borderWidth:3, borderRadius:15, margin:15}}>
            <Text style={{textAlign:'center', fontSize:30}}>Update current list</Text>
        </Pressable>
      <View style={{ flex: 10, backgroundColor: 'white' }}>
        <View style={{ flex: 2 }}>
          <FlatList
            style={{ marginTop: 30 }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            data={flatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textheader: {
    color: '#111',
    fontSize: 12,
    fontWeight: '700',

  },
  textbottom: {
    color: '#111',
    fontSize: 18,
  },
});

export default ViewItems;