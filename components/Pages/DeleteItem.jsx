import React, { useState } from 'react';
import { View, Alert, SafeAreaView, Image, Text, Pressable } from 'react-native';
import { DatabaseConnection } from '../database/Database';
import { vw, vh } from 'react-native-expo-viewport-units';
import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const db = DatabaseConnection.getConnection();

const DeleteItem = (props) => {
  const [confirm, setConfirm] = useState()

  const { colors } = useTheme();

  const { itemID, itemName, itemImage } = props
  
  function returnBack() {
    props.closeDelete(false)
  }

  function deleteItem() {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM items WHERE item_id = ?',[itemID],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Item deleted from database, List updates soon',
            );
          } else {
            alert('Something went wrong while trying to delete item, updating list');
          }
          props.closeDelete(false)
          setTimeout(function () { props.setDeleteModal(true) }, 3000)
        }
      );
    });
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <View style={{display:'flex', flex: 6, flexDirection: 'column', backgroundColor: colors.background, justifyContent: 'center', paddingTop: '20%', paddingBottom: '20%' }}>
        <Pressable onPress={returnBack} style={{ flex: 1, alignContent: 'center', zIndex: 0 }}>
          <Text style={{ alignSelf: 'center', justifyContent: 'center', fontSize: 30, borderWidth: 2, borderRadius: 15, padding: '3%', backgroundColor: 'yellow', opacity: 0.7 }}>Close this window</Text>
        </Pressable>
        <Pressable onPress={deleteItem} style={{ flex: 1, alignContent: 'center', zIndex: 0 }}>
          <Text style={{ alignSelf: 'center', justifyContent: 'center', fontSize: 30, borderWidth: 2, borderRadius: 15, padding: '3%', backgroundColor: 'red', opacity: 0.7 }}>Delete this item</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', padding: '2%', flex: 3 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center', paddingBottom: '20%', width: '50%' }}>
            <Text style={[styles.textheader, {color:colors.text}]}>ID: </Text>
            <Text style={[styles.textbottom, {color:colors.text}]}>{itemID}</Text>
            <Text style={[styles.textheader, {color:colors.text}]}>Name: </Text>
            <Text style={[styles.textbottom, {color:colors.text}]}>{itemName}</Text>
          </View>
          <View style={{ flex: 2 }}>
            {props.itemImage ? <Image source={{ uri: itemImage }} style={styles.ImageStyle} /> : null}
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  textheader: {
    fontSize: 26,
    fontWeight: '700',
    margin: 2,
    fontFamily: 'RobotoMedium',
  },
  textbottom: {
    fontSize: 22,
    fontFamily: 'AssistantMedium',
    textDecorationLine: 'underline',
  },
  ImageStyle: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: vw(70),
    height: vh(20),
    margin: '5%',
  },
  PressableStyle: {
    height: '10%',
    width: '90%',
    backgroundColor: 'white',
    borderWidth: 3,
    borderRadius: 15,
    justifyContent: 'center',
    alignSelf: 'center'
  }, PressableTextStyle: {
    fontSize: 22,
    fontWeight: '500',
    margin: 2,
    fontFamily: 'RobotoMedium',
    textAlign: 'center',
  }
});

export default DeleteItem;
