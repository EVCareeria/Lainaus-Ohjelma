import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Image } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from '@react-navigation/native';


// Guide componentti Järjestelmän käyttöohjeita varten

const Guide = () => {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <ScrollView>
                <View style={styles.Guideheader}>
                    <Text style={styles.Title}>Guide</Text>
                </View>
                <View style={styles.PartContainer}>
                    <Text style={[styles.PartTitle, {color:colors.text}]}>PART: 1 - ADD ITEM TO DATABASE</Text>
                    <View style={styles.ImageContainer} >
                        <Image style={styles.Images} source={require('../assets/GuideImages/Part1/1.png')} />
                        <Image style={styles.Images} source={require('../assets/GuideImages/Part1/2.png')} />
                        <Image style={styles.Images} source={require('../assets/GuideImages/Part1/3.png')} />
                        <Image style={styles.Images} source={require('../assets/GuideImages/Part1/4.png')} />
                    </View>
                </View>
                <View style={styles.PartContainer}>
                    <Text style={[styles.PartTitle, {color:colors.text}]}>PART: 2 - YOU CAN NOW UPDATE, DELETE AND SET LOAN ORDERS TO THAT ITEM</Text>
                    <View style={styles.ImageContainer} >
                        <Image style={styles.Images} source={require('../assets/GuideImages/Part2/1.png')} />
                        <Image style={styles.Images} source={require('../assets/GuideImages/Part2/2.png')} />
                        <Image style={styles.Images} source={require('../assets/GuideImages/Part2/3.png')} />
                    </View>
                </View>
                <View style={styles.PartContainer}>
                    <Text style={[styles.PartTitle, {color:colors.text}]}>PART: 3 - YOU CAN SCAN ITEM BARCODE OR OTHER STORED CODES TO QUICKLY SEARCH ITEMS FROM DATABASE</Text>
                    <View style={styles.ImageContainer} >
                        <Image style={styles.Images} source={require('../assets/GuideImages/Part3/1.png')} />
                        <Image style={styles.Images} source={require('../assets/GuideImages/Part3/2.png')} />
                        <Image style={styles.Images} source={require('../assets/GuideImages/Part3/3.png')} />
                    </View>
                </View>
                <View style={styles.PartContainer}>
                    <Text style={[styles.PartTitle, {color:colors.text}]}>PART: 4 - TO UTILIZE LOANING SYSTEM, FILL THE INFORMATION REQUIRED AND SET LOAN STATUS FOR YOUR ORDER</Text>
                    <View style={styles.ImageContainer} >
                        <Image style={styles.Images} source={require('../assets/GuideImages/Part4/1.png')} />
                        <Image style={styles.Images} source={require('../assets/GuideImages/Part4/2.png')} />
                        <Image style={styles.Images} source={require('../assets/GuideImages/Part4/3.png')} />
                        <Image style={styles.Images} source={require('../assets/GuideImages/Part4/4.png')} />
                        <Image style={styles.Images} source={require('../assets/GuideImages/Part4/5.png')} />
                        <Image style={styles.Images} source={require('../assets/GuideImages/Part4/6.png')} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Guide


const styles = StyleSheet.create({
    Guideheader: {
        margin: 25,
        justifyContent:'center',
        alignSelf:'center'
    },
    Title: {
        fontSize: vh(6),
        color:'green',
        textTransform: "uppercase",
        fontFamily: 'RobotoMedium',
    },
    PartTitle: {
        fontSize: 15 + vh(3),
        textTransform: "uppercase",
        fontFamily: 'AssistantMedium',
        textAlign:'center',
        maxWidth:'70%',
        marginTop:'10%',
        marginBottom:'10%',
    },
    Images: {
        width: 100 + vw(15),
        aspectRatio: 2 / 4,
    },
    ImageContainer: {
        flexDirection: "row",
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },
    PartContainer: {
        margin: '1%',
        justifyContent:'center',
        alignItems:'center',
    }
})
