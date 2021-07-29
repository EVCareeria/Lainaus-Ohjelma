import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { View, Text, Pressable, Button, Image, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { vw, vh } from 'react-native-expo-viewport-units';

const LoanItem = (props) => {
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [flatListItems, setFlatListItems] = useState()
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [loaned, setLoaned] = useState(0)
  const [loaner, setLoaner] = useState()

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM loantable WHERE item_reference=? ',
        [props.itemID],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFlatListItems(temp);
          Alert.alert('loantable updated')
          console.log(temp)
        }
      );
    });
  }, []);
  function addToDB() {
    setLoaned(1)
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO loantable (loaner, startdate, enddate, item_reference) VALUES (?,?,?)',
        [loaner, startDate, endDate, props.itemID],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'success',
              'item added to database',
            );
          } else alert('Error while adding item to database');
        }
      );
    });
  }

  function updateLoanToDB() {
    db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE loantable SET enddate=? WHERE item_reference=?',
        [loaned, props.itemID],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Information updated',
            );
          } else alert('Error while updating item');
          returnBack()
        }
      );
    });
  };

  const showStartDatePicker = () => {
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
    console.log("A startdate has been picked: ", startdate + ' ' + props.itemID);
    var newStartDate = new Date(startdate).toString().substring(0, 15)
    setStartDate(newStartDate)
    console.log('uusi start date: ' + newStartDate)
    hideDatePicker();
  };
  const handleEndConfirm = (enddate) => {
    console.log("A enddate has been picked: ", enddate + ' ' + props.itemID);
    var newEndDate = new Date(enddate).toString().substring(0, 15)
    setEndDate(newEndDate)
    console.log('uusi end date: ' + newEndDate)
    hideDatePicker();
  };


  function returnBack() {
    props.closeLoan(false)
  }
  return (
    <SafeAreaView style={{ flex: 8, width: '95%' }}>
      <View style={{ flex: 6, backgroundColor: 'white', margin: 50 }}>
        <Pressable onPress={returnBack} style={styles.modalPressableStyle}>
          <Text style={styles.ModalTextStyle}>Sulje Modal Ikkuna</Text>
        </Pressable>
        <View style={{justifyContent:'space-evenly', flexDirection:'row'}}>
          <Text style={styles.textheader}>Loan Item:</Text>
          <Text style={styles.textheader}>{props.itemname}</Text>
        </View>

        <Text style={styles.textheader}>Image</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <Image source={{ uri: props.itemImage }} style={styles.ImageStyle} />
          <View style={{ justifyContent: 'space-evenly', flexDirection: 'column' }}>

          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
          <View style={{ width: '35%' }}>
            <Button title="Pick Planned start date" onPress={showStartDatePicker} />
            <DateTimePickerModal
              isVisible={isStartDatePickerVisible}
              mode="datetime"
              onConfirm={handleStartConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <View style={{ width: '35%' }}>
            <Button title="Pick Planned end date" onPress={showEndDatePicker} />
            <DateTimePickerModal
              isVisible={isEndDatePickerVisible}
              mode="datetime"
              onConfirm={handleEndConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        </View>
        <Text style={{ fontSize: 20, textAlign: 'center' }}>Anna nimesi</Text>
        <TextInput
          placeholder="Loaner name"
          value={loaner}
          style={{ padding: 10, fontSize: 30, textAlign: 'center' }}
          onChangeText={
            (loaner) => setLoaner(loaner)
          }
        />
        <View style={{ justifyContent: 'space-evenly', width: '100%', height: '10%' }}>
          <Text style={{ fontSize: 22 }}>Planned start date:   {startDate}</Text>
          <Text style={{ fontSize: 22 }}>Planned end date:  {endDate}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: loaned == 1 ? 'green' : 'null' }}>
          <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center' }}>{loaned ? 'Lainassa' : 'Lainattavissa'}</Text>
        </View>
        <Pressable onPress={addToDB} style={{ flex: 1 }}>
          <Text style={styles.textheader}>Loan now</Text>
        </Pressable>

      </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  modalPressableStyle: {
    alignContent: 'center',
    backgroundColor: 'white',
    zIndex: 0,
  },
  ModalTextStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 30,
    borderWidth: 2,
    borderRadius: 15,
    padding: 10,
    backgroundColor: 'yellow',
    opacity: 0.7
  },
  textheader: {
    color: '#111',
    fontSize: 20,
    fontWeight: '700',
    margin: 3,
    textAlign: 'center',
  },
  ImageStyle: {
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: vw(35),
    height: vh(15)
  },
  LoanedStyle: {
    backgroundColor: 'green',
  }
})

export default LoanItem
