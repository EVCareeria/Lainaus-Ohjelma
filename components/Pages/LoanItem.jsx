import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { View, Text, Pressable, Button, Image, TextInput, Alert, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { vw, vh } from 'react-native-expo-viewport-units';
import { DatabaseConnection } from '../database/Database';
import moment from 'moment';
import { FlatList } from 'react-native-gesture-handler';

const db = DatabaseConnection.getConnection();

const LoanItem = (props) => {
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [flatListItems, setFlatListItems] = useState()
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [loaned, setLoaned] = useState(0)
  const [loaner, setLoaner] = useState()
  const [now, setNow] = useState(new Date().toISOString())
  const [weeks, setWeeks] = useState(new Date(Date.now() + (6.048e+8 * 4)).toISOString())
  const [inputStartDate, setInputStartDate] = useState(null)
  const [inputEndDate, setInputEndDate] = useState(null)
  const [showBox, setShowBox] = useState(true)
  const [orderBox, setOrderBox] = useState(true)
  const [dbAdd, setDbAdd] = useState(false)
  const [updateStatus, setUpdateStatus] = useState(false)

  const { itemID, itemname, itemImage, loanstatus } = props

  useEffect(() => {
    setInputStartDate(moment(startDate).format('DD-MM-YYYY'))
    setInputEndDate(moment(endDate).format('DD-MM-YYYY'))
  }, [startDate, endDate])

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM loantable WHERE (item_reference=(?) AND loanorder=(?) AND startdate) OR (item_reference=(?) AND loanorder=(?) AND enddate) BETWEEN (?) AND (?) ORDER BY startdate ASC',
        [itemID, '1', itemID, '1', now, weeks],
        (tx, results) => {
          var tempA = [];
          for (let i = 0; i < results.rows.length; ++i)
            tempA.push(results.rows.item(i));
          setFlatListItems(tempA);
          Alert.alert('loantable updated')
        }
      );
    });
  }, [updateStatus]);

  function addToDB() {
    setDbAdd(true)
    if (flatListItems != null) {
      for (let i of flatListItems) {
        var SD = i.startdate
        var ED = i.enddate
        var LN = i.loaner
        if (SD == startDate || ED == endDate || startDate >= SD && endDate <= ED || startDate <= SD && endDate <= ED && endDate >= SD || startDate <= SD && endDate >= ED || startDate >= SD && startDate <= ED) {
          showOrderDialog(LN)
          setDbAdd(false)
          break;
        }
      }
      if (dbAdd === true) {
        sendToDB()
      }
    }
  }
  function sendToDB() {
    if (loaner && startDate && endDate != null) {
      if (startDate > endDate) {
        Alert.alert('Start date can´t be larger than end date')
      } else {
        db.transaction(function (tx) {
          tx.executeSql(
            'INSERT INTO loantable (loaner, startdate, enddate, loanorder, item_reference ) VALUES (?,?,?,?,?)',
            [loaner, startDate, endDate, '1', itemID],
            (tx, results) => {
              Alert.alert('Loan order added for:  ' + props.itemname)
              if (results.rowsAffected > 0) {
              } else alert('Error while adding item to database');
            }
          );
        });
      }
    }
    nullifyStates()
  }
  function nullifyStates() {
    setLoaner(null)
    setStartDate(null)
    setEndDate(null)
    setLoaned(0)
    setUpdateStatus(!updateStatus)
  }

  function updateReturnToDB(ID) {
    db.transaction(function (tx) {
      tx.executeSql(
        'DELETE FROM loantable WHERE loan_id=?',
        [ID],
        (tx, results) => {
          returnBack()
        }
      );
    });
  };
  function loanNow(loaner) {
    if (loanstatus == '1') {
      db.transaction(function (tx) {
        tx.executeSql(
          'UPDATE items SET loanstatus=(?) WHERE item_id=(?)',
          [loaner, itemID],
          (tx, results) => {
            Alert.alert('Item ' + props.itemname + ' Loaned')
          }
        );
      });
    } else {
      return Alert.alert('Item is already loaned')
    }
  };
  function returnLoan() {
    db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE items SET loanstatus=(?) WHERE item_id=(?)',
        ['1', itemID],
        (tx, results) => {
        }
      );
    });
    db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE loantable SET loanstatus=(?) WHERE item_id=(?)',
        ['1', itemID],
        (tx, results) => {
        }
      );
    });
    returnBack()
  };
  const showConfirmDialog = (ID) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove or return loan order for " + itemname,
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            setShowBox(false);
            updateReturnToDB(ID)
            returnLoan()
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };
  const showOrderDialog = (LN) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to add loan order for " + itemname + " it overlaps with order from: " + LN,
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            setOrderBox(false);
            sendToDB()
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
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
    var newStartDate = new Date(startdate).toISOString()
    setStartDate(newStartDate)
    hideDatePicker();
  };
  const handleEndConfirm = (enddate) => {
    var newEndDate = new Date(enddate).toISOString()
    setEndDate(newEndDate)
    hideDatePicker();
  };


  function returnBack() {
    props.closeLoan(false)
  }
  return (
    <SafeAreaView style={StyleSheet.absoluteFill}>
      <View style={{ flex: 12, backgroundColor: 'white' }}>
        <Pressable onPress={returnBack} style={styles.modalPressableStyle}>
          <Text style={styles.ModalTextStyle}>Close this window</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <View style={{ justifyContent: 'center' }}>
            <Text style={styles.textheader}>Loan Item: {itemname}</Text>
          </View>
          {itemImage ? <Image source={{ uri: itemImage }} style={styles.ImageStyle} /> : null}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: '1%' }}>
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <Text style={styles.textheader}>Enter your name:</Text>
          <TextInput
            placeholder="Loaner name"
            value={loaner}
            style={{ fontSize: 22, textAlign: 'center' }}
            onChangeText={
              (loaner) => setLoaner(loaner)
            }
          />
        </View>

        <View style={{}}>
          <Text style={{ fontSize: 22 }}>start date: {startDate ? inputStartDate : null} </Text>
          <Text style={{ fontSize: 22 }}>end date:  {endDate ? inputEndDate : null}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: loaned == 1 ? 'green' : 'null' }}>
          <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center' }}></Text>
        </View>

        <Pressable onPress={() => addToDB()} style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{display:'flex', fontSize: 26, textAlign: 'center', borderWidth: 3, backgroundColor: 'rgba(238, 216, 182, 0.2)', }}>Set loan order</Text>
        </Pressable>
        <View style={{ flex: 10 }}>
          <FlatList
            data={flatListItems}
            keyExtractor={item => item.loan_id.toString()}
            contentContainerStyle={{
              padding: 15
            }}
            renderItem={({ item }) => {
              return <View style={{ flexDirection: 'column', padding: 10, marginBottom: 10, borderRadius: 15, borderWidth: 3, }}>
                <Text style={styles.textheader}> Startdate: {moment(item.startdate).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                <Text style={styles.textheader}> Enddate: {moment(item.enddate).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.textheader}> Loaner: {item.loaner}</Text>
                  {loanstatus == item.loaner ?
                    <Pressable onPress={() => showConfirmDialog(item.loan_id)}>
                      <Text style={{ textAlign: 'right', fontSize: 24, margin: 2, color: 'red' }}>Return device</Text>
                    </Pressable>
                    : <Pressable onPress={() => loanNow(item.loaner)}>
                      <Text style={{ textAlign: 'right', fontSize: 24, margin: 2, color: 'green' }}>Loan device</Text>
                    </Pressable>}
                </View>
              </View>
            }}
          />
        </View>
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
    fontSize: 22,
    fontWeight: '700',
    margin: 2,
    fontFamily: 'RobotoMedium',
    textAlign: 'center',
  },
  textbottom: {
    color: '#111',
    fontSize: 22,
    fontFamily: 'AssistantMedium',
    textDecorationLine: 'underline',
  },
  ImageStyle: {
    flex: 1,
    width: vw(20),
    height: vh(10),
    margin: '5%',
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

export default LoanItem
