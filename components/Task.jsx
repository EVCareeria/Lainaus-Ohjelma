import React, {useState} from 'react'
import {View, Text, StyleSheet, Pressable, Image} from 'react-native'
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import uuid from 'react-native-uuid';

const Task = ({ID, name, codetype, codedata, image, deleteitem}) => {
    
    return(
        <View style={{flex:2, justifyContent:'center', borderWidth:1, borderRadius:15, padding:25, margin:15, backgroundColor:'white'}}>
                                <View key={uuid.v4()} >
                                    <Text style={{fontSize:30, fontStyle:'italic'}}>Name: {name}</Text>
                                    <Text>ID: {ID}</Text>
                                    <Text>Codedata: {codedata}</Text>
                                    <Text>Codetype: {codetype}</Text>
                                    <View style={{paddingLeft: '30%', flexBasis:200}}>
                                        <Image source={{ uri: image }} style={{ width: vw(50), height: vh(25) }} />
                                    </View>
                                    <Pressable onPress={deleteitem}>
                                      <View style={{paddingRight:100, borderWidth:1, borderRadius:5, backgroundColor:'red'}}>
                                          <Text>Delete item</Text>
                                      </View>
                                    </Pressable>
                                    
                                </View>
                            </View>
    )  
}

const styles = StyleSheet.create({
item: {
    flex: 1,
    maxHeight: vh(20),
    justifyContent: 'center',
    alignItems: 'center',
}
})

export default Task;