import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, Modal, Image, Button } from 'react-native'
import { vw, vh } from 'react-native-expo-viewport-units';
import { StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import DeleteItem from './DeleteItem';
import UpdateUser from './UpdateItem';
import LoanItem from './LoanItem';
import { FontAwesome } from '@expo/vector-icons';
import { DatabaseConnection } from '../database/Database';

const db = DatabaseConnection.getConnection();

const ViewItem = (props) => {
  const [del, setDel] = useState(false)
  const [update, setUpdate] = useState(false)
  const [loan, setLoan] = useState(false)
  const [currentLoans, setCurrentLoans] = useState()
  const [now, setNow] = useState(new Date().toISOString())
  const [weeks, setWeeks] = useState(new Date(Date.now() + (6.048e+8 * 2)).toISOString())


  const { itemID, itemName, codetype, codedata, image, setUpdateModal, setDeleteModal } = props


  useEffect(() => {
    setCurrentLoans(0)
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM loantable WHERE (item_reference=(?) AND startdate) OR (item_reference=(?) AND enddate) BETWEEN (?) AND (?)',
        [itemID, itemID, now, weeks],
        (tx, results) => {
          var temp = [];
          temp.push(results.rows.length);
          setCurrentLoans(temp)
          console.log('setCurrentLoans ja jotain sellasta  ' + currentLoans)
        }
      );
    });
  }, [])



  function closeDelete() {
    setDel(!del)
  }
  function closeLoan() {
    setLoan(!loan)
  }
  function closeUpdate() {
    setUpdate(!update)
  }
  function setUpdateModalFunc() {
    setUpdateModal(true)
  }
  function setDeleteModalFunc() {
    setDeleteModal(true)
  }
  function setLoanModalFunc() {
    null
  }


  return (
    <SafeAreaView style={{ flex: 6 }}>
      <View>
        <View style={{ borderWidth: 1, padding: '2%', flex: 1, backgroundColor:'#F6F4EC' }}>
            <View style={{ flexDirection: 'row', justifyContent:'space-between' }}>
            <Text style={styles.textheader}>Name</Text>
            <Text style={styles.textbottom}>{itemName}</Text>
              <MaterialIcons name="update" size={38} color="black" onPress={() => setUpdate(!update)} />
              <Entypo name="trash" size={38} color="black" onPress={() => setDel(!del)} />
            </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Image source={{ uri: image }} style={styles.ImageStyle} />
            <View style={{ justifyContent: 'space-evenly', flexDirection: 'column' }}>
              <Text style={styles.textheader}>Lainaa itemi</Text>
              <FontAwesome name="handshake-o" size={38} color="black" onPress={() => setLoan(!loan)} />
            </View>
          </View>
          <View>
            <Text style={styles.textbottom}>Loaned for next 2 weeks: {currentLoans != 0 ? currentLoans : 0} times</Text>
          </View>
        </View>
      </View>
      <View>
        {loan ? (<Modal
          style={styles.modalStyle}
          animationType='fade'
          transparent={true}
          visible={true}
        >
          <View style={{ flex: 8, alignItems: 'center', justifyContent: 'center' }}>
            <LoanItem itemID={itemID} itemname={itemName} itemImage={image} closeLoan={closeLoan} setLoanModal={setLoanModalFunc} />
          </View>
        </Modal>)
          : null}
        {del ? (<Modal
          style={styles.modalStyle}
          animationType="fade"
          transparent={true}
          visible={true}>
          <View style={{ flex: 8, alignItems: 'center', justifyContent: 'center' }}>
            <DeleteItem itemID={itemID} itemName={itemName} itemImage={image} closeDelete={closeDelete} setDeleteModal={setDeleteModalFunc} />
          </View>
        </Modal>
        ) : null}
        {update ? (<Modal
          style={styles.modalStyle}
          animationType="fade"
          transparent={true}
          visible={true}>
          <View style={{ flex: 6, alignItems: 'center', justifyContent: 'center', paddingBottom: '15%' }}>
            <UpdateUser itemID={itemID} itemName={itemName} itemImage={image} closeUpdate={closeUpdate} setUpdateModal={setUpdateModalFunc} />
          </View>
        </Modal>
        ) : null}
      </View>


    </SafeAreaView>

  )
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
    justifyContent: 'space-around',
    width: vw(30),
    height: vh(10),
    margin: '5%',
  },
  modalStyle: {
    flex: 8
  }
});

export default ViewItem
