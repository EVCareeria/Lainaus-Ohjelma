import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, TextInput, Pressable, Alert, Modal, Button, Image } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as ImagePicker from 'expo-image-picker';
import { DatabaseConnection } from './database/Database';
import { vw, vh } from 'react-native-expo-viewport-units';

const db = DatabaseConnection.getConnection();

const Item = ({ navigation }) => {
  //const [dataBase, setDataBase] = useState([])
  const [name, setName] = useState(null)
  const [codeType, setCodeType] = useState(0)
  const [codeData, setCodeData] = useState(0)
  const [scanner, setScanner] = useState(false)
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [imagePicker, setImagePicker] = useState(false)
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  function updateFunction() {
    if (name && image != null) {
      addToDB()
      Alert.alert('Item ' + name + ' added to the list')
    } else {
      setName(null)
      setCodeType(0)
      setCodeData(0)
      setImage(null)
      Alert.alert('Item was not added to the list')
    }
    navigation.pop()
  }

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  function addToDB() {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO items (item_name, codetype, codedata, image) VALUES (?,?,?,?)',
        [name, codeType, codeData, image],
        (tx, results) => {
          setName(null)
          setCodeType(null)
          setCodeData(null)
          setImage(null)
        }
      );
    });
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
    setImage(uri)

    if (!result.cancelled) {
      setImage(result.uri);
    }
    setTimeout(function () { setImagePicker(false) }, 2000)
  };

  return (
    <View style={{ flex: 12,  alignItems: 'center' }}>
            <Image source={require('../assets/beach.jpg')} style={{position:'absolute', width:'100%',height:'100%'}} />
      <View style={styles.Add}>
        <Text style={styles.textheader}>Add item name</Text>
        <TextInput value={name} onChangeText={name => setName(name)} />
      </View>
      <Pressable onPress={() => setScanner(!scanner)} style={{ height: '10%', width: '85%', backgroundColor: 'white', borderWidth: 3, borderRadius: 20, justifyContent: 'center', alignItems: 'center', margin: '5%', flex: 1 }}>
        <Text style={styles.textheader}>Add item barcode</Text>
        {codeData ? <Text>Codedata: {codeData}</Text> : null }
        {codeType ? <Text>Codedata: {codeType}</Text> : null }
        {scanner ? (
          <Modal
            style={{ flex: 1 }}
            animationType="slide"
            transparent={true}
            visible={true}
          >
            <View style={{ justifyContent: 'center', flex: 6 }}>
              <Pressable onPress={() => setScanner(!scanner)} style={{ flex: 1, alignContent: 'center', backgroundColor: 'white', zIndex: 0 }}>
                <Text style={{ alignSelf: 'center', justifyContent: 'center', fontSize: 30, borderWidth: 2, borderRadius: 15, padding: 15, backgroundColor: 'yellow' }}>Close this window</Text>
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
      <Pressable onPress={() => setImagePicker(!imagePicker)} style={{ height: '10%', width: '85%', backgroundColor: 'white', borderWidth: 3, borderRadius: 20, justifyContent: 'center', alignItems: 'center', margin: '5%', flex: 1 }}>
        <Text style={styles.textheader}>Add item image</Text>
        {imagePicker ? (
          <Modal
            style={{ flex: 1 }}
            animationType="slide"
            transparent={true}
            visible={true}
          >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Button style={{ flex: 1 }} title="Pick an image from camera roll" onPress={pickImage} />
              {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            </View>
          </Modal>
        ) : null}
      </Pressable>

      <Pressable onPress={() => updateFunction()} style={{ justifyContent: 'center', alignSelf: 'center', borderRadius: 20, borderWidth: 1, width: '40%', height: '8%', alignItems: 'center', backgroundColor: 'white', margin: 10, flex: 1 }}>
        <Text style={styles.textheader}>
          Add item
        </Text>
      </Pressable>
    </View>
  )




}



const styles = StyleSheet.create({
  Add: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '10%',
    backgroundColor: '#f5f5f5',
    borderWidth: 3,
    marginTop: '5%',
    width: '85%',
    borderRadius: 20,
    flex: 1,
  },
  items: {
    width: '85%',
    height: '9%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    fontSize: 15,
    borderColor: 'black',
    flex: 3,
    margin: 5,
    borderWidth: 2,
    backgroundColor: '#f5f5f5'
  }, textheader: {
    color: '#111',
    fontSize: 26,
    fontWeight: '700',
    margin: 2,
    fontFamily: 'RobotoMedium',
  },
  textbottom: {
    color: '#111',
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
    margin: '15%',
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
    color: '#111',
    fontSize: 22,
    fontWeight: '500',
    margin: 2,
    fontFamily: 'RobotoMedium',
    textAlign: 'center',
  },
})

export default Item;
