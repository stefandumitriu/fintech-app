import {
    StyleSheet,
    TextInput,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    FlatList,
} from 'react-native';

import { Entypo as Icon } from '@expo/vector-icons';
import React, {Component, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = 'http://3.70.21.159:8000';

const StocksSearchPage = ({navigation}) => {

    const [state, setState] = useState({
        stocks: [],
    });

    const getStocks = (text) => {
        axios({
            method: "GET",
            url: `${baseUrl}/stocks/search/?q=${text}`
        })
        .then(response => {
            setState(prev => ({
                ...prev,
                stocks: response.data,
            }))
        }, (error) => {
            console.log(error)
        });
    };

    const storeStock = async (value) => {
        try {
          await AsyncStorage.setItem("stockName", JSON.stringify(value));
        } catch (error) {
          console.log(error);
        }
      };

    return(
        <View style={styles.container}>
            <View style={styles.search}>
                <Icon name={'magnifying-glass'} padding={10} color='#000000' size={16}/>
                <TextInput
                style={styles.inputStyle}
                placeholder="Enter a company name"
                placeholderTextColor='#000000'
                onChangeText={(text) => getStocks(text)}
                />
            </View>

            <FlatList
                data={state.stocks}
                keyExtractor={item=>item.fields.symbol}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => {storeStock(item.fields.symbol); navigation.navigate('StocksDetailsPage')}}>
                        <Text style={styles.stockSymbol}>{item.fields.symbol}</Text>
                        <Text style={styles.stockName}>{item.fields.name}</Text>
                        <View style={styles.divider}/>
                    </TouchableOpacity>
                )}
            />

            {/*menuBar*/}
            <StatusBar backgroundColor='#11CB76'></StatusBar>
            <View style={styles.menuBar}>
                <View style={styles.stocksButton}>
                    <TouchableOpacity onPress={() => navigation.navigate('StocksPortofolioPage')}>
                        <Icon name={'line-graph'} size={40} style={{left: 3, top: 2}}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchButton}>
                    <TouchableOpacity onPress={() => navigation.navigate('StocksSearchPage')}>
                           <Icon name={'magnifying-glass'} size={40} style={{left: 3, top: 2}}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
export default StocksSearchPage;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text:{
        fontSize: 17,
        fontWeight: 'bold',
        color: '#000000',
    },
    search: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 20,
        marginTop: 20,
        margin: 10,
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
    },
    searchButton: {
        width: 45,
        height: 45,
        position: 'absolute',
        top: "5%",
        right: "20%",
    },
    divider: {
        marginTop: 10,
        borderBottomColor: '#2f2f2f',
        borderBottomWidth: 1,
    },
    stockSymbol: {
        paddingHorizontal: 10,
        paddingTop: 10,
        color: '#000000',
        fontSize: 20,
    },
    stockName: {
        paddingHorizontal: 10,
        color: '#000000',
        fontSize: 10,
    },
});