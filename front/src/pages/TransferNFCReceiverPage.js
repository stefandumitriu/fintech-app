import React, {Component} from 'react';
import { View, Text, StatusBar, Button, ActivityIndicator, Animated, Image, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';

export default class TransferNFCReceiverPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            email: null,
            isLoadingCredentials: true,
        }
      }

    async writeNdef({type, value}) {
        let result = false;
      
        try {
          // STEP 1
          await NfcManager.requestTechnology(NfcTech.Ndef);
      
          const bytes = Ndef.encodeMessage([Ndef.textRecord(value)]);
      
          if (bytes) {
            await NfcManager.ndefHandler // STEP 2
              .writeNdefMessage(bytes); // STEP 3
            result = true;
          }
          alert('Tag Written!');
          this.props.navigation.navigate('TransferPage');
        } catch (ex) {
          console.warn(ex);
        } finally {
          // STEP 4
          NfcManager.cancelTechnologyRequest();
        }
      
        return result;
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

    componentDidMount() {
        this.getUser();
    };

    render() {
        
        if (this.state.isLoadingCredentials == true) {
            return (
                <View>
                    <ActivityIndicator/>
                </View>
            )
        } else {
            return (
                <>
                    <StatusBar backgroundColor='#11CB76'></StatusBar>
                    <View style={[styles.wrapper]}>
                    <View style={{flex: 1}} />
                        <Animated.View style={styles.prompt}>
                            <View
                                style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Image
                                source={require('../assets/nfc-512.png')}
                                style={{width: 100, height: 100, padding: 20}}
                                resizeMode="contain"
                                />

                                <Text style= {{fontSize: 20, top: "10%", textAlign: 'center'}}>Please tap the NFC tag to write your e-mail address</Text>
                            </View>

                            <Button 
                            mode="contained" 
                            onPress={() => this.writeNdef({type: 'TEXT', value: this.state.email})} title="SCAN"
                            color="#11CB76">
                            </Button>
                        </Animated.View>
                    </View>            
                </>
            );
        }
    }
}

const styles = StyleSheet.create(
    {
        wrapper: {
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            alignItems: 'center',
        },
        prompt: {
            height: 300,
            alignSelf: 'stretch',
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 20,
            margin: 20,
            zIndex: 2,
        }
    }
);