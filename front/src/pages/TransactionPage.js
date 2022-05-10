import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

const baseUrl = 'http://10.0.2.2:8000';
const token = 'Token fbd34c2a78e48850fac59b15bc6cb01250033244';
const email = 'laurentiu@gmail.com';
// Tested to print transactions depending on an array
export default class TransactionPage extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            recentTransactions: null,
            isLoading: true,
        }
    }

    async getRecentTransactions() {
        try {
            const url = `${baseUrl}/transactions/?user=${email}`
            const response = await axios.get(url, {headers: {Authorization: token, "Content-Type": "application/json"}})
            this.setState({
                recentTransactions: response.data
            });
        } catch (error) {
            console.error(error);
        }
    }

    componentDidMount() {
        this.getRecentTransactions();
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

                if (recentTransaction.sender === email) {
                    return (
                        <View key={recentTransaction.id}>
                            <AntDesignIcons name="arrowup" size={40} style={styles.arrows} color='#7de24e' />
                            <Text style={styles.userText}>
                                To: {recentTransaction.receiver}
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
                                From: {recentTransaction.sender}
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
        alignSelf: 'center',
        top: "-2%",
        left: "-5%"
    },
    amount: {
        fontSize: 15,
        fontWeight: "bold",
        alignSelf: 'center',
        top: "-26%",
        left: "35%"
    }
})