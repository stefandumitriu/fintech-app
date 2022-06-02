import React, {Component} from 'react';
import { TouchableOpacity, View, StyleSheet, Text, StatusBar } from 'react-native';
import FontistoIcons from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class TransferPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
      }
    render() {
        return (
            <>
                <StatusBar backgroundColor='#11CB76'></StatusBar>
                <View style={styles.container}>
                    <View style = {styles.borderAccounts}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('TransferToFriendPage')}>
                            <FontistoIcons name="arrow-swap" size={30} style={{left:"10%", top: "45%"}}></FontistoIcons>
                            <Text style={{fontSize: 20, fontWeight: "bold", alignSelf: 'center', left:"7%", top: "-5%"}}>
                                Transfer to Friends
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style = {styles.recentTransactions}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('TransferNFCPage')}>
                            <MaterialCommunityIcons name="nfc" size={30} style={{left:"10%", top: "40%"}}></MaterialCommunityIcons>
                            <Text style={{fontSize: 20, fontWeight: "bold", alignSelf: 'center', left:"7%", top: "-5%"}}>
                                Transfer with NFC
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </>
            
        );
    }
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            marginTop: StatusBar.currentHeight || 0,
            alignItems: 'center'
        },
        borderAccounts: {
            backgroundColor: 'white',
            width: 350,
            height: 80,
            borderRadius: 20,
            top: 100,
        },
        recentTransactions: {
            backgroundColor: 'white',
            width: 350,
            height: 80,
            borderRadius: 20,
            top: 125, 
        },
    }
);