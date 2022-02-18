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
import { useTheme } from '@react-navigation/native';

const db = DatabaseConnection.getConnection();

const ViewItem = (props) => {
  const [del, setDel] = useState(false)
  const [update, setUpdate] = useState(false)
  const [loan, setLoan] = useState(false)
  const [now, setNow] = useState(new Date(Date.now() - (6.048e+8 * 0.1)).toISOString())
  const [week, setWeeks] = useState(new Date(Date.now() + (6.048e+8 * 1)).toISOString())
  const { colors } = useTheme();


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
    <SafeAreaView style={{ display: 'flex', flex: 6 }}>
      <View>
        <View style={{ borderWidth: 1, padding: '1%', display: 'flex', flex: 1, backgroundColor: colors.primary }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Text style={[styles.textheader, {color:colors.text}]}>Name</Text>
            <Text style={[styles.textbottom, {color:colors.text}]}>{itemName}</Text>
            <MaterialIcons name="update" size={38} color={colors.icon} onPress={() => setUpdate(!update)} />
            <Entypo name="trash" size={38} color={colors.icon} onPress={() => setDel(!del)} />
            <FontAwesome name="handshake-o" size={38} color={colors.icon} onPress={() => setLoan(!loan)} />
          </View>
          <View style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
          <Image source={{ uri: image }} style={styles.ImageStyle} />
          <Text style={[styles.textbottom, {color:colors.text}]}>Loan status ?: {loanStatus != '1' ? <Text style={{ color: 'red' }}>Loaned</Text> : <Text style={{ color: 'green' }}>Not in loan</Text>} </Text>
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
          <View style={{ flex: 8, alignItems: 'center', justifyContent: 'center', zIndex: 5}}>
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
    margin: '1%',
  },
  modalStyle: {
    flex: 1,
  }
});

export default ViewItem
