import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, Button,Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';


export default function ModalScanner(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [dataItem, setDataItem] = useState({codeType: '', codeData: ''})

  function closeModal() {
    props.closeModal(true)
  }

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    setDataItem({...dataItem, codeType: type, codeData: data})
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{justifyContent: 'center', flex: 6}}>
      <Pressable onPress={() => closeModal()} style={{flex:1, alignContent:'center', backgroundColor:'white', zIndex:0}}>
        <Text style={{alignSelf:'center', justifyContent:'center', fontSize:30, borderWidth:2, borderRadius:15, padding:15,backgroundColor:'yellow'}}>Close this window</Text>
      </Pressable>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{flex:5, justifyContent:'center'}}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}
