import React, { useEffect, useState } from 'react'
import {View} from 'react-native'

import * as SQLite from "expo-sqlite"
import { FlatList } from 'react-native-gesture-handler'

const db = SQLite.openDatabase('item_storage.db')


const LoopDatabase = () => {
    const [items, setItems] = useState()

    useEffect(()=>{
        getItems()
    }, [])
    const getItems = (setUserFunc) => {
        db.transaction(
          tx => {
            tx.executeSql(
              'select * from items',
              [],
              (_, { rows: { _array } }) => {
                setUserFunc(_array)
                setItems(setUserFunc)
              }
            );
          },
          (t, error) => { console.log("Tietokanta latasi itemit"); console.log(error) },
          (_t, _success) => { console.log("itemit ladattu")}
        );
      }

    return(
        <View>
            {items.map((i) => (
                <FlatList>
                    <Text>{i.name}</Text>
                </FlatList>
            ))}
        </View>
    )
}
export default LoopDatabase