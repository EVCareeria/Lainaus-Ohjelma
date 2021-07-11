// import React, {useState} from 'react'
// import {View, Text, StyleSheet, Platform, KeyboardAvoidingView,TextInput, Pressable, ScrollView, Alert, Modal,FlatList, Image } from 'react-native'
// import Task from './Task'
// import ModalScanner from './ModalScanner'
// import uuid from 'react-native-uuid';

// interface ItemInfoInterface {
//     itemId: number;
//     itemName: string;
//     codetype: number;
//     codedata: number;
//     image: Blob;
// }

// const Items = () => {
//     const [itemInfo, setItemInfo] = useState({itemInfo:{} as ItemInfoInterface})
//     const [itemList, setItemList ] = useState([])
//     const [name, setName] = useState() 
//     const [image, setImage] = useState()
//     const [codeType, setCodeType] = useState()
//     const [codeData, setCodeData] = useState()
//     const [toggle, setToggle] = useState(false)
//     const [scanner, setScanner]= useState(false)
//     const [newId, setNewId] = useState(0)
//     const [itemEdit, setItemEdit] = useState(false)
//     const [item, setItem] = useState()
    

//      const AddItem = () => {
//          setNewId(newId +1)
//          setItemInfo({...itemInfo, itemId: newId, itemName: name, codetype: codeType, codedata: codeData, image:image})
//          {itemInfo != null ? setItemList([...itemList, itemInfo]) : Alert.alert("You cant add empty object")}
//          Alert.alert("Laite Lisätty ")
//          console.log(JSON.stringify(itemList));
//     }

//     function closeScannerModal() {
//         setScanner(!scanner)
//     }

//     function setModalCode(code) {
//         setCodeType(code)
//         setCodeData(code)
//         console.log(codeData)
//     }


//     return(
//         <View style={{flex: 6, backgroundColor: "#b5800d"}}>
//             <View style={{flex:1, justifyContent:'center', alignItems:'center', marginTop:50, borderWidth:1, width: '100%', height:'5%'}}>
//                 <Pressable onPress={() => setToggle(!toggle)}>
//                     <Text>
//                         Lisää uusi laite
//                     </Text>
//                 </Pressable>
//             </View>
            
//             {toggle === true ? <View style={{flex:4, justifyContent: 'space-evenly', alignItems:'center' }}>
//                 <View  style={styles.Add}>
//                     <Text>Lisää laitteen nimi</Text>
//                         <TextInput value={name} onChangeText={name => setName(name)} />
//                 </View>
//                 <View  style={styles.Add}>
//                     <Text>Lisää Laitteen kuva</Text>
//                         <TextInput value={image} onChange={image => setName(image)} />
//                 </View>
//                 <Pressable onPress={() => setScanner(!scanner)}>
//                     <View  style={styles.Add}>
//                         <Text>Lisää laitteen viivakoodi</Text>
//                             {/* <TextInput value={itemName} onChangeText={text => setItemName({...itemName, code: text})} /> */}
//                             {scanner ? (
//                                 <Modal
//                                 style={{flex:1}}
//                                 animationType="slide"
//                                 transparent={true}
//                                 visible={true}
//                                 >
//                                     <ModalScanner closeModal={closeScannerModal} itemId={itemInfo.itemId} modalCode={setModalCode} />
//                                 </Modal>
//                             ) : null}
//                     </View>
//                 </Pressable>
                
//                 <Pressable onPress={() => AddItem()} style={{justifyContent:'center', alignSelf:'center', borderRadius:2, borderWidth:1, width: '30%', height: '4%', alignItems:'center', backgroundColor:'white', margin: 10}}>
//                                 <Text style={{fontSize:20}}>
//                                     Lisää tuote
//                                 </Text>
//                         </Pressable>
//             </View>
//                 :
//                 <ScrollView style={{flex: 4}} fadingEdgeLength={200}>
//                     <KeyboardAvoidingView
//                     behavior={Platform.OS == 'ios' ? "padding" : "height"}
//                     >
//                         {/* LISTATUT ITEMIT */}
//                     </KeyboardAvoidingView>
//                             {itemList.map((item: ItemInfoInterface) => (
//                                 <Pressable key={item.itemId} onPress={() => {
//                                     setItem(item)
//                                 }}
//                             style={({pressed}) => [{ backgroundColor: pressed ? 'white' : 'green'}]}
//                                     onLongPress={() => {
//                                         setItemEdit(!itemEdit)
//                                 }}>

//                                 </Pressable>
//                             )
//                             )}
//                 </ScrollView>
//                 }
//                 {/* ITEMEIDEN LISÄYS */}
            
            
//         </View>
//     ) 
// }

// const styles = StyleSheet.create({
// Add: {
// justifyContent: 'center',
// alignItems: 'center',
// flexDirection: 'column',
// maxHeight: '9%',
// backgroundColor: '#f5f5f5',
// borderWidth: 3,
// marginTop: 20,
// width: '85%',
// borderRadius: 20
// },
// items: {
//     width: '85%',
//     height: '9%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 12,
//     fontSize:15,
//     borderColor: 'black',
//     flex: 3,
//     margin: 5,
//     borderWidth: 2,
//     backgroundColor: '#f5f5f5'
// }
// })

// export default Items;