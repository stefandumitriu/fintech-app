import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
  
import React, {Component, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
  
const baseUrl = 'http://3.70.21.159:8000';

export default class StocksDetailsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        stockName: null,
        stockInfo: [],
    }
}

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

  componentDidMount() {
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
        </View>
      </>
    )
  }
};

const styles = StyleSheet.create({
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
});
  