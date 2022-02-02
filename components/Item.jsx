import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, TextInput, Pressable, Alert, Modal, Button, Image } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as ImagePicker from 'expo-image-picker';
import { DatabaseConnection } from './database/Database';
import { vw, vh } from 'react-native-expo-viewport-units';
import { ScrollView } from 'react-native-gesture-handler';

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
        'INSERT INTO items (item_name, codetype, codedata, image, loanstatus) VALUES (?,?,?,?,?)',
        [name, codeType, codeData, image, '1'],
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
    <ScrollView>
    <View style={{display:'flex', flexDirection:'column', height:vh(100), justifyContent:'space-evenly', alignItems:'center', paddingBottom:vh(10),}}>
      <Image source={require('../assets/beach.jpg')} style={{ position: 'absolute', width: '100%', height: '150%' }} />
      <View  >
        <Text style={styles.textheader} >Add item name</Text>
        <TextInput value={name} onChangeText={name => setName(name)} style={{backgroundColor:'white', height:25 + vh(7), width:vw(90), borderRadius:20, borderWidth:3, fontSize: 15 + vh(2), textAlign:'center', marginBottom:20 + vh(4)}}  />
      </View>
      <Pressable onPress={() => setScanner(!scanner)} style={({pressed}) =>[{backgroundColor: pressed ? '#4d9484' : 'white'}, styles.Add ]} >
        <View >
          <Text style={styles.textheader} >Add item barcode</Text>
          {codeData ? <Text style={{ fontFamily: 'AssistantMedium', fontSize: vw(4) }}>Codedata: {codeData}</Text> : null}
          {codeType ? <Text style={{ fontFamily: 'AssistantMedium', fontSize: vw(4) }}>Codedata: {codeType}</Text> : null}
        </View>
        {scanner ? (
          <Modal
            style={{ display: 'flex' }}
            animationType="slide"
            transparent={true}
            visible={true}
          >
            <View >
              <Pressable onPress={() => setScanner(!scanner)} >
                <Text >Close this window</Text>
              </Pressable>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{ display: 'flex', flex: 5, justifyContent: 'center' }}
              />
              {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
            </View>
          </Modal>
        ) : null}
      </Pressable>
      <Pressable onPress={() => setImagePicker(!imagePicker)} style={({pressed}) =>[{backgroundColor: pressed ? '#4d9484' : 'white'}, styles.Add ]}>
        <Text style={styles.textheader}>Add item image</Text>
        {imagePicker ? (
          <Modal
            style={{ display: 'flex' }}
            animationType="slide"
            transparent={true}
            visible={true}
          >
            <View >
              <Pressable  onPress={pickImage}>
                <Text >Pick an image from camera roll</Text>
              </Pressable>
              {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            </View>
          </Modal>
        ) : null}
      </Pressable>
        <Pressable onPress={() => updateFunction()} style={({pressed}) =>[{backgroundColor: pressed ? '#4d9484' : 'white'}, styles.addItem ]}  >
          <Text style={styles.textheader} >
            Add item
          </Text>
        </Pressable>

    </View>
    </ScrollView>
  )

}



const styles = StyleSheet.create({
  Add: {
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    borderWidth: 3,
    maxHeight:vh(20),
    marginBottom: vh(5),
    width: '90%',
    borderRadius: 20,
  },
  addItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    borderWidth: 3,
    maxHeight:vh(10),
    marginBottom: vh(2),
    width: '90%',
    borderRadius: 20,
  },
  TextInput: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderWidth: 3,
    marginTop: '5%',
    width: '80%',
    borderRadius: 20,
    display: 'flex',
    fontSize: vw(5),
    backgroundColor: '#f5f5f5'
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
    fontSize: vw(7),
    fontWeight: '700',
    margin: 2,
    fontFamily: 'RobotoMedium',
    textAlign: 'center',
  },
  textbottom: {
    color: '#111',
    fontSize: 22,
    fontFamily: 'AssistantMedium',
    textDecorationLine: 'underline',
  },
  ImageStyle: {
    flex: 1,
    display: 'flex',
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
  PressablePressed:{
    borderRadius:15,
    borderColor:'green',
  }
})

export default Item;
