import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Image} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import OcticonsIcons from 'react-native-vector-icons/Octicons';
import FontistoIcons from 'react-native-vector-icons/Fontisto';
import FeatherIcons from 'react-native-vector-icons/Feather';
import FlagIcon from 'react-native-ico-flags';
import testJsonFile from '../data.json';

export default class PrincipalScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: null,
        }
    }

    render() {
        let flag = '';
        let currency = '';
        if (testJsonFile.currency === 'lei') {
            flag = 'romania';
            currency = 'RON';
        }
        else if (testJsonFile.currency === 'euro') {
            flag = "european-union";
            currency = '\u20AC';
        }
        return (
            <>
                <StatusBar backgroundColor='#7de24e'></StatusBar>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.signOutButton}
                        activeOpacity={0.5}
                        onPress={() => this.props.navigation.replace('Auth')}>
                        <FontAwesomeIcon name="home" size={30} style={{left: 4, top: 2}}></FontAwesomeIcon>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.dashboardText}>Dashboard</Text> 

                        {/* Current account and amount of money */}
                        <View style = {styles.borderAccounts}>

                            <View style={styles.flagStyle}>
                                <FlagIcon name={flag} height="60" width="60"></FlagIcon>
                            </View>

                            <Text style = {styles.amountText}>
                                {currency}69420.69
                            </Text>

                        </View> 

                        {/* Recent transactions. Press the white slide*/}
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('TransactionPage')}>
                            <View style = {styles.recentTransactions}>
                                <Text style = {styles.recentTransactionTitle}>
                                        Recent Transactions
                                </Text>

                                <View >
                                    <Image style = {{
                                                top: "30%",
                                                left: "3%",
                                                borderRadius: 20
                                            }} 
                                            source={{width:35, height:35, uri: 'https://picsum.photos/200'}}
                                    ></Image>
                                    <Image style = {{
                                                top: "60%",
                                                left: "3%",
                                                borderRadius: 20
                                            }} 
                                            source={{width:35, height:35, uri: 'https://picsum.photos/200'}}></Image>
                                </View>

                                <View >
                                    <Text 
                                        style = {{
                                            fontSize: 15,
                                            fontWeight: "bold",
                                            alignSelf: 'center',
                                            top: "-100%",
                                            left: "-5%"
                                        }}
                                    >
                                            To: GabrielP
                                    </Text>
                                    <Text 
                                        style = {{
                                            fontSize: 15,
                                            fontWeight: "bold",
                                            alignSelf: 'center',
                                            top: "-18%",
                                            left: "-5%"
                                        }}
                                    >
                                            From: GabrielI
                                    </Text>
                                </View>

                                <View>
                                    <Text 
                                        style = {{
                                            fontSize: 15,
                                            fontWeight: "bold",
                                            alignSelf: 'center',
                                            top: "-203%",
                                            left: "35%"
                                        }}
                                    >
                                            RON 6.9
                                    </Text>

                                    <Text 
                                        style = {{
                                            fontSize: 15,
                                            fontWeight: "bold",
                                            alignSelf: 'center',
                                            top: "-120%",
                                            left: "35%"
                                        }}
                                    >
                                            RON 6.9
                                    </Text>
                                </View>
                                
                            </View> 
                        </TouchableOpacity>
                        

                        {/* Overall balance */}
                        <View style = {styles.overallBalance}>
                            <View>
                                <Text style = {styles.overallBalanceTitle}>
                                        Overall Balance
                                </Text>
                            </View>
                            
                            <View style={{top: "10%"}}>
                                <Text style = {styles.overallBalanceCash}>
                                        Cash
                                </Text>
                                <Text style = {styles.overallBalanceStocks}>
                                        Stocks
                                </Text>
                                <Text style = {styles.overallBalanceSafe}>
                                        Safe
                                </Text>
                            </View>

                            <View style={{top: "-28%", left: "10%"}}>
                                <Text style = {styles.amountOverallBalanceCash}>
                                    RON 200.04
                                    </Text>
                                <Text style = {styles.amountOverallBalanceStocks}>
                                        RON 1.04
                                    </Text>
                                <Text style = {styles.amountOverallBalanceSafe}>
                                    RON 200000.04
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Bottom menu bar */}
                <View style={styles.menuBar}>
                    <View style={styles.homeButton}>
                            <TouchableOpacity onPress={() => alert("Home button pressed!")}>
                                <FontAwesomeIcon name="home" size={40} style={{left: 3, top: 2}}></FontAwesomeIcon>
                            </TouchableOpacity>
                    </View>

                    <View style={styles.stocksButton}>
                        <TouchableOpacity onPress={() => this.props.navigation.replace('Stocks')}>
                            <FeatherIcons name="trending-up" size={40} style={{left: 5, top: 3}}></FeatherIcons>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.transferButton}>
                        <TouchableOpacity onPress={() => alert("Transfer button pressed!")}>
                            <FontistoIcons name="arrow-swap" size={35} style={{left: 5, top: 5}}></FontistoIcons>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.walletButton}>
                        <TouchableOpacity onPress={() => alert("Wallet button pressed!")}>
                            <FontistoIcons name="wallet" size={35} style={{left: 5, top: 5}}></FontistoIcons>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.spendingAnalysisButton}>
                        <TouchableOpacity onPress={() => alert("SpendingAnalysis button pressed!")}>
                            <OcticonsIcons name="graph" size={40} style={{left: 5, top: 2}}></OcticonsIcons>
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
            backgroundColor: '#f0efed',
            flex: 2,
            alignItems: "center",
        },
        flagStyle: {
            borderRadius: 30,
            position: 'relative',
            top: "20%",
            left: "15%"
        },
        amountText: {
            fontSize: 30,
            fontWeight: "bold",
            alignSelf: 'center',
            top: "-22%",
            left: "22%"
        },
        recentTransactionTitle: {
            fontSize: 20,
            fontWeight: "bold",
            alignSelf: 'center',
            top: "5%",
            left: "-16%"
        },
        overallBalanceTitle: {
            fontSize: 20,
            fontWeight: "bold",
            top: "5%",
            left: "5%",
        },
        overallBalanceCash: {
            fontSize: 16,
            fontWeight: "bold",
            top: "15%",
            left: "5%",
        },
        overallBalanceStocks: {
            fontSize: 16,
            fontWeight: "bold",
            top: "20%",
            left: "5%",
        },
        overallBalanceSafe: {
            fontSize: 16,
            fontWeight: "bold",
            top: "25%",
            left: "5%",
        },
        amountOverallBalanceCash: {
            fontSize: 16,
            fontWeight: "bold",
            top: "15%",
            left: "50%",
        },
        amountOverallBalanceStocks: {
            fontSize: 16,
            fontWeight: "bold",
            top: "20%",
            left: "50%",
        },
        amountOverallBalanceSafe: {
            fontSize: 16,
            fontWeight: "bold",
            top: "25%",
            left: "50%",
        },
        menuBar: {
            backgroundColor: "#7de24e",
            width: '100%',
            height: 55,
            flex: 0.15,
            justifyContent: "flex-end",
            flexDirection: "row"
        },
        dashboardText: {
            fontSize: 20,
            fontWeight: "bold",
            alignSelf: 'center',
            top: 20,
        },
        borderAccounts: {
            backgroundColor: 'white',
            width: 350,
            height: 120,
            borderRadius: 20,
            top: 40,
        },
        recentTransactions: {
            backgroundColor: 'white',
            width: 350,
            height: 170,
            borderRadius: 20,
            top: 65, 
        },
        overallBalance: {
            backgroundColor: 'white',
            width: 350,
            height: 170,
            position: 'relative',
            borderRadius: 20,
            top: 90,
        },
        homeButton: {
            width: 45,
            height: 45,
            position: 'absolute',
            top: "5%",
            right: "85%",
            borderRadius: 10,
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
        signOutButton: {
            position: 'absolute',
            left: 10,
            backgroundColor: '#7de24e',
            color: '#ffffff',
            borderColor: '#7de24e',
            height: 35,
            width: 35,
            borderRadius: 30,
            marginTop: 10,
          },
    }
);
