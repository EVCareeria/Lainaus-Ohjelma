import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, SafeAreaView, StyleSheet, Image, Pressable, Modal } from 'react-native';
import { DatabaseConnection } from '../database/Database';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { Alert } from 'react-native';
import ViewItem from './ViewItem';
import { ScrollView } from 'react-native-gesture-handler';

const db = DatabaseConnection.getConnection();

const ViewItems = () => {
  const [flatListItems, setFlatListItems] = useState([]);
  const [update, setUpdate] = useState()
  const [modalDelete, setModalDelete] = useState()

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
  }, [update, modalDelete]);

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
      <View style={{flex:11}}>
        <ScrollView fadingEdgeLength={150}>
            {flatListItems.map((i) => (
              <Pressable style={{flex:1, margin: 10}} key={i.item_id}>
                <ViewItem itemID={i.item_id} itemName={i.item_name} codetype={i.codetype} codedata={i.codedata} image={i.image} setUpdateModal={updateFunction} setDeleteModal={deleteFunction} />
              </Pressable>
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

/*   let listItemView = (item) => {
    return (
      <View
        key={item.item_id}
        style={{ backgroundColor: '#EEE', marginTop: 20, padding: 30, borderRadius: 10 }}>
            
        <Text style={styles.textheader}>ID</Text>
        <Text style={styles.textbottom}>{item.item_id}</Text>

        <Pressable onPress={() => setDel(!del)} style={{width:vw(10), height:vh(10), backgroundColor:'red'}}>
                <Entypo style={styles.IoniconsStyle} name="trash" size={24} color="black" />
        </Pressable>
        {del ? <Modal>
          <DeleteItem itemID={item.item_id} itemName={item.item_name} itemImage={item.image} closeDelete={closeDelete} />
        </Modal>
        : null}

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
}; */

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