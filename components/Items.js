import React, {useState} from 'react'
import {View, Text, StyleSheet, Platform, KeyboardAvoidingView,TextInput, Pressable, ScrollView, Alert, Image } from 'react-native'
import Task from './Task'
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';

const Items = () => {
    const [itemName, setItemName] = useState({name: String, image: String, code: String, id: Number})
    const [list, setList ] = useState([])
    const [iD, setId] = useState(0)
    const [toggle, setToggle] = useState(false)



     const AddItem = () => {
         setId(iD +1)
         setItemName({...itemName, id: iD})
         console.log(itemName)
         {itemName && iD != '' ? setList([...list, itemName]) : Alert.alert("You cant add empty object")}
         setItemName(null)
        console.log(list)
    }

    return(
        <View>
            <View style={{flex:2, justifyContent:'center', alignItems:'center', marginTop:100, borderWidth:1, width: vw(60), height:vh(7)}}>
                <Pressable onPress={() => setToggle(!toggle)}>
                    <Text>
                        Lisää uusi laite
                    </Text>
                </Pressable>
            </View>
            
            {toggle === true ? <View style={{flex:4, justifyContent: 'space-evenly' }}>
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
                        <TextInput value={itemName} onChangeText={text => setItemName({...itemName, code: text})} />
                        
                </View>
                <Pressable onPress={() => AddItem()} style={{justifyContent:'center', alignSelf:'center', borderRadius:2, borderWidth:1, width: vw(30), height: vh(4), alignItems:'center', backgroundColor:'white'}}>
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
                    <View >
                            {list.map((item) =>{
                            return  <View style={styles.items} key={item.id}>
                                        <Task item={item} />
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