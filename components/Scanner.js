import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button,Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { DatabaseConnection } from './database/Database';
import ViewItemSearch from './Pages/ViewItemSearch'

const db = DatabaseConnection.getConnection();

export default function Scanner({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [codeType, setCodeType] = useState(null)
  const [codeData, setCodeData] = useState(null)
  const [scanner, setScanner]= useState(false)
  const [toggle, setToggle] = useState(false)
  const [scannerItem, setScannerItem] = useState()

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  function ScannerResult(){
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM items WHERE codetype=?, codedata=?',
        [codeType, codeData],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
            setScannerItem(temp);
          Alert.alert('Search completed')
          setToggle(!toggle)
          console.log(temp)
        }
      );
    });
  };

  function goback() {
    navigation.goBack()
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    setCodeType(type)
    setCodeData(data)
    ScannerResult()
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{justifyContent: 'center', flex: 6}}>
      {toggle === false ?  
      <View style={{justifyContent:'center', flex: 5}}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      </View>
      : 
        <View style={{flex:5}}>
          <ViewItemSearch codetype={codeType} codedata={codeData} goback={goback} />
        </View>}
    </View>
  );
}