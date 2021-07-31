import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { View, Text, Pressable, Button, Image, TextInput, Alert, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { vw, vh } from 'react-native-expo-viewport-units';
import { DatabaseConnection } from '../database/Database';

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
  const [weeks, setWeeks] = useState(new Date(Date.now() + (6.048e+8 * 2)).toISOString())

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
    console.log('nyt  ' + now)
    console.log('Haettavan tiedon takaraja  ' + weeks)

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM loantable WHERE item_reference=? AND startdate BETWEEN (?) AND (?) ORDER BY enddate DESC',
        [props.itemID, now, weeks],
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
    /* db.transaction((tx) => {
      tx.executeSql(
        'SELECT enddate FROM loantable WHERE item_reference=?',
        [props.itemID],
        (tx, results) => {
          var tempdate = [];
          for (let i = 0; i < results.rows.length; ++i)
          tempdate.push(results.rows.item(i));
          setTempDate(tempdate);
          Alert.alert('loantable updated')
          console.log(tempdate)
        }
      );
    }); */


  }, []);
  function addToDB() {
    if (loaner && startDate && endDate != null) {
      console.log(loaner)
      console.log(startDate)
      console.log(endDate)
      setLoaned(1)
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO loantable (loaner, startdate, enddate, loanstatus, item_reference ) VALUES (?,?,?,?,?)',
          [loaner, startDate, endDate, loaned, props.itemID],
          (tx, results) => {
            console.log('adding item now ....')
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
            } else alert('Error while adding item to database');
          }
        );
      });
    }
    nullifyStates()
  }
  function nullifyStates() {
    setLoaner(null)
    setStartDate(null)
    setEndDate(null)
    setLoaned(0)
  }

  /* function updateLoanToDB() {
    db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE loantable SET loanstatus=? WHERE item_reference=?',
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
  }; */
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
    var newStartDate = new Date(startdate).toISOString()
    setStartDate(newStartDate)
    console.log('uusi start date: ' + newStartDate)
    hideDatePicker();
  };
  const handleEndConfirm = (enddate) => {
    console.log("A enddate has been picked: ", enddate + ' ' + props.itemID);
    var newEndDate = new Date(enddate).toISOString()
    setEndDate(newEndDate)
    console.log('uusi end date: ' + newEndDate)
    hideDatePicker();
  };


  function returnBack() {
    props.closeLoan(false)
  }
  return (
    <SafeAreaView style={{ flex: 8, width: '95%', backgroundColor: 'white' }}>
      <View style={StyleSheet.absoluteFillObject}>
        <Pressable onPress={returnBack} style={styles.modalPressableStyle}>
          <Text style={styles.ModalTextStyle}>Sulje Modal Ikkuna</Text>
        </Pressable>
        <View style={{ justifyContent: 'space-evenly', flexDirection: 'row' }}>
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
        <View style={{ justifyContent: 'space-between', width: '100%', height: '10%' }}>
          <Text style={{ fontSize: 22 }}>Planned start date:   {startDate}</Text>
          <Text style={{ fontSize: 22 }}>Planned end date:  {endDate}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: loaned == 1 ? 'green' : 'null' }}>
          <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center' }}>{loaned ? 'Lainassa' : 'Lainattavissa'}</Text>
        </View>
        <Pressable onPress={() => addToDB()} style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontSize: 26, textAlign: 'center', borderWidth: 3 }}>Loan now</Text>
        </Pressable>
        <View style={{ flex: 3 }}>
          <ScrollView fadingEdgeLength={100}>
            {flatListItems != null ? flatListItems.map((i) => (
              <View style={{ flex: 1, margin: 10, borderRadius: 15, borderWidth: 3 }} key={i.loan_id}>
                <Text style={styles.textheader}> Startdate: {i.startdate.toString().substring(0, 10)}</Text>
                <Text style={styles.textheader}> Enddate: {i.enddate.toString().substring(0, 10)}</Text>
                <Text style={styles.textheader}> Loaner: {i.loaner}</Text>
                {i.loanStatus === 1 ?
                  <Pressable onPress={() => updateReturnToDB(i.loan_id)}>
                    <Text style={{ textAlign: 'right', fontSize: 24, margin: 4 }}>Return device</Text>
                  </Pressable>
                  : null}

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
    fontSize: 20,
    fontWeight: '700',
    margin: 3,
    textAlign: 'left',
  },
  ImageStyle: {
    flexWrap: 'wrap',
    width: vw(35),
    height: vh(15)
  },
  LoanedStyle: {
    backgroundColor: 'green',
  }
})

export default LoanItem
