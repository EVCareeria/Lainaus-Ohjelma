import React, {useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';

const Task = (props) => {
    return(
        <View style={styles.item}>
            <TouchableOpacity></TouchableOpacity>
            <Text>{props.item}</Text>
        </View>
    )
    
}

const styles = StyleSheet.create({
item: {
    flex: 1,
    maxHeight: vh(40),
    justifyContent: 'center',
    alignItems: 'center'
}
})

export default Task;