import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
} from 'react-native';
  
import React, {Component, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
  
const baseUrl = 'http://3.70.21.159:8000';

export default class StocksDetailsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        token: null,
        stockName: null,
        stockInfo: [],
        quantity: 0.0,
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
                isLoadingCredentials: false,
            });
        });       
    } catch (error) {
      console.log(error);
    }
  };

  async getStock() {
    try {
      const savedName = await AsyncStorage.getItem("stockName")
        .then(async (res) => {
            const val = await res;
            const savedStock = JSON.parse(val);
            this.setState({
              stockName: savedStock,
          });
        });       
    } catch (error) {
      console.log(error);
    }
  };

  async getStocksDetails() {
    try {
        const url = `${baseUrl}/stocks/${this.state.stockName}`
        const response = await axios.get(url, {headers: {"Content-Type": "application/json"}})
        this.setState({
            stockInfo: response.data,
        });
    } catch (error) {
        console.error(error);
    }
  }

  buyStocks() {
    axios({
        method: "POST",
        url: "http://3.70.21.159:8000/stocks/account/",
        data: {
            symbol: this.state.stockInfo.symbol,
            quantity: parseFloat(this.state.quantity),
            operation: "buy",
        },
        headers: {Authorization: this.state.token, "Content-Type": "application/json"}
      }) .then(alert("Successfully bought " + this.state.quantity + " shares of " + this.state.stockInfo.name))
      .catch(error => console.log(error))
  }

  sellStocks() {
    axios({
        method: "POST",
        url: "http://3.70.21.159:8000/stocks/account/",
        data: {
            symbol: this.state.stockInfo.symbol,
            quantity: parseFloat(this.state.quantity),
            operation: "sell",
        },
        headers: {Authorization: this.state.token, "Content-Type": "application/json"}
      }) .then(alert("Successfully sold " + this.state.quantity + " shares of " + this.state.stockInfo.name))
      .catch(error => console.log(error))
  }

  componentDidMount() {
    this.getUser();
    Promise.resolve(this.getStock())
        .then(() => {
            this.getStocksDetails();
        });
  }

  render() {
    return (
      <>
        <View>
          <Text style={styles.stockBase}>Name</Text>
          <Text style={styles.stockName}>{this.state.stockInfo.name}</Text>
          <View style={styles.divider}/>
          <Text style={styles.stockBase}>Exchange</Text>
          <Text style={styles.stockName}>{this.state.stockInfo.symbol} - {this.state.stockInfo.exchange_name}</Text>
          <View style={styles.divider}/>
          <Text style={styles.stockBase}>Market Price</Text>
          <Text style={styles.stockName}>$ {this.state.stockInfo.market_price}</Text>
          <View style={styles.divider}/>
          <Text style={styles.stockBase}>Market Change</Text>
          <Text style={[styles.stockChange, this.state.stockInfo.market_change > 0 ? styles.stockPos : styles.stockNeg]}>
            $ {this.state.stockInfo.market_change} ({this.state.stockInfo.market_change_percent}%)
          </Text>
          <View style={styles.divider}/>
          <Text style={styles.stockBase}>Market Cap</Text>
          <Text style={styles.stockName}>$ {this.state.stockInfo.market_cap}</Text>

          <TextInput
            style={styles.inputStyle}
            placeholder="Enter the amount of shares to buy/sell"
            placeholderTextColor="#8b9cb5"
            keyboardType="numeric"
            returnKeyType="done"
            underlineColorAndroid="#f000"
            onChangeText = {text => this.setState({quantity: text})}
          />

          <TouchableOpacity
            style={styles.stockBuyButton}
            activeOpacity={0.5}
            onPress={() => this.buyStocks()}>
            <Text style={styles.textButtonStyle}>Buy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.stockSellButton}
            activeOpacity={0.5}
            onPress={() => this.sellStocks()}>
            <Text style={styles.textButtonStyle}>Sell</Text>
          </TouchableOpacity>

        </View>
      </>
    )
  }
};

const styles = StyleSheet.create({
  inputStyle: {
    height: 40,
    width: 300,
    top: "5%",
    paddingLeft: 15,
    borderWidth: 1,
    borderRadius: 30,
    alignSelf: 'center',
  },
  stockBase: {
    fontSize: 22,
    color: '#000000',
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  stockName: {
    paddingHorizontal: 10,
    color: '#000000',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'right',
    alignSelf: 'flex-start',
  },
  stockChange: {
    paddingHorizontal: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },
  stockPos: {
    color: '#24cc18'
  },
  stockNeg: {
    color: '#ed2618'
  },
  divider: {
    marginTop: 10,
    borderBottomColor: '#2f2f2f',
    borderBottomWidth: 1,
  },
  stockBuyButton: {
    width: 100,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#24cc18',
    top: "13%",
    left: "15%",
  },
  stockSellButton: {
    width: 100,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#ed2618',
    top: "6%",
    left: "60%",
  },
  textButtonStyle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
  