import React, {useState} from 'react'
import {View, Text, StyleSheet, Platform, KeyboardAvoidingView,TextInput, TouchableOpacity} from 'react-native'
import Task from './Task'
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';

const Items = () => {
    const [item, setItem] = useState({name:'testi'})
    const [list, setList ] = useState([])
    const [toggle, setToggle] = useState(false)

    const AddItem = () => {
        setList([...list, item])
        setItem(null)
    }

    return(
        <View>
             <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? "padding" : "height"}
            >
                <View  style={styles.Add}>
                    <TextInput placeholder={"Anna nimi"} value={item} onChangeText={text => setItem(text)} />
                    <TouchableOpacity onPress={() => AddItem()}>
                        <View>
                            <Text>+</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            
            </KeyboardAvoidingView>
            
            <View >
                {list.map((i) =>{
                   return   <View style={styles.items}>
                                <Task item={i} />
                            </View>
                })}

            </View>
           
        </View>
    ) 
}

const styles = StyleSheet.create({
Add: {
justifyContent: 'center',
alignItems: 'center',
flex: 1,
flexDirection: 'column',
maxHeight: vh(10),
backgroundColor: '#f5f5f5',
borderWidth: 4,
borderRadius: 60
},
items: {
    width: vw(85),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderColor: 'black',
    flex: 1,
    maxHeight: vh(10),
    margin: 5,
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: '#f5f5f5'
}
})

export default Items;