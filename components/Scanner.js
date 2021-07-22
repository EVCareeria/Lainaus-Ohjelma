import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button,Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function Scanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [codeType, setCodeType] = useState(null)
  const [codeData, setCodeData] = useState(null)
  const [scanner, setScanner]= useState(false)
  const [scannerItem, setScannerItem] = useState()

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
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
          console.log(temp)
        }
      );
    });
  }, [scanner]);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    setCodeType(type)
    setCodeData(data)
    setScanner(!scanner)
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{justifyContent: 'center', flex: 6}}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}