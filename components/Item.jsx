import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Platform, KeyboardAvoidingView,TextInput, Pressable, ScrollView, Alert,Modal, Button,FlatList, Image } from 'react-native'
import { DataContext } from './ItemContext'
import ModalScanner from './ModalScanner'
import { BarCodeScanner } from 'expo-barcode-scanner';


const Items = () => {
    const [itemInfo, setItemInfo] = useState([])
    const [item, setItem] = useState({})
    const [name, setName] = useState('') 
    const [codeType, setCodeType] = useState(0)
    const [codeData, setCodeData] = useState(0)
    const [toggle, setToggle] = useState(false)
    const [scanner, setScanner]= useState(false)
    const [newId, setNewId] = useState(0)
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [update, setUpdate] = useState(false)
  
    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);

    useEffect(()=>{
        if(name && codeType && codeData != null) {
            setNewId(newId +1)
            setItem({itemid: newId, itemname: name, codetype: codeType, codedata: codeData})
            setItemInfo([...itemInfo, item])
            Alert.alert('Item added to the list')
            setName(null)
            setCodeType(null)
            setCodeData(null)
        }else {
            setName(null)
            setCodeType(null)
            setCodeData(null)
            Alert.alert('Item was not added to the list')
        }
        
    }, [update])

  
    const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true);
      alert(`Bar code with type ${type} and data ${data} has been scanned!`);
      setCodeType(type)
      setCodeData(data)
      setScanner(!scanner)
      console.log(item)
    };
  
    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
    


    return(
        <View style={{flex: 12, backgroundColor: "#b5800d"}}>
            <View style={{justifyContent:'center', alignItems:'center', marginTop:50, borderWidth:1, width: '100%', height:'25%'}}>
                <Pressable onPress={() => setToggle(!toggle)}>
                    <Text style={{fontSize:25, textAlign:'center', backgroundColor: 'cyan'}}>
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
                                    {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
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
                <ScrollView style={{flex: 4}} fadingEdgeLength={200} style={{flex:4}}>
                    <KeyboardAvoidingView
                    behavior={Platform.OS == 'ios' ? "padding" : "height"}
                    >
                        {/* LISTATUT ITEMIT */}
                    </KeyboardAvoidingView>
                        {itemInfo.map((i) => (
                            <View key={i.itemid} style={{flex:2, justifyContent:'center', borderWidth:1, borderRadius:15, padding:25, margin:15}}>
                                <View key={i.itemid}>
                                    <Text>Name: {i.itemname}</Text>
                                    <Text>ID: {i.itemid}</Text>
                                    <Text>Codedata: {i.codedata}</Text>
                                    <Text>Codetype: {i.codetype}</Text>
                                </View>
                            </View>
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