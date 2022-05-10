import React, {Component} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Image, ActivityIndicator} from 'react-native';
import CardSilder from 'react-native-cards-slider';

export default class WalletPage extends Component {
    state = {  }
    render(){
        return(
        <View>
            <Text>
                plm
            </Text>
            <CardSilder>
                <Image style={{height: 170}} source={{url : 'https://picsum.photos/200'}} />
                <Image style={{height: 170}} source={{url : 'https://picsum.photos/200'}} />
                <Image style={{height: 170}} source={{url : 'https://picsum.photos/200'}} />
                <Image style={{height: 170}} source={{url : 'https://picsum.photos/200'}} />
            </CardSilder>
        </View>
          
        )
      }
}
