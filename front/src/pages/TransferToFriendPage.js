import axios from 'axios';
import React, {Component} from 'react';
import { TouchableOpacity, View, StyleSheet, Text, StatusBar, Image } from 'react-native';

export default class TransferPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
      }
    render() {
        return (
            <View>
                <Text>MERGE!</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create(
    {
        container: {
            backgroundColor: '#f0efed',
            flex: 2,
            alignItems: "center",
        },
        borderAccounts: {
            backgroundColor: 'white',
            width: 350,
            height: 80,
            borderRadius: 20,
            top: 100,
        },
        recentTransactions: {
            backgroundColor: 'white',
            width: 350,
            height: 80,
            borderRadius: 20,
            top: 125, 
        },
        signOutButton: {
            position: 'absolute',
            left: 10,
            backgroundColor: '#7de24e',
            color: '#ffffff',
            borderColor: '#7de24e',
            height: 35,
            width: 35,
            borderRadius: 30,
            marginTop: 10,
          },
    }
);