import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
  } from 'react-native';
  
  import React, {Component} from 'react';
  import axios from 'axios';
  
  const baseUrl = 'http://3.70.21.159:8000';
  
  export default class StocksPortofolioPage extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
          base_currency: null,
          to_currency: null,
          amount: null,
          result: "Choose currency and amount",
      }
    }

    convert() {
        axios({
            method: "POST",
            url: "http://3.70.21.159:8000/exchange/",
            data: {
                base_currency: this.state.base_currency,
                to_currency: this.state.to_currency,
                amount: parseFloat(this.state.amount),
            },
            headers: {"Content-Type": "application/json"}
          }) .then((response) => {this.setState({result: response.data.result})})
          .catch(error => console.log(error))
    }
  
    render() {
        return (
            <>
                <View>
                    <Text style={styles.text}>EXCHANGE</Text>
                    <TextInput
                        style={styles.toCurrencyStyle}
                        placeholder="From Currency"
                        placeholderTextColor="#8b9cb5"
                        keyboardType="default"
                        underlineColorAndroid="#f000"
                        onChangeText = {text => this.setState({base_currency: text})}
                    />
                    <TextInput
                        style={styles.fromCurrencyStyle}
                        placeholder="To Currency"
                        placeholderTextColor="#8b9cb5"
                        keyboardType="default"
                        underlineColorAndroid="#f000"
                        onChangeText = {text => this.setState({to_currency: text})}
                    />
                    <TextInput
                        style={styles.amountStyle}
                        placeholder="Amount"
                        placeholderTextColor="#8b9cb5"
                        keyboardType="numeric"
                        returnKeyType="done"
                        underlineColorAndroid="#f000"
                        onChangeText = {text => this.setState({amount: text})}
                    />

                    <Text style = {{alignSelf:"center"}}>Result: </Text>
                    <Text style = {{alignSelf:"center"}}>{this.state.result}</Text>

                    <TouchableOpacity
                        style={styles.convertButton}
                        activeOpacity={0.5}
                        onPress={() => this.convert()}>
                        <Text style={styles.textButtonStyle}>Convert</Text>
                    </TouchableOpacity>

                </View>
            </>
        )
    }
  }
  
  const styles = StyleSheet.create({
    text: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#000000',
        top: '5%',
        textAlign: "center",
    },
    toCurrencyStyle: {
        height: 40,
        width: 150,
        textAlign: "center",
        top: "10%",
        marginTop: 30,
        borderWidth: 1,
        borderRadius: 20,
        left : "5%",
    },
    fromCurrencyStyle: {
        height: 40,
        width: 150,
        textAlign: "center",
        top: "-10%",
        marginTop: 30,
        borderWidth: 1,
        borderRadius: 20,
        left: "60%",
    },
    amountStyle: {
        height: 40,
        width: 200,
        textAlign: "center",
        borderWidth: 1,
        borderRadius: 20,
        alignSelf: 'center',
    },
    convertButton: {
        width: 200,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#24cc18',
        marginTop: 60,
        alignSelf: 'center',
    },
    textButtonStyle: {
        fontSize: 20,
        textAlign: "center",
        marginTop: 5,
    },
  });
  