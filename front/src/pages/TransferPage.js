import React, {Component} from 'react';
import { TouchableOpacity, View, StyleSheet, Text, StatusBar } from 'react-native';
import FontistoIcons from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import OcticonsIcons from 'react-native-vector-icons/Octicons';
import FeatherIcons from 'react-native-vector-icons/Feather';

export default class TransferPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
      }
    render() {
        return (
            <>
                <StatusBar backgroundColor='#7de24e'></StatusBar>
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
                        <TouchableOpacity onPress={() => alert("Transfer with NFC will be available soon!")}>
                            <MaterialCommunityIcons name="nfc" size={30} style={{left:"10%", top: "40%"}}></MaterialCommunityIcons>
                            <Text style={{fontSize: 20, fontWeight: "bold", alignSelf: 'center', left:"7%", top: "-5%"}}>
                                Transfer with NFC
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.menuBar}>
                        <View style={styles.homeButton}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('PrincipalScreen')}>
                                    <FontAwesomeIcon name="home" size={40} style={{left: 0, top: 2}}></FontAwesomeIcon>
                                </TouchableOpacity>
                        </View>

                        <View style={styles.stocksButton}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Stocks')}>
                                <FeatherIcons name="trending-up" size={40} style={{left: 5, top: 3}}></FeatherIcons>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.transferButton}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Transfer')}>
                                <FontistoIcons name="arrow-swap" size={35} style={{left: 5, top: 5}}></FontistoIcons>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.walletButton}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('WalletPage')}>
                                <FontistoIcons name="wallet" size={35} style={{left: 5, top: 5}}></FontistoIcons>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.spendingAnalysisButton}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('SpendingAnalysisPage')}>
                                <OcticonsIcons name="graph" size={40} style={{left: 5, top: 2}}></OcticonsIcons>
                            </TouchableOpacity>
                        </View>
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
        homeButton: {
            width: 45,
            height: 45,
            position: 'absolute',
            top: "5%",
            right: "85%",
            borderRadius: 10,
        },
        menuBar: {
            backgroundColor: "#7de24e",
            width: '100%',
            height: 55,
            flex: 0.1,
            justifyContent: "flex-end",
            flexDirection: "row",
            top: '105%'
        },
        stocksButton: {
            width: 45,
            height: 45,
            position: 'absolute',
            top: "5%",
            right: "65%",
            borderRadius: 10,
        },
        transferButton: {
            width: 45,
            height: 45,
            position: 'absolute',
            top: "5%",
            right: "45%",
            borderRadius: 10,
        },
        walletButton: {
            width: 45,
            height: 45,
            position: 'absolute',
            top: "5%",
            right: "25%",
            borderRadius: 10,
        },
        spendingAnalysisButton: {
            width: 45,
            height: 45,
            position: 'absolute',
            top: "0.5%",
            right: "5%",
            borderRadius: 10,
        },
    }
);