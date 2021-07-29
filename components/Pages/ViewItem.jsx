import React, { useState } from 'react'
import { View, Text, SafeAreaView, Modal, Image, Button } from 'react-native'
import { vw, vh } from 'react-native-expo-viewport-units';
import { StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import DeleteItem from './DeleteItem';
import UpdateUser from './UpdateItem';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LoanItem from './LoanItem';
import { FontAwesome } from '@expo/vector-icons'; 

const ViewItem = (props) => {
  const [del, setDel] = useState(false)
  const [update, setUpdate] = useState(false)
  const [loan, setLoan] = useState(false)


  const { itemID, itemName, codetype, codedata, image, setUpdateModal, setDeleteModal } = props

 /*  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };
  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setStartDatePickerVisibility(false);
    setEndDatePickerVisibility(false);
  };

  const handleStartConfirm = (startdate) => {
    console.log("A startdate has been picked: ", startdate);
    var newStartDate = new Date(startdate).toString().substring(0, 10)
    setStartDate(newStartDate)
    hideDatePicker();
  };
  const handleEndConfirm = (enddate) => {
    console.log("A enddate has been picked: ", enddate);
    var newEndDate = new Date(enddate).toString().substring(0, 10)
    setEndDate(newEndDate)
    hideDatePicker();
  }; */
  

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
        <View style={{ margin: 20, borderWidth: 1, padding: 15, flex: 1 }}>
          <Text style={styles.textheader}>ID</Text>
          <Text style={styles.textbottom}>{itemID}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.textheader}>Name</Text>
            
            <MaterialIcons name="update" size={34} color="black" onPress={() => setUpdate(!update)} />
            <Entypo name="trash" size={34} color="black" onPress={() => setDel(!del)} />
          </View>
          <Text style={{color: '#111',fontSize: 25, fontWeight:'600'}}>{itemName}</Text>
          <Text style={styles.textheader}>Codetype</Text>
          <Text style={styles.textbottom}>{codetype}</Text>
          <Text style={styles.textheader}>Codedata</Text>
          <Text style={styles.textbottom}>{codedata}</Text>
          <Text style={styles.textheader}>Image</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Image source={{ uri: image }} style={styles.ImageStyle} />
            <View style={{ justifyContent: 'space-evenly', flexDirection:'column' }}>
              <Text style={styles.textheader}>Lainaa itemi</Text>
              <FontAwesome name="handshake-o" size={34} color="black" onPress={() => setLoan(!loan)}/>
            </View>
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
    fontSize: 12,
    fontWeight: '700',
    margin:3,
  },
  textbottom: {
    color: '#111',
    fontSize: 18,
  },
  IoniconsStyle: {
    left: vw(50),
    paddingLeft: 10
  },
  ImageStyle: {
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: vw(35),
    height: vh(15)
  },
  modalStyle: {
    flex:8
  }
});

export default ViewItem
