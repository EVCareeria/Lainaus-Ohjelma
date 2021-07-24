import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, SafeAreaView, StyleSheet, Image, Pressable, Modal } from 'react-native';
import { DatabaseConnection } from '../database/Database';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { Alert } from 'react-native';
import ViewItem from './ViewItem';
import { ScrollView } from 'react-native-gesture-handler';

const db = DatabaseConnection.getConnection();

const ViewItemSearch = ({codetype, codedata, goback}) => {
  const [flatListItems, setFlatListItems] = useState([]);
  const [update, setUpdate] = useState()
  const [modalDelete, setModalDelete] = useState()

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM items WHERE codetype=?, codedata=?',
        [codetype, codedata],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
            setFlatListItems(temp);
          Alert.alert('Search completed')
          console.log(temp)
        }
      );
    });
  }, [scanner]);

  function updateFunction() {
    setUpdate(!update)
  }
  function deleteFunction() {
    setModalDelete(!modalDelete)
  }

  return(
    <SafeAreaView style={{flex:12}}>
      <Pressable onPress={() => setUpdate(!update)} style={{flex:1, justifyContent:'center', borderWidth:3, borderRadius:15, margin:15, borderColor:'blue', marginTop:50}}>
            <Text style={{textAlign:'center', fontSize:30}}>Update current list</Text>
        </Pressable>
      <View>
            
      </View>
    </SafeAreaView>
  )
}


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
  IoniconsStyle: {
    marginLeft: vw(40),
  }
});

export default ViewItemSearch;