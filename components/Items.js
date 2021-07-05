import React, {useState} from 'react'
import {View, Text, StyleSheet, Platform, KeyboardAvoidingView,TextInput, Pressable, ScrollView, Alert, Image } from 'react-native'
import Task from './Task'
import Scanner from './Scanner'
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import uuid from 'react-native-uuid';

const Items = () => {
    const [itemName, setItemName] = useState({name: String, image: String, code: String, id: Number})
    const [list, setList ] = useState([])
    const [toggle, setToggle] = useState(false)
    const [scanner, setScanner]= useState(false)
    let iD = uuid.v1()


     const AddItem = () => {
         setItemName({...itemName, id: iD})
         console.log(itemName)
         {itemName && iD != null ? setList([...list, itemName]) : Alert.alert("You cant add empty object")}
         Alert.alert("Laite Lisätty ")
         setItemName('')
        console.log(list)
    }

    return(
        <View style={{flex: 6, backgroundColor: "#b5800d"}}>
            <View style={{flex:1, justifyContent:'center', alignItems:'center', marginTop:50, borderWidth:1, width: vw(100), height:vh(5)}}>
                <Pressable onPress={() => setToggle(!toggle)}>
                    <Text>
                        Lisää uusi laite
                    </Text>
                </Pressable>
            </View>
            
            {toggle === true ? <View style={{flex:4, justifyContent: 'space-evenly', justifyContent: 'center', alignItems:'center' }}>
                <View  style={styles.Add}>
                    <Text>Lisää laitteen nimi</Text>
                        <TextInput value={itemName} onChangeText={text => setItemName({...itemName, name: text})} />
                </View>
                <View  style={styles.Add}>
                    <Text>Lisää Laitteen kuva</Text>
                        <TextInput value={itemName} onChangeText={text => setItemName({...itemName, image: text})} />
                </View>
                <View  style={styles.Add}>
                    <Text>Lisää laitteen viivakoodi</Text>
                        {/* <TextInput value={itemName} onChangeText={text => setItemName({...itemName, code: text})} /> */}
                        <View style={{flex:4}}>
                            <Scanner />
                        </View>
                </View>
                <Pressable onPress={() => AddItem()} style={{justifyContent:'center', alignSelf:'center', borderRadius:2, borderWidth:1, width: vw(30), height: vh(4), alignItems:'center', backgroundColor:'white', margin: 10}}>
                                <Text>
                                    Lisää tuote
                                </Text>
                        </Pressable>
            </View>
                :
                <ScrollView style={{flex: 4}} fadingEdgeLength={200}>
                    <KeyboardAvoidingView
                    behavior={Platform.OS == 'ios' ? "padding" : "height"}
                    >
                        {/* LISTATUT ITEMIT */}
                    </KeyboardAvoidingView>
                    <View style={{justifyContent:'center', alignItems:'center'}} >
                            {list.map((item) =>{
                            return  <View style={styles.items} key={item.id}>
                                        <Task name={item.name} image={item.image} code={item.code} />
                                    </View>
                            })}
                    </View>
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
maxHeight: vh(10),
backgroundColor: '#f5f5f5',
borderWidth: 3,
marginTop: 20,
width: vw(85),
borderRadius: 20
},
items: {
    width: vw(85),
    height: vh(9),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    fontSize:15,
    borderColor: 'black',
    flex: 3,
    margin: 5,
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: '#f5f5f5'
}
})

export default Items;