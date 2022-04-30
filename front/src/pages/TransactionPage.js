import React, {Component} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';

// Tested to print transactions depending on an array
export default class TransactionPage extends React.Component {
    state = {
        counters: [1, 2, 3, 4, 5, 6]
      };
    
    list() {
        return this.state.counters.map( (number) => {
                return (
                    <View>
                        <AntDesignIcons name="arrowdown" size={40} style={{left: 4, top: 2}} color='#7de24e'></AntDesignIcons>
                        <AntDesignIcons name="arrowup" size={40} style={{left: 4, top: 2}} color='#7de24e'></AntDesignIcons>
                    </View>
                );
            }
        );
    }

    render() {
        return (
            <View>
                {this.list()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
})