import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, Pressable, Image } from 'react-native';
import { DatabaseConnection } from '../database/Database';
import { vw, vh } from 'react-native-expo-viewport-units';
import { Alert } from 'react-native';
import ViewItem from './ViewItem';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from '@react-navigation/native';

const db = DatabaseConnection.getConnection();

const ViewItems = ({ navigation }) => {
  const [flatListItems, setFlatListItems] = useState([]);
  const [update, setUpdate] = useState()
  const [modalDelete, setModalDelete] = useState()
  const [loan, setLoan] = useState()
  const { colors } = useTheme();

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
        }
      );
    });
  }, [update, modalDelete, loan]);


  function updateFunction() {
    setUpdate(!update)
  }
  function deleteFunction() {
    setModalDelete(!modalDelete)
  }
  function loanFunction() {
    setLoan(!loan)
  }

  return (
    <SafeAreaView style={{display:'flex', flex: 10, flexDirection:'column' }}>
      <View style={{ flex: 1, justifyContent: 'center', borderWidth: 3, borderRadius: 15, margin: 15, borderColor: 'blue', marginTop: 20, backgroundColor:'#F6F4EC' }}>
      <Pressable onPress={() => setUpdate(!update)} style={({pressed}) =>[{borderWidth: pressed ? 5 : 0}]} >
        <Text style={{ textAlign: 'center', fontSize: 30, fontFamily: 'RobotoMedium' }}>Update current list</Text>
      </Pressable>
      </View>
      <View style={{display:'flex', flex: 11 }}>
        <ScrollView fadingEdgeLength={100}>
          {flatListItems.map((i) => (
            <Pressable style={{display:'flex', flex: 2, margin: 3 }} key={i.item_id}>
              <ViewItem itemID={i.item_id} itemName={i.item_name} codetype={i.codetype} codedata={i.codedata} image={i.image} loanStatus={i.loanstatus} setUpdateModal={updateFunction} setDeleteModal={deleteFunction} setLoanModal={loanFunction} />
            </Pressable>
          ))}
        </ScrollView>
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

export default ViewItems;
