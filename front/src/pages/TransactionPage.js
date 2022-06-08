import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = 'http://3.70.21.159:8000';
// Tested to print transactions depending on an array
export default class TransactionPage extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            recentTransactions: null,
            isLoading: true,
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

    async getRecentTransactions() {
        try {
            const url = `${baseUrl}/transactions/?user=${this.state.email}`
            const response = await axios.get(url, {headers: {Authorization: this.state.token, "Content-Type": "application/json"}})
            this.setState({
                recentTransactions: response.data
            });
        } catch (error) {
            console.error(error);
        }
    }

    componentDidMount() {
        Promise.resolve(this.getUser())
            .then(() => {
                this.getRecentTransactions();
            });
    }

    list() {
        return this.state.recentTransactions && this.state.recentTransactions.map( (recentTransaction) => {
                var currency = '';
                if (recentTransaction.currency === 'RON')
                    currency = "RON";
                else if (recentTransaction.currency === 'EUR')
                    currency = '\u20AC';
                else if (recentTransaction.currency === 'USD')
                    currency = '\u0024';
                else if (recentTransaction.currency === 'GBP')
                    currency = '\u00A3';

                if (recentTransaction.sender === this.state.email) {
                    return (
                        <View key={recentTransaction.id}>
                            <AntDesignIcons name="arrowup" size={40} style={styles.arrows} color='#7de24e' />
                            <Text style={styles.userText}>
                                To: {recentTransaction.receiver}{"\n"}
                                {recentTransaction.timestamp}
                            </Text>
                            <Text style={styles.amount}>
                                - {currency} {recentTransaction.amount}
                            </Text>
                        </View>
                    );
                } else {
                    return (
                        <View key={recentTransaction.id}>
                            <AntDesignIcons name="arrowdown" size={40} style={styles.arrows} color='#7de24e' />
                            <Text style={styles.userText}>
                                From: {recentTransaction.sender}{"\n"}
                                {recentTransaction.timestamp}
                            </Text>
                            <Text style={styles.amount}>
                                {currency} {recentTransaction.amount}
                            </Text>
                        </View>
                    );
                }
            }
        );
    }

    render() {
        return (
            <ScrollView>
                {this.list()}
            </ScrollView>
            
        );
    }
}

const styles = StyleSheet.create({
    arrows: {
        left: "2%",
        top: "30%"
    },
    userText: {
        fontSize: 15,
        fontWeight: "bold",
        top: "-2%",
        left: "20%"
    },
    amount: {
        fontSize: 15,
        fontWeight: "bold",
        top: "-26%",
        left: "75%"
    }
})