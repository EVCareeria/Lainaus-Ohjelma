import React, { useState, useEffect } from 'react';
import { Text, View, Button, FlatList, SafeAreaView, Modal, Alert, TouchableOpacity, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { DatabaseConnection } from './database/Database';
import { StyleSheet } from 'react-native';
import { vw, vh } from 'react-native-expo-viewport-units';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import DeleteItem from './Pages/DeleteItem';
import UpdateUser from './Pages/UpdateItem';
import LoanItem from './Pages/LoanItem';

const db = DatabaseConnection.getConnection();

export default function Scanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [codeType, setCodeType] = useState(null)
  const [codeData, setCodeData] = useState(null)
  const [scannerItem, setScannerItem] = useState()
  const [flatListItems, setFlatListItems] = useState()
  const [del, setDel] = useState(false)
  const [update, setUpdate] = useState(false)
  const [loan, setLoan] = useState(0)

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    console.log('Useeffect DB Fetch')
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM items WHERE codedata=?',
        [codeData],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFlatListItems(temp);
          console.log(temp)
          Alert.alert('Search completed')
        }
      );
    });
  }, [scannerItem]);

  useEffect(() => {
    console.log(flatListItems)
  }, [flatListItems])

  function closeDelete() {
    setDel(!del)
    navigation.pop()
  }
  function closeLoan() {
    setLoan(!loan)
    navigation.pop()
  }
  function closeUpdate() {
    setUpdate(!update)
    navigation.pop()
  }
  function setUpdateModalFunc() {
    setUpdateModal(true)
  }
  function setLoanModalFunc() {
    setLoanModal(true)
  }
  function setDeleteModalFunc() {
    setDeleteModal(true)
  }

  const handleBarCodeScanned = ({ type, data }) => {
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    setCodeType(type)
    setCodeData(data.toString())
    setScannerItem(!scannerItem)
    console.log('Lisää testiä')
    setScanned(true);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 6 }}>
      <View style={StyleSheet.absoluteFillObject}>
        {scanned != true ? (
          <Modal
            style={{ flex: 4 }}
            animationType="slide"
            transparent={true}
            visible={true}
          >
            <View style={{ justifyContent: 'center', flex: 5 }}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{ flex: 4, justifyContent: 'center' }}
              />
            </View>
          </Modal>
        ) : null}
        <View style={{ flex: 5, justifyContent: 'center', alignSelf: 'center', paddingTop: vh(10), width: '100%', height: '90%' }}>
          <FlatList
            data={flatListItems}
            keyExtractor={(item) => item.item_id.toString()}
            renderItem={({ item }) => (

              <View style={{ flex: 5 }}>
                <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                  <View style={{ flexDirection: 'row', maxWidth: '50%' }}>
                    <Text style={styles.textheader}>Name</Text>
                    <MaterialIcons name="update" size={34} color="black" style={styles.IoniconsStyle} onPress={() => setUpdate(!update)} />
                    <Entypo name="trash" size={34} color="black" style={styles.IoniconsStyle} onPress={() => setDel(!del)} />
                    <FontAwesome name="handshake-o" size={34} color="black" style={styles.IoniconsStyle} onPress={() => setLoan(!loan)} />
                  </View>
                  <Text style={styles.textbottom}>{item.item_name}</Text>
                  <Text style={styles.textheader}>Codetype</Text>
                  <Text style={styles.textbottom}>{item.codetype}</Text>
                  <Text style={styles.textheader}>Codedata</Text>
                  <Text style={styles.textbottom}>{item.codedata}</Text>
                  <Text style={styles.textheader}>Image</Text>
                  <Image source={{ uri: item.image }} style={styles.ImageStyle} />
                  <View>
                    {loan ? (<Modal
                      style={styles.modalStyle}
                      animationType='fade'
                      transparent={true}
                      visible={true}
                    >
                      <View style={{ flex: 8, alignItems: 'center', justifyContent: 'center' }}>
                        <LoanItem itemID={item.item_id} itemname={item.item_name} itemImage={item.image} closeLoan={closeLoan} setLoanModal={setLoanModalFunc} />
                      </View>
                    </Modal>)
                      : null}
                    {del ? (<Modal
                      style={{ flex: 3 }}
                      animationType="slide"
                      transparent={true}
                      visible={true}>
                      <View style={{ flex: 5, alignItems: 'center', justifyContent: 'center' }}>
                        <DeleteItem itemID={item.item_id} itemName={item.item_name} itemImage={item.image} closeDelete={closeDelete} setDeleteModal={setDeleteModalFunc} />
                      </View>
                    </Modal>
                    ) : null}
                    {update ? (<Modal
                      style={{ flex: 3 }}
                      animationType="slide"
                      transparent={true}
                      visible={true}>
                      <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center', paddingBottom: '15%' }}>
                        <UpdateUser itemID={item.item_id} itemName={item.item_name} itemImage={item.image} closeUpdate={closeUpdate} setUpdateModal={setUpdateModalFunc} />
                      </View>
                    </Modal>
                    ) : null}
                  </View>
                </View>
              </View>
            )}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textheader: {
    color: '#111',
    fontSize: 12,
    fontWeight: '700',
    margin: 3,
  },
  textbottom: {
    color: '#111',
    fontSize: 18,
  },
  IoniconsStyle: {
    left: vw(15),
    paddingLeft: 10,
  },
  ImageStyle: {
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: vw(35),
    height: vh(15)
  },
  modalStyle: {
    flex: 8
  }
});
