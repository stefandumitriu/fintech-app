import React, {Component} from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';

// Tested to print transactions depending on an array
export default class TransactionPage extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: null,
            counters: [1, 2, 3]
        }
    }

    componentDidMount() {

        return fetch('http://10.0.2.2:3000/recent_transactions')
            .then( (response) => response.json())
            .then( (responseJson) => {
                this.setState({
                    isLoading: false,
                    dataSource: responseJson,
                })
            })
            .catch((error) => {console.log(error)});
    }
    list() {
        return this.state.dataSource.map( (recentTransaction) => {
                var currency = '';
                if (recentTransaction.currency === 'RON')
                    currency = "RON";
                else if (recentTransaction.currency === 'EUR')
                    currency = '\u20AC';

                if (recentTransaction.this_sent === true) {
                    return (
                        <View key={recentTransaction.id}>
                            <AntDesignIcons name="arrowup" size={40} style={styles.arrows} color='#7de24e' />
                            <Text style={styles.userText}>
                                To: {recentTransaction.who}
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
                                From: {recentTransaction.who}
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
        if (this.state.isLoading) {
            return (
                <View>
                    <ActivityIndicator/>
                </View>
            )
        } else {
            return (
                <View>
                    {this.list()}
                </View>
                
            );
        }
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