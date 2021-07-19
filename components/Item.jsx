import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Platform, KeyboardAvoidingView,TextInput, Pressable, ScrollView, Alert,Modal, Button,FlatList, Image, TouchableOpacity } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as ImagePicker from 'expo-image-picker';
import {favi} from '../assets/favicon.png'
import Task from './Task'
import { DatabaseConnection } from './database/Database';

const db = DatabaseConnection.getConnection();

  const initialData = [
    { 
      itemid: 0,
     itemname: 'testi1',
     codetype: 32,
     codedata: 20303038547,
     image: favi 
    },
    { 
      itemid: 1,
     itemname: 'testi2',
     codetype: 32,
     codedata: 2222333334,
     image: favi 
    },
    { 
      itemid: 2,
     itemname: 'testi3',
     codetype: 16,
     codedata: 49494940,
     image: favi 
    },
  ]
  
  
const Items = () => {
  //const [dataBase, setDataBase] = useState([])
   const [itemInfo, setItemInfo] = useState(initialData)
    //const [item, setItem] = useState({})
    const [name, setName] = useState(null) 
    const [codeType, setCodeType] = useState(null)
    const [codeData, setCodeData] = useState(null)
    const [toggle, setToggle] = useState(false)
    const [scanner, setScanner]= useState(false)
    const [newId, setNewId] = useState(0)
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [update, setUpdate] = useState(false)
    const [imagePicker, setImagePicker] = useState(false)
    const [image, setImage] = useState(null);

    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);

    useEffect(()=>{
        if(name && codeType && codeData && image != null) {
            addToDB()
         //   setNewId(newId +1)
          //  setItem({itemid: newId, itemname: name, codetype: codeType, codedata: codeData, image: image })
           // setItemInfo([...itemInfo, item])
            Alert.alert('Item added to the list')
            setName(null)
            setCodeType(null)
            setCodeData(null)
            setImage(null)
            
            
            
        }else {
            setName(null)
            setCodeType(null)
            setCodeData(null)
            setImage(null)
            Alert.alert('Item was not added to the list')
        }
    }, [update])
    
    const refreshItem = () =>  {
      console.log(dataBase)
      return database.getItems(setDataBase)
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
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                Alert.alert(
                  'success',
                  'item added to database',
                );
              } else alert('Error while adding item to database');
            }
          );
        });
      }
      

          const deleteItem = id => {
            const newList = itemInfo.filter(i => i.itemid !== id);
            setItemInfo(newList)
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
        setImage(uri)  
    
        if (!result.cancelled) {
            setImage(result.uri);
        }
        setTimeout(function(){setImagePicker(false)}, 3000)
      };
    


    return(
        <View style={{flex: 12, backgroundColor: "#b5800d"}}>
            <View style={{justifyContent:'center', alignItems:'center', marginTop:50, borderWidth:1, width: '100%', height:'15%'}}>
                <Pressable onPress={() => setToggle(!toggle)}>
                    <Text style={{fontSize:35, textAlign:'center', borderWidth:3, borderRadius:15, padding:10}}>
                        Lisää uusi laite
                    </Text>
                </Pressable>
            </View>
            
            {toggle === true ? <View style={{flex:2, justifyContent: 'space-evenly', alignItems:'center' }}>
                <View  style={styles.Add}>
                    <Text style={{fontSize: 18}}>Lisää laitteen nimi</Text>
                        <TextInput value={name} onChangeText={name => setName(name)} />
                </View>
                <Pressable onPress={() => setScanner(!scanner)} style={{height: '15%', width: '85%', backgroundColor:'white', borderWidth: 3, borderRadius: 20,justifyContent:'center', alignContent:'center'}}>
                        <Text style={{textAlign:'center', backgroundColor: 'white', height: 40, fontSize: 18}}>Lisää laitteen viivakoodi</Text>
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
                <Pressable onPress={() => setImagePicker(!imagePicker)} style={{height: '15%', width: '85%', backgroundColor:'white', borderWidth: 3, borderRadius: 20,justifyContent:'center', alignContent:'center'}}>
                        <Text style={{textAlign:'center', backgroundColor: 'white', height: 40, fontSize: 18}}>Lisää laitteen kuva</Text>
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
                                        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                                    </View>
                                 </Modal>
                             ) : null}
                </Pressable>
                
                <Pressable onPress={() => setUpdate(!update)} style={{justifyContent:'center', alignSelf:'center', borderRadius:20, borderWidth:1, width: '40%', height: '8%', alignItems:'center', backgroundColor:'white', margin: 10}}>
                                <Text style={{fontSize:20}}>
                                    Lisää tuote
                                </Text>
                        </Pressable>
            </View>
                :
                <ScrollView style={{flex: 4}} fadingEdgeLength={150} style={{flex:4}}>
                    <KeyboardAvoidingView
                    behavior={Platform.OS == 'ios' ? "padding" : "height"}
                    >
                        {/* LISTATUT ITEMIT */}
                    </KeyboardAvoidingView>
                        {itemInfo.map((i) => (
                            <Task 
                            ID={i.itemid} name={i.itemname} codetype={i.codetype} codedata={i.codedata} image={i.image} deleteitem={() => deleteItem(i.itemid)}
                            />
                        ))}
                </ScrollView>
                }
                {/* ITEMEIDEN LISÄYS */}
               
            
        </View>
    ) 
}



const styles = StyleSheet.create({
Add: {
justifyContent: 'center',
alignItems: 'center',
flexDirection: 'column',
height: '15%',
backgroundColor: '#f5f5f5',
borderWidth: 3,
marginTop: 10,
width: '85%',
borderRadius: 20
},
items: {
    width: '85%',
    height: '9%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    fontSize:15,
    borderColor: 'black',
    flex: 3,
    margin: 5,
    borderWidth: 2,
    backgroundColor: '#f5f5f5'
}
})

export default Items;