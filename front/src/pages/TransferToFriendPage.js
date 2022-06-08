import axios from 'axios';
import React, {Component} from 'react';
import { View, StyleSheet, Text, StatusBar, Button, TextInput, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = 'http://3.70.21.159:8000';
export default class TransferPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: 'USD',
            receiver: 'dummyText',
            amount: '0',
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

    componentDidMount() {
        this.getUser();
    }

      doTransfer() {
        axios({
            method: "POST",
            url: "http://3.70.21.159:8000/transactions/",
            data: {
                amount: this.state.amount,
                currency: this.state.currency,
                sender: this.state.email,
                receiver: this.state.receiver
            },
            headers: {Authorization: this.state.token, "Content-Type": "application/json"}
          }).then(response => console.log(response.data), alert("Transfer Done!"))
          .catch(error => console.log(error))
      }

      render() {
        if (this.state.isLoadingCredentials == true) {
            return (
                <View>
                    <ActivityIndicator/>
                </View>
            )
        } else {
            return (
                <>
                    <StatusBar backgroundColor='#11CB76'></StatusBar>
                    <View style={styles.container}>
                        <Text style={{fontSize: 35, fontWeight: "bold", alignSelf: 'center', top: "7%"}}>
                                        Transfer to Friend
                        </Text>
                        <View style = {styles.borderAccounts}>
                            <TextInput 
                                style={styles.receiverText} 
                                placeholder='Mail of receiver'
                                onChangeText={newText => this.setState({receiver: newText})}
                            />
                        </View>

                        <View style = {styles.recentTransactions}>
                            <TextInput 
                                style={styles.receiverText} 
                                placeholder='Amount'
                                onChangeText={newText => this.setState({amount: newText})}
                            />
                        </View>
                        <View style={styles.currencyTile}>
                            <Picker 
                                style={{top: "-15%", left: "2%"}} 
                                onValueChange={(itemValue) => this.setState({currency: itemValue})}
                                selectedValue={this.state.currency}
                            >
                                <Picker.Item label="USD" value="USD" />
                                <Picker.Item label="EUR" value="EUR" />
                                <Picker.Item label="RON" value="RON" />
                                <Picker.Item label="GBP" value="GBP" />
                            </Picker>
                        </View>

                        <View style={{top: "40%"}}>
                            <Button
                            onPress={() => this.doTransfer()}
                            title="Confirm Transfer"
                            color="#11CB76"
                            />
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
        currencyTile: {
            backgroundColor: 'white',
            width: 350,
            height: 40,
            borderRadius: 20,
            top: 150,
        },
        receiverText: {
            fontSize: 20, 
            fontWeight: "bold",
            alignItems: "center",
            top: "10%",
            left: "2%"
        },
        borderAccounts: {
            backgroundColor: 'white',
            width: 350,
            height: 40,
            borderRadius: 20,
            top: 100,
        },
        recentTransactions: {
            backgroundColor: 'white',
            width: 350,
            height: 40,
            borderRadius: 20,
            top: 125, 
        }
    }
);