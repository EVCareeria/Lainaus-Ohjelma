import React from 'react'

import * as SQLite from "expo-sqlite"

const db = SQLite.openDatabase('item_storage.db')

const getItems = (setUserFunc) => {
  db.transaction(
    tx => {
      tx.executeSql(
        'select * from items',
        [],
        (_, { rows: { _array } }) => {
          setUserFunc(_array)
        }
      );
    },
    (t, error) => { console.log("db error load items"); console.log(error) },
    (_t, _success) => { console.log("loaded items")}
  );
}

const insertItem = (name, codeType, codeData, image) => {
  db.transaction( tx => {
    tx.executeSql( 'insert into items (name, codetype, codedata, image) values (?,?,?,?,?)', [ name, codeType, codeData, image] );
    },
    (t, error) => { console.log("db error insertitem"); console.log(error);},
  )
}

const dropDatabaseTablesAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'drop table items',
        [],
        (_, result) => { resolve(result) },
        (_, error) => { console.log("error dropping items table"); reject(error)
        }
      )
    })
  })
}

const setupDatabaseAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
        tx.executeSql(
          'create table if not exists items (id integer primary key not null, name text, codetype text, codedata int, image text, status int, date text );'
        );
      },
      (_, error) => { console.log("db error creating tables"); console.log(error); reject(error) },
      (_, success) => { resolve(success)}
    )
  })
}

const setupItemAsync = async () => {
  return new Promise((resolve, _reject) => {
    db.transaction( tx => {
        tx.executeSql( 'insert into items (id, name, codetype, codedata, image) values (?,?,?,?,?)', [1, "john", "112", 444555666, "https://www.pinterest.ie/pin/696369161107790428/"] );
      },
      (t, error) => { console.log("db error insertItem setupItemAsync"); console.log(error); resolve() },
      (t, success) => { resolve(success)}
    )
  })
}

export const database = {
  getItems,
  insertItem,
  setupDatabaseAsync,
  setupItemAsync,
  dropDatabaseTablesAsync,
}