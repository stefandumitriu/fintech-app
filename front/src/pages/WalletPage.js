import axios from 'axios';
import React from 'react';
import { ScrollView, View, FlatList, StyleSheet, Text, StatusBar, Image } from 'react-native';
import FlagIcon from 'react-native-ico-flags';

const baseUrl = 'http://10.0.2.2:8000';
const token = 'Token fbd34c2a78e48850fac59b15bc6cb01250033244';
const email = 'laurentiu@gmail.com';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d77',
    title: 'Fourth Item',
  },
];

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
    }
  }

  async getAccounts() {
    try {
      const url = `${baseUrl}/accounts/`
      const response = await axios.get(url, {headers: {Authorization: token, "Content-Type": "application/json"}})
            this.setState({
              accounts: response.data,
              isLoading: false
            });
      console.log(this.state.accounts);
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    this.getAccounts();
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
                Card expiration date: 
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
      <ScrollView style={styles.container}>
        <FlatList
          data={this.state.accounts}
          renderItem={this.renderItem}
          keyExtractor={account => account.iban}
          horizontal
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
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