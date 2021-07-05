import React, {useState} from 'react'
import {View, Text, StyleSheet, Pressable} from 'react-native'
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';

const Task = (props) => {
    return(
        <View style={styles.item} >
            <Text>Laitteen Nimi: {props.name}</Text>
            <Text>Laitteen Kuva: {props.image}</Text>
            <Text>Laitteen Koodi: {props.code}</Text>
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