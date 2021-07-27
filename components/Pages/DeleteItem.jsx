import React, { useState } from 'react';
import { View, Alert, SafeAreaView, Image, Text, Pressable } from 'react-native';
import { DatabaseConnection } from '../database/Database';
import { vw, vh } from 'react-native-expo-viewport-units';

const db = DatabaseConnection.getConnection();

const DeleteItem = (props) => {
  const [confirm, setConfirm] = useState()

  function returnBack(){
    props.closeDelete(false)
  }

  function deleteItem () {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM  items where item_id=?',
        [props.itemID],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Item deleted from database, List updates soon',
            );
          } else {
            alert('Something went wrong while trying to delete item, updating list');
          }
          props.closeDelete(false)
          setTimeout(function(){props.setDeleteModal(true)}, 3000)
        }
      );
    });
  };

  return (
    <SafeAreaView style={{ flex: 12 }}>
      <View style={{ flex: 10, backgroundColor: 'white', margin:50 }}>
          <Pressable onPress={returnBack} style={{flex:1, alignContent:'center', backgroundColor:'white', zIndex:0}}>
            <Text style={{alignSelf:'center', justifyContent:'center', fontSize:30, borderWidth:2, borderRadius:15, padding:15,backgroundColor:'yellow', opacity:0.7}}>Sulje Modal Ikkuna</Text>
          </Pressable>
          <Pressable onPress={deleteItem} style={{flex:1, alignContent:'center', backgroundColor:'white', zIndex:0}}>
            <Text style={{alignSelf:'center', justifyContent:'center', fontSize:30, borderWidth:2, borderRadius:15, padding:15,backgroundColor:'red', opacity:0.7}}>Poista itemi</Text>
          </Pressable>
        <Text style={{borderWidth:3, borderRadius:15, fontSize:20, textAlign:'center',margin:20}}>ID{props.itemID}</Text>
        <Text style={{borderWidth:3, borderRadius:15, fontSize:20, textAlign:'center', margin:20}}>Name{props.itemName}</Text>
        <Text style={{borderWidth:3, borderRadius:15, fontSize:20, textAlign:'center', margin:20}}>Image</Text>
        <Image source={{ uri: props.itemImage }} style={{ width: vw(50), height: vh(25), justifyContent:'center',alignSelf:'center' }} />
      </View>
    </SafeAreaView>
  );
};

export default DeleteItem;
