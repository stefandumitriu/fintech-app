import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import { Entypo as Icon } from '@expo/vector-icons';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const baseUrl = 'http://3.70.21.159:8000';

export default class StocksPortofolioPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        accounts: null,
        token: null,
        email: null,
        stocks:[],
        isLoadingCredentials: true,
        isLoadingStocks: true,
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

  async getStockAccountDetails() {
    try {
        const url = `${baseUrl}/stocks/account/?user=${this.state.email}`
        const response = await axios.get(url, {headers: {Authorization: this.state.token, "Content-Type": "application/json"}})
        this.setState({
            stocks: response.data,
            isLoadingStocks: false
        });
    } catch (error) {
        console.error(error);
    }
  }

  componentDidMount() {
    Promise.resolve(this.getUser())
      .then(() => {
        this.getStockAccountDetails();
      });
  }

  returnOutput() {
    var totalValue = 0;
    for(var i = 0; i < this.state.stocks.length; i++) {
        totalValue += this.state.stocks[i].total_value;
    }
    return (
      <>
        {/*Portofolio Value*/}
        <View>
          <Text style={styles.text}>PORTOFOLIO</Text>
          <Text style={styles.portofolioValue}>$ {totalValue.toFixed(2)}</Text>
        </View>

        {/*Stock WatchList*/}
        <Text style={styles.text}>STOCKS</Text>
        <FlatList
              data={this.state.stocks}
              keyExtractor={item=>item.stock}
              renderItem={({item}) => (
                  <View>
                      <View style = {styles.stockExample}>
                        <Text style={styles.stockName}>{item.stock}</Text>
                        <Text style={styles.stockQuantity}>x{item.quantity.toFixed(6)}</Text>
                        <Text style={styles.stockValue}>$ {item.total_value.toFixed(2)}</Text>
                      </View>
                  </View>
              )}
          />

        {/*StatusBar*/}
        <StatusBar backgroundColor='#11CB76'></StatusBar>
        <View style={styles.menuBar}>
          <View style={styles.stocksButton}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('StocksPortofolioPage')}>
              <Icon name={'line-graph'} size={40} style={{left: 3, top: 2}}/>
            </TouchableOpacity>
          </View>

          <View style={styles.searchButton}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('StocksSearchPage')}>
              <Icon name={'magnifying-glass'} size={40} style={{left: 3, top: 2}}/>
            </TouchableOpacity>
          </View>
        </View>
      </>
    )
  }

  render() {
    if (this.state.isLoadingStocks == true || this.state.isLoadingCredentials == true) {
      return (
          <View>
              <ActivityIndicator/>
          </View>
      )
    } else {
      return (
        <>
          {this.returnOutput()}
        </>
      )
    }
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#9e9e9e',
    top: '5%',
    left: '5%'
  },
  portofolioValue: {
    fontSize: 20,
    color: '#000000',
    top: '5%',
    left: '5%'
  },
  stockExample: {
    backgroundColor: '#cfcfcf',
    width: 350,
    height: 70,
    alignSelf: 'center',
    borderRadius: 20,
    top: 20,
    marginTop: 15,
    marginBottom: 20
  },
  stockName: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: 'center',
    top: "10%",
    right: "15%"
  },
  stockQuantity: {
    fontSize: 15,
    color: '#000000',
    top: "10%",
    right: "15%",
    alignSelf: 'center',
  },
  stockValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: '#000000',
    bottom: '40%',
    left: '30%',
    alignSelf: 'center',
  },
  menuBar: {
    backgroundColor: "#11CB76",
    width: '100%',
    height: 50,
    bottom: "0%",
    flexDirection: "row"
  },
  stocksButton: {
    width: 45,
    height: 45,
    position: 'absolute',
    top: "5%",
    right: "70%",
    borderRadius: 10,
  },
  searchButton: {
    width: 45,
    height: 45,
    position: 'absolute',
    top: "5%",
    right: "20%",
    borderRadius: 10,
  },
});
