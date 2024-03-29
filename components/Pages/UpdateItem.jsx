import React, { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Alert, SafeAreaView, Text, Image, TextInput, Pressable, Modal, Button, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as ImagePicker from 'expo-image-picker';
import { vw, vh } from 'react-native-expo-viewport-units';


import { DatabaseConnection } from '../database/Database'
import { useTheme } from '@react-navigation/native';

const db = DatabaseConnection.getConnection();

const UpdateItem = (props) => {
  const [itemID, setItemID] = useState(props.itemID);
  const [itemName, setItemName] = useState('');
  const [codeType, setCodeType] = useState('');
  const [codeData, setCodeData] = useState('');
  const [itemImage, setItemImage] = useState('')
  const [scanner, setScanner] = useState(false)
  const [imagePicker, setImagePicker] = useState(false)
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const {colors} = useTheme()

  let updateAllStates = (item_name, codetype, codedata, image) => {
    setItemName(item_name);
    setCodeType(codetype);
    setCodeData(codedata);
    setItemImage(image)
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT item_name, codetype, codedata, image FROM items where item_id = ?',
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
  function returnBack() {
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

    const { uri } = result
    setItemImage(uri)

    if (!result.cancelled) {
      setItemImage(result.uri);
    }
    setTimeout(function () { setImagePicker(false) }, 2000)
  };

  const updateItemFunc = () => {
    if (!itemName) {
      alert('You need to add item name');
      return;
    }
    if (!codeType) {
      setCodeType('')
      return;
    }
    if (!codeData) {
      setCodeData('')
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
        [itemName, codeType, codeData, itemImage, itemID],
        (tx, results) => {
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
    <SafeAreaView style={{width:'100%', height:'100%'}}>
      <View style={{ flex: 6, backgroundColor: colors.background, justifyContent: 'center' }}>
        <View style={{ flex: 1, padding: 25 }}>
          <Pressable onPress={returnBack} style={{ alignContent: 'center', backgroundColor: 'white', zIndex: 0 }}>
            <Text style={{ textAlign: 'center', fontSize: 30, fontFamily: 'RobotoMedium', justifyContent: 'center', borderWidth: 2, borderRadius: 15, padding: 10, backgroundColor: 'yellow', opacity: 0.7 }}>Close this window</Text>
          </Pressable>
          <KeyboardAvoidingView
            style={{ flex: 1, justifyContent: 'space-between' }}>
            <Text style={[styles.textheader, {color: colors.text}]}>Change item name</Text>
            <TextInput
              placeholder="Item name"
              value={itemName}
              style={{ color: colors.text, fontSize: 24, fontFamily: 'RobotoMedium', fontWeight: '500', textAlign: 'center' }}
              onChangeText={
                (itemName) => setItemName(itemName)
              }
            />
            <Text style={[styles.textbottom, {color: colors.text}]}>Codetype: {codeType}</Text>
            <Text style={[styles.textbottom, {color: colors.text}]}>Codedata: {codeData}</Text>
            <Pressable onPress={() => setScanner(!scanner)} style={styles.PressableStyle}>
              <Text style={styles.PressableTextStyle}>Pick a new barcode</Text>
              {/* <TextInput value={itemName} onChangeText={text => setItemName({...itemName, code: text})} /> */}
              {scanner ? (
                <Modal
                  style={{ flex: 1 }}
                  animationType="slide"
                  transparent={true}
                  visible={true}
                >
                  <View style={{ justifyContent: 'center', flex: 6 }}>
                    <Pressable onPress={() => setScanner(!scanner)} style={{ flex: 1, alignContent: 'center', backgroundColor: 'white', zIndex: 0 }}>
                      <Text style={{ alignSelf: 'center', justifyContent: 'center', fontSize: 30, borderWidth: 2, borderRadius: 15, padding: 10, backgroundColor: 'yellow' }}>Close this window</Text>
                    </Pressable>
                    <BarCodeScanner
                      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                      style={{ flex: 5, justifyContent: 'center' }}
                    />
                    {scanned && <Button style={{ flex: 1 }} title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
                  </View>
                </Modal>
              ) : null}
            </Pressable>
            {itemImage ? <Image source={{ uri: itemImage }} style={styles.ImageStyle} /> : null}
            <Pressable onPress={() => setImagePicker(!imagePicker)} style={styles.PressableStyle}>
              <Text style={styles.PressableTextStyle}>Change item image</Text>
              {/* <TextInput value={itemName} onChangeText={text => setItemName({...itemName, code: text})} /> */}
              {imagePicker ? (
                <Modal
                  style={{ flex: 1 }}
                  animationType="slide"
                  transparent={true}
                  visible={true}
                >
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Pressable style={{ backgroundColor: 'lightblue', width: '70%', display: 'flex', borderWidth: 5, borderRadius: 20, justifyContent: 'center' }} onPress={pickImage}>
                      <Text style={styles.textheader}>Pick an image from camera roll</Text>
                    </Pressable>
                    {itemImage && <Image source={{ uri: itemImage }} style={{ width: 200, height: 200 }} />}
                  </View>
                </Modal>
              ) : null}
            </Pressable>
            <Pressable onPress={updateItemFunc} style={styles.PressableStyle}>
              <Text style={styles.PressableTextStyle}>Update item</Text>
            </Pressable>
          </KeyboardAvoidingView>
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
    justifyContent: 'center',
    alignSelf: 'center',
  },
  textbottom: {
    fontSize: 22,
    fontFamily: 'AssistantMedium',
    textDecorationLine: 'underline',
  },
  ImageStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: vw(50),
    height: vh(20),
    margin: '5%',
  },
  PressableStyle: {
    height: '10%',
    width: '90%',
    backgroundColor: 'rgba(255, 237, 211, 1)',
    borderWidth: 3,
    borderRadius: 15,
    justifyContent: 'center',
    alignSelf: 'center'
  }, PressableTextStyle: {
    color: '#111',
    fontSize: 22,
    fontWeight: '500',
    margin: 2,
    fontFamily: 'RobotoMedium',
    textAlign: 'center',
  }
});

export default UpdateItem;
