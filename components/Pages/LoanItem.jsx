import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { View, Text, Pressable, Button, Image, TextInput, Alert, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { vw, vh } from 'react-native-expo-viewport-units';
import { DatabaseConnection } from '../database/Database';
import moment from 'moment';

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

  const { itemID, itemname, itemImage, closeLoan, setLoanModal } = props

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM loantable',
        [],
        (tx, results) => {
          var taul = []
          for (let i = 0; i < results.rows.length; i++)
            taul.push(results.rows.item(i))
          console.log(JSON.stringify(taul))
        }
      )
    })
  }, [])
  useEffect(() => {
    setInputStartDate(moment(startDate).format('DD-MM-YYYY'))
    setInputEndDate(moment(endDate).format('DD-MM-YYYY'))
  }, [startDate, endDate])

  useEffect(() => {
    console.log('nyt  ' + now)
    console.log('Haettavan tiedon takaraja  ' + weeks)
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM loantable WHERE (item_reference=(?) AND loanstatus=(?) AND startdate) OR (item_reference=(?) AND loanstatus=(?) AND enddate) BETWEEN (?) AND (?) ORDER BY startdate ASC',
        [itemID, 1, itemID, 1, now, weeks],
        (tx, results) => {
          var tempA = [];
          for (let i = 0; i < results.rows.length; ++i)
            tempA.push(results.rows.item(i));
          setFlatListItems(tempA);
          Alert.alert('loantable updated')
          console.log(JSON.stringify(tempA))
        }
      );
    });
  }, []);
  function addToDB() {
    if (loaner && startDate && endDate != null) {
      console.log(loaner)
      console.log(startDate)
      console.log(endDate)
      if (startDate >= endDate) {
        Alert.alert('Start date cant be larger than end date')
      } else {
        db.transaction(function (tx) {
          tx.executeSql(
            'INSERT INTO loantable (loaner, startdate, enddate, loanstatus, item_reference ) VALUES (?,?,?,?,?)',
            [loaner, startDate, endDate, 1, itemID],
            (tx, results) => {
              console.log('adding item now ....')
              Alert.alert('Item ' + props.itemname + ' Loaned')

              console.log('Results', results.rowsAffected);
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
  }

  function updateReturnToDB(ID) {
    db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE loantable SET loanstatus=? WHERE loan_id=?',
        [loaned, ID],
        (tx, results) => {
          console.log('Itemi palautettu ');
          returnBack()
        }
      );
    });
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
    console.log("A startdate has been picked: ", startdate + ' ' + itemID);
    var newStartDate = new Date(startdate).toISOString()
    setStartDate(newStartDate)
    console.log('uusi start date: ' + newStartDate)
    hideDatePicker();
  };
  const handleEndConfirm = (enddate) => {
    console.log("A enddate has been picked: ", enddate + ' ' + itemID);
    var newEndDate = new Date(enddate).toISOString()
    setEndDate(newEndDate)
    console.log('uusi end date: ' + newEndDate)
    hideDatePicker();
  };


  function returnBack() {
    closeLoan(false)
  }
  return (
    <SafeAreaView style={{ flex: 12, width: '95%', backgroundColor: 'white' }}>
      <View style={StyleSheet.absoluteFillObject}>
        <Pressable onPress={returnBack} style={styles.modalPressableStyle}>
          <Text style={styles.ModalTextStyle}>Sulje Modal Ikkuna</Text>
        </Pressable>
        <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', padding: '1%' }}>
          <Text style={styles.textheader}>Loan Item: {itemname}</Text>
          <Text style={styles.textheader}>Loan ID: {itemID}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {itemImage ? <Image source={{ uri: itemImage }} style={styles.ImageStyle} /> : null}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: '1%' }}>
          <View style={{ width: '35%' }}>
            <Button title="Pick Planned start date" onPress={showStartDatePicker} />
            <DateTimePickerModal
              isVisible={isStartDatePickerVisible}
              mode="date"
              onConfirm={handleStartConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <View style={{ width: '35%' }}>
            <Button title="Pick Planned end date" onPress={showEndDatePicker} />
            <DateTimePickerModal
              isVisible={isEndDatePickerVisible}
              mode="date"
              onConfirm={handleEndConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        </View>
        <Text style={styles.textheader}>Anna nimesi</Text>
        <TextInput
          placeholder="Loaner name"
          value={loaner}
          style={{ padding: 10, fontSize: 30, textAlign: 'center' }}
          onChangeText={
            (loaner) => setLoaner(loaner)
          }
        />
        <View style={{ justifyContent: 'space-between', width: '100%', height: '10%' }}>
          <Text style={{ fontSize: 22 }}>start date: {startDate ? inputStartDate : null} </Text>
          <Text style={{ fontSize: 22 }}>end date:  {endDate ? inputEndDate : null}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: loaned == 1 ? 'green' : 'null' }}>
          <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center' }}>{loaned ? 'Lainassa' : 'Lainattavissa'}</Text>
        </View>
        <Pressable onPress={() => addToDB()} style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontSize: 26, textAlign: 'center', borderWidth: 3 }}>Loan now</Text>
        </Pressable>
        <View style={{ flex: 8 }}>
          <ScrollView fadingEdgeLength={100}>
            {flatListItems != null ? flatListItems.map((i) => (
              <View style={{ flex: 1, margin: 10, borderRadius: 15, borderWidth: 3 }} key={i.loan_id}>
                <Text style={styles.textheader}> Startdate: {moment(i.startdate).format('DD-MM-YYYY')}</Text>
                <Text style={styles.textheader}> Enddate: {moment(i.enddate).format('DD-MM-YYYY')}</Text>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <Text style={styles.textheader}> Loaner: {i.loaner}</Text>
                  {i.loanstatus === 1 ?
                    <Pressable onPress={() => showConfirmDialog(i.loan_id)}>
                      <Text style={{ textAlign: 'right', fontSize: 24, margin: 4 }}>Return device</Text>
                    </Pressable>
                    : null}
                </View>


              </View>
            )) : null}
          </ScrollView>
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
    justifyContent: 'center',
    alignSelf: 'center',
    width: vw(70),
    height: vh(20),
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
