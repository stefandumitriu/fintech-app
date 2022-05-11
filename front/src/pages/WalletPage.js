import React from 'react';
import { ScrollView, View, FlatList, StyleSheet, Text, StatusBar, Image } from 'react-native';

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

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const WalletPage = () => {
  const renderItem = ({ item }) => (
    <View>
        <Image source={require('../assets/debit_card.png')} style={styles.debitCardImage}/>
        <View style={styles.detailsTile}>
            <Text style = {styles.detailsTitle}>
                Card Details
            </Text>
        </View>
        <View style={styles.detailsTile}>
            <Text style = {styles.detailsTitle}>
                Balance
            </Text>
        </View>
    </View>
    
  );

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
      />
    </ScrollView>
  );
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
  }
});

export default WalletPage;