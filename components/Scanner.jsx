import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, Modal, Alert, ScrollView,  Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { DatabaseConnection } from './database/Database';
import { StyleSheet } from 'react-native';
import { vw, vh } from 'react-native-expo-viewport-units';
import ViewItem from './Pages/ViewItem';

const db = DatabaseConnection.getConnection();

export default function Scanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [codeType, setCodeType] = useState(null)
  const [codeData, setCodeData] = useState(null)
  const [scannerItem, setScannerItem] = useState()
  const [flatListItems, setFlatListItems] = useState([]);
  const [update, setUpdate] = useState()
  const [modalDelete, setModalDelete] = useState()
  const [loan, setLoan] = useState()

  useEffect(() => {
    if (scanned == false) {
      setTimeout(() => {
        setScanned(!scanned)
      }, 12000);
    }
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM items WHERE codedata=?',
        [codeData],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFlatListItems(temp);
          Alert.alert('Search completed')
        }
      );
    });
  }, [scannerItem, update, loan, modalDelete]);

  const handleBarCodeScanned = ({ type, data }) => {
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    setCodeType(type)
    setCodeData(data.toString())
    setScannerItem(!scannerItem)
    setScanned(true);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  function updateFunction() {
    setUpdate(!update)
  }
  function deleteFunction() {
    setModalDelete(!modalDelete)
  }
  function loanFunction() {
    setLoan(!loan)
  }

  return (
    <SafeAreaView style={{ display: 'flex', width:'100%', aspectRatio:2/1 }}>
        {scanned != true ? (
          <Modal
            style={{ flex: 6 }}
            animationType="slide"
            transparent={true}
            visible={true}
          >
            <View style={{ display: 'flex', width:'100%', aspectRatio: 10/15}}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{ flex: 4, justifyContent: 'center' }}
              />
            </View>
          </Modal>
        ) : null}
      <Pressable onPress={() => setUpdate(!update)} style={{ flex: 1, justifyContent: 'center', borderWidth: 3, borderRadius: 15, margin: 15, borderColor: 'blue', marginTop: 20, backgroundColor:'#F6F4EC' }}>
        <Text style={{ textAlign: 'center', fontSize: 30, fontFamily: 'RobotoMedium' }}>Update current list</Text>
      </Pressable>
      <View style={{display:'flex', flex: 1 }}>
        <ScrollView fadingEdgeLength={100}>
          {flatListItems.map((i) => (
            <Pressable style={{display:'flex', flex: 2, margin: 3 }} key={i.item_id}>
              <ViewItem itemID={i.item_id} itemName={i.item_name} codetype={i.codetype} codedata={i.codedata} image={i.image} loanStatus={i.loanstatus} setUpdateModal={updateFunction} setDeleteModal={deleteFunction} setLoanModal={loanFunction} />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textheader: {
    color: '#111',
    fontSize: 26,
    fontWeight: '700',
    margin: 2,
    fontFamily: 'RobotoMedium',
  },
  textbottom: {
    color: '#111',
    fontSize: 22,
    fontFamily: 'AssistantMedium',
    textDecorationLine: 'underline',
  },
  ImageStyle: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: vw(70),
    height: vh(20),
    margin: '15%',
  },
  PressableStyle: {
    height: '10%',
    width: '90%',
    backgroundColor: 'white',
    borderWidth: 3,
    borderRadius: 15,
    justifyContent: 'center',
    alignSelf: 'center'
  }, PressableTextStyle: {
    color: '#111',
    fontSize: 22,
    fontWeight: '500',
    margin: 2,
    fontFamily: 'RobotoMedium',
    textAlign: 'center',
  }
});
