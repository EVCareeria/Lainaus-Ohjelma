import React, { useEffect, useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, SafeAreaView, Text, Image, TextInput, Pressable, Modal, Button} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as ImagePicker from 'expo-image-picker';


import { DatabaseConnection } from '../database/Database'

const db = DatabaseConnection.getConnection();

const UpdateItem = (props) => {
  const [itemID, setItemID] = useState(props.itemID);
  const [itemName, setItemName] = useState('');
  const [codeType, setCodeType] = useState('');
  const [codeData, setCodeData] = useState('');
  const [itemImage, setItemImage] = useState('')
  const [scanner, setScanner]= useState(false)
  const [imagePicker, setImagePicker] = useState(false)
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  let updateAllStates = (item_name, codetype, codedata, image) => {
    setItemName(item_name);
    setCodeType(codetype);
    setCodeData(codedata);
    setItemImage(image)
  };

  useEffect(() => {
      console.log(itemID);
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM items where item_id = ?',
          [itemID],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              let res = results.rows.item(0);
              updateAllStates(
                res.item_name,
                res.codetype,
                res.codedata,
                res.image
              );
            } else {
              alert('Usuário não encontrado!');
              updateAllStates('', '', '', '');
            }
          }
        );
      });
  }, [itemID])
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  function returnBack(){
    props.closeUpdate(false)
  }
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    setCodeType(type)
    setCodeData(data)
    setScanner(!scanner)
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      const {uri} = result
      setItemImage(uri)  
  
      if (!result.cancelled) {
        setItemImage(result.uri);
      }
      setTimeout(function(){setImagePicker(false)}, 2000)
    };
  
  const updateItem = () => {
    console.log(itemName, codeType, codeData, itemImage);

    if (!itemName) {
      alert('You need to add item name');
      return;
    }
    if (!codeType) {
      alert('Codetype is missing');
      return;
    }
    if (!codeData) {
      alert('Codedata is missing');
      return;
    }
    if (!itemImage) {
      alert('Image is missing');
      return;
    }  
    updateItemInfo()
  }
    function updateItemInfo() {
      db.transaction(function (tx) {
        tx.executeSql(
          'UPDATE items SET item_name=?, codetype=?, codedata=?, image=? WHERE item_id=?',
          [itemName, codeType, codeData, itemImage, itemID ],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert(
                'Success',
                'Information updated',
              );
            } else alert('Error while updating item');
            returnBack()
          }
        );
      });
    };

  return (
    <SafeAreaView style={{ flex: 12 }}>
      <View style={{ flex: 6, backgroundColor: 'white', justifyContent:'center' }}>
        <View style={{ flex: 1 }}>
        <Pressable onPress={returnBack} style={{alignContent:'center', backgroundColor:'white', zIndex:0}}>
            <Text style={{alignSelf:'center', justifyContent:'center', fontSize:30, borderWidth:2, borderRadius:15, padding:15,backgroundColor:'yellow', opacity:0.7}}>Sulje Modal Ikkuna</Text>
          </Pressable>
          <ScrollView fadingEdgeLength={150} style={{flex:6}}>
            <KeyboardAvoidingView
              style={{ flex: 1, justifyContent: 'space-between' }}>
              <TextInput
                placeholder="Item name"
                value={itemName}
                style={{ padding: 10, fontSize:25 }}
                onChangeText={
                  (itemName) => setItemName(itemName)
                }
              />
              <Text style={{fontSize:20}}>Codetype: {codeType}</Text>
              <Text style={{fontSize:20}}>Codedata: {codeData}</Text>
              <Pressable onPress={() => setScanner(!scanner)} style={{height: '15%', width: '85%', backgroundColor:'white', borderWidth: 3, borderRadius: 20,justifyContent:'center', alignSelf:'center'}}>
                        <Text style={{textAlign:'center', backgroundColor: 'white', height: 40, fontSize: 18, justifyContent:'center'}}>Lisää laitteen viivakoodi</Text>
                            {/* <TextInput value={itemName} onChangeText={text => setItemName({...itemName, code: text})} /> */}
                            {scanner ? (
                                 <Modal
                                 style={{flex:1}}
                                 animationType="slide"
                                 transparent={true}
                                 visible={true}
                                 >
                                    <View style={{justifyContent: 'center', flex: 6}}>
                                        <Pressable onPress={() => setScanner(!scanner)} style={{flex:1, alignContent:'center', backgroundColor:'white', zIndex:0}}>
                                            <Text style={{alignSelf:'center', justifyContent:'center', fontSize:30, borderWidth:2, borderRadius:15, padding:15,backgroundColor:'yellow'}}>Sulje Modal Ikkuna</Text>
                                        </Pressable>
                                        <BarCodeScanner
                                            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                                            style={{flex:5, justifyContent:'center'}}
                                        />
                                    {scanned && <Button style={{flex: 1}} title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
                                    </View>
                                 </Modal>
                             ) : null}
                </Pressable>
                <Text style={{fontSize:20}}>Image:</Text>
                <Image source={{ uri: itemImage }} style={{ width: 200, height: 200, justifyContent:'center', alignSelf:'center' }} />
                <Pressable onPress={() => setImagePicker(!imagePicker)} style={{height: '15%', width: '85%', backgroundColor:'white', borderWidth: 3, borderRadius: 20,justifyContent:'center', alignSelf:'center'}}>
                        <Text style={{textAlign:'center', backgroundColor: 'white', height: 40, fontSize: 18, justifyContent:'center'}}>Lisää laitteen kuva</Text>
                            {/* <TextInput value={itemName} onChangeText={text => setItemName({...itemName, code: text})} /> */}
                            {imagePicker ? (
                                 <Modal
                                 style={{flex:1}}
                                 animationType="slide"
                                 transparent={true}
                                 visible={true}
                                 >
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Button style={{flex:1}} title="Pick an image from camera roll" onPress={pickImage} />
                                        {itemImage && <Image source={{ uri: itemImage }} style={{ width: 200, height: 200 }} />}
                                    </View>
                                 </Modal>
                             ) : null}
                </Pressable>
              <Pressable onPress={updateItem}>
                <Text style={{justifyContent:'center', textAlign:'center', borderWidth:3, margin:50, padding:20, borderRadius:20, color:'green', bottom:'25%'}}>Update item</Text>
              </Pressable>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UpdateItem;