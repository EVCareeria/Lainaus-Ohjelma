import React, {useState} from 'react'
import {View, Text, SafeAreaView, Modal, Image} from 'react-native'
import { vw, vh } from 'react-native-expo-viewport-units';
import { StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import DeleteItem from './DeleteItem';
import UpdateUser from './UpdateItem';

const ViewItem = (props) => {
    const [del, setDel] = useState(false)
    const [update, setUpdate] = useState(false)
    
    const {itemID, itemName, codetype, codedata, image, setUpdateModal, setDeleteModal} = props

    function closeDelete() {
        setDel(!del)
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
    
    
    return(
        <SafeAreaView style={{flex:6}}>
            <View>
                <View style={{margin:20, borderWidth:1, padding:15, flex:1}}>
                  <Text style={styles.textheader}>ID</Text>
                  <Text style={styles.textbottom}>{itemID}</Text>
                  <View style={{flexDirection:'row'}}>
                    <Text style={styles.textheader}>Name</Text>
                    <MaterialIcons name="update" size={34} color="black" style={styles.IoniconsStyle} onPress={() => setUpdate(!update)} />
                    <Entypo name="trash" size={34} color="black" style={styles.IoniconsStyle} onPress={() => setDel(!del)} />
                  </View>
                  <Text style={styles.textbottom}>{itemName}</Text>
                  <Text style={styles.textheader}>Codetype</Text>
                  <Text style={styles.textbottom}>{codetype}</Text>
                  <Text style={styles.textheader}>Codedata</Text>
                  <Text style={styles.textbottom}>{codedata}</Text>
                  <Text style={styles.textheader}>Image</Text>
                  <Image source={{ uri: image }} style={styles.ImageStyle} />
                </View>
            </View>
            <View>
              {del ? ( <Modal
                          style={{flex:8}}
                          animationType="slide"
                          transparent={true}
                          visible={true}>
                            <View style={{ flex: 8, alignItems: 'center', justifyContent: 'center' }}>
                              <DeleteItem itemID={itemID} itemName={itemName} itemImage={image} closeDelete={closeDelete} setDeleteModal={setDeleteModalFunc} />
                            </View>
                  </Modal>
                ) : null}
                {update ? ( <Modal
                          style={{flex:8}}
                          animationType="slide"
                          transparent={true}
                          visible={true}>
                            <View style={{ flex: 6, alignItems: 'center', justifyContent: 'center',paddingBottom:'15%' }}>
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
  
    },
    textbottom: {
      color: '#111',
      fontSize: 18,
    }, 
    IoniconsStyle: {
      left: vw(50),
      paddingLeft:10
    }, 
    ImageStyle: {
      flexWrap: 'wrap',
      justifyContent:'space-around',
      width: vw(35),
      height: vh(15)
    }
  });

export default ViewItem
