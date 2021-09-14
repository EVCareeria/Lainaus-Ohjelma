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
  const [now, setNow] = useState(new Date(Date.now() - (6.048e+8 * 0.1)).toISOString())
  const [week, setWeeks] = useState(new Date(Date.now() + (6.048e+8 * 1)).toISOString())


  const { itemID, itemName, codetype, codedata, image, loanStatus, setUpdateModal, setDeleteModal, setLoanModal } = props

  function closeDelete() {
    setDel(!del)
    setDeleteModal(true)
  }
  function closeLoan() {
    setLoan(!loan)
    setLoanModal(true)
  }
  function closeUpdate() {
    setUpdate(!update)
    setUpdateModal(true)
  }
  function setUpdateModalFunc() {
    setUpdateModal(true)
  }
  function setDeleteModalFunc() {
    setDeleteModal(true)
  }
  function setLoanModalFunc() {
    setLoanModal(true)
  }


  return (
    <SafeAreaView style={{ flex: 6 }}>
      <View>
        <View style={{ borderWidth: 1, padding: '2%', flex: 1, backgroundColor: 'rgba(255, 237, 211, 1)'}}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.textheader}>Name</Text>
            <Text style={styles.textbottom}>{itemName}</Text>
            <MaterialIcons name="update" size={38} color="black" onPress={() => setUpdate(!update)} />
            <Entypo name="trash" size={38} color="black" onPress={() => setDel(!del)} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Image source={{ uri: image }} style={styles.ImageStyle} />
            <View style={{ justifyContent: 'space-evenly', flexDirection: 'column' }}>
              <Text style={styles.textheader}>Loan item</Text>
              <FontAwesome name="handshake-o" size={38} color="black" onPress={() => setLoan(!loan)} />
            </View>
          </View>
          <View>
            <Text style={styles.textbottom}>Loan status ?: {loanStatus == 1 ? <Text style={{color:'red'}}>Loaned</Text>  : <Text style={{color:'green'}}>Not in loan</Text> } </Text>
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
            <LoanItem itemID={itemID} itemname={itemName} itemImage={image} loanstatus={loanStatus} closeLoan={closeLoan} setLoanModal={setLoanModalFunc} />
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
