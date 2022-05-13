import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Image, ActivityIndicator} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import OcticonsIcons from 'react-native-vector-icons/Octicons';
import FontistoIcons from 'react-native-vector-icons/Fontisto';
import FeatherIcons from 'react-native-vector-icons/Feather';
import FlagIcon from 'react-native-ico-flags';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = 'http://10.0.2.2:8000';
// const token = 'Token fbd34c2a78e48850fac59b15bc6cb01250033244';
// const email = 'laurentiu@gmail.com';
export default class PrincipalScreen extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isLoadingCA: true,
            currentAccount: null,
            recentTransactions: null,
            isLoadingRT: true,
            token: null,
            email: null,
            isLoadingCredentials: true,
        }
    }

    async getUser() {
        try {
          const savedUser = await AsyncStorage.getItem("loginInfo")
            .then(async (res) => {
                const val = await res;
                const currentUser = JSON.parse(val);
                this.setState({
                    token: currentUser.token,
                    email: currentUser.email,
                    isLoadingCredentials: false,
                });
            });       
        } catch (error) {
          console.log(error);
        }
      };

    async getCurrentAccount() {
        try {
            const url = `${baseUrl}/accounts/?user=${this.state.email}`

            const response = await axios.get(url, {headers: {Authorization: this.state.token, "Content-Type": "application/json"}})
            this.setState({
                currentAccount: response.data,
                isLoadingCA: false
            });
        } catch (error) {
            console.error(error);
        }
    }

    async getRecentTransactions() {
        try {
            const url = `${baseUrl}/transactions/?user=${this.state.email}`
            const response = await axios.get(url, {headers: {Authorization: this.state.token, "Content-Type": "application/json"}})
            this.setState({
                recentTransactions: response.data,
                isLoadingRT: false
            });
        } catch (error) {
            console.error(error);
        }
    }

    componentDidMount() {
        Promise.resolve(this.getUser())
            .then(() => {
                this.getCurrentAccount();
                this.getRecentTransactions();
            });
    }

    senderOrReceiver(i, top) {
        var toOrFrom ='';
        if (this.state.email === this.state.recentTransactions[i].sender) {
            toOrFrom = "To";
            return (
                <Text 
                    style = {{
                        fontSize: 15,
                        fontWeight: "bold",
                        alignSelf: 'center',
                        top: top,
                        left: "-5%"
                    }}
                >
                {toOrFrom}: {this.state.recentTransactions[i].receiver}
                </Text>
            )
        } else {
            toOrFrom = "From";
            return (
                <Text 
                    style = {{
                        fontSize: 15,
                        fontWeight: "bold",
                        alignSelf: 'center',
                        top: top,
                        left: "-5%"
                    }}
                >
                {toOrFrom}: {this.state.recentTransactions[i].sender}
                </Text>
            )
        }
        
    }

    setCurrency(currency) {
        if (currency === 'RON') {
            return 'RON';
        }
        else if (currency === 'EUR') {
            return '\u20AC';
        }
        else if (currency === 'USD') {
            return '\u0024';
        }
        else if (currency === 'GBP') {
            return '\u00A3';
        }
    }

    setFlag(currency) {
        if (currency === 'RON') {
            return 'romania';
        }
        else if (currency === 'EUR') {
            return "european-union";
        }
        else if (currency === 'USD') {
            return "united-states-of-america";
        }
        else if (currency === 'GBP') {
            return "england";
        }
    }

    recentTransactionsTile() {
        
        return (
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
                    {this.senderOrReceiver(0, "-100%")}
                    {this.senderOrReceiver(1, "-18%")}
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
                            {this.setCurrency(this.state.recentTransactions[0].currency)} {this.state.recentTransactions[0].amount}
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
                            {this.setCurrency(this.state.recentTransactions[1].currency)} {this.state.recentTransactions[1].amount}
                    </Text>
                </View>
                
            </View>
        );
    }
    render() {
        if (this.state.isLoadingCA == true || this.state.isLoadingRT == true || this.state.isLoadingCredentials == true) {
            return (
                <View>
                    <ActivityIndicator/>
                </View>
            )
        } else {
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
                                    <FlagIcon name={this.setFlag(this.state.currentAccount[0].currency)} height="60" width="60">
                                    </FlagIcon>
                                </View>

                                <Text style = {styles.amountText}>
                                    {this.setCurrency(this.state.currentAccount[0].currency)}{this.state.currentAccount[0].balance}
                                </Text>

                            </View> 

                            {/* Recent transactions. Press the white slide*/}
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('TransactionPage')}>
                                 {this.recentTransactionsTile()}
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
                                        {this.setCurrency(this.state.currentAccount[0].currency)}{this.state.currentAccount[0].balance}
                                        </Text>
                                    <Text style = {styles.amountOverallBalanceStocks}>
                                            hardcoded
                                        </Text>
                                    <Text style = {styles.amountOverallBalanceSafe}>
                                        hardcoded
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
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Stocks')}>
                                <FeatherIcons name="trending-up" size={40} style={{left: 5, top: 3}}></FeatherIcons>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.transferButton}>
                            <TouchableOpacity onPress={() => alert("Transfer button pressed!")}>
                                <FontistoIcons name="arrow-swap" size={35} style={{left: 5, top: 5}}></FontistoIcons>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.walletButton}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('WalletPage')}>
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