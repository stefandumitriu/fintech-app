import axios from 'axios';
import React from 'react';
import { ScrollView, View, FlatList, StyleSheet, Text, StatusBar, Image, TouchableOpacity} from 'react-native';
import FlagIcon from 'react-native-ico-flags';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import OcticonsIcons from 'react-native-vector-icons/Octicons';
import FontistoIcons from 'react-native-vector-icons/Fontisto';
import FeatherIcons from 'react-native-vector-icons/Feather';

const baseUrl = 'http://10.0.2.2:8000';

const currency = (currency) => {
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

const flag = (currency) => {
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

export default class WalletPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        accounts: null,
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

  async getAccounts() {
    try {
      const url = `${baseUrl}/accounts/?user=${this.state.email}`
      const response = await axios.get(url, {headers: {Authorization: this.state.token, "Content-Type": "application/json"}})
            this.setState({
              accounts: response.data,
              isLoading: false
            });
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    Promise.resolve(this.getUser())
        .then(() => {
            this.getAccounts();
        });
}

  renderItem (account) {
    return (
      <View>
          <Image source={require('../assets/debit_card.png')} style={styles.debitCardImage}/>
          <View style={styles.detailsTile}>
              <Text style = {styles.detailsTitle}>
                  Card Details
              </Text>
              <Text style = {styles.detailsContent}>
                IBAN: {account.item.iban}
              </Text>
              <Text style = {styles.detailsContent}>
                Type: {account.item.acc_type}
              </Text>
              <Text style = {styles.detailsContent}>
                Card expiration date: {account.item.card_expiration_date}
              </Text>
              <Text style = {styles.detailsContent}>
                Currency: {account.item.currency}
              </Text>
          </View>
          <View style={styles.detailsTile}>
              <Text style = {styles.detailsTitle}>
                  Balance
              </Text>
              <View style={styles.flagStyle}>
                  <FlagIcon name={flag(account.item.currency)} height="60" width="60">
                  </FlagIcon>
              </View>
              <Text style = {styles.amountText}>
                  {currency(account.item.currency)}{account.item.balance}
              </Text>
          </View>
          
      </View>
    );
  }

  render() {
    return (
      <>
        <ScrollView style={styles.container}>
          <FlatList
            data={this.state.accounts}
            renderItem={this.renderItem}
            keyExtractor={account => account.iban}
            horizontal
          />
        </ScrollView>
        <View style={styles.menuBar}>
          <View style={styles.homeButton}>
                  <TouchableOpacity onPress={() => alert("Home button pressed!")}>
                      <FontAwesomeIcon name="home" size={40} style={{left: 0, top: 2}}></FontAwesomeIcon>
                  </TouchableOpacity>
          </View>

          <View style={styles.stocksButton}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Stocks')}>
                  <FeatherIcons name="trending-up" size={40} style={{left: 5, top: 3}}></FeatherIcons>
              </TouchableOpacity>
          </View>

          <View style={styles.transferButton}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Transfer')}>
                  <FontistoIcons name="arrow-swap" size={35} style={{left: 5, top: 5}}></FontistoIcons>
              </TouchableOpacity>
          </View>

          <View style={styles.walletButton}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('WalletPage')}>
                  <FontistoIcons name="wallet" size={35} style={{left: 5, top: 5}}></FontistoIcons>
              </TouchableOpacity>
          </View>

          <View style={styles.spendingAnalysisButton}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('SpendingAnalysisPage')}>
                  <OcticonsIcons name="graph" size={40} style={{left: 5, top: 2}}></OcticonsIcons>
              </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  homeButton: {
      width: 45,
      height: 45,
      position: 'absolute',
      top: "5%",
      right: "85%",
      borderRadius: 10,
  },
  menuBar: {
      backgroundColor: "#7de24e",
      width: '100%',
      height: 55,
      flex: 0.08,
      justifyContent: "flex-end",
      flexDirection: "row"
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
  debitCardImage: {
    width: 270, 
    height: 170, 
    marginHorizontal: 50,
    alignSelf: 'center',
  },
  detailsTile: {
      backgroundColor: 'white',
      width: 300,
      height: 150,
      borderRadius: 20,
      marginHorizontal: 50,
      marginBottom: 40,
      marginTop: 30,
      alignSelf: 'center',
  },
  detailsTitle: {
      fontSize: 20,
      fontWeight: "bold",
      top: "5%",
      left: "5%",
  },
  detailsContent: {
    fontSize: 15,
    fontWeight: "bold",
    top: "10%",
    left: "5%",
    position: 'relative'
  },
  flagStyle: {
    borderRadius: 30,
    position: 'relative',
    top: "20%",
    left: "15%"
  },
  amountText: {
      fontSize: 25,
      fontWeight: "bold",
      alignSelf: 'center',
      top: "-15%",
      left: "22%"
  },
});