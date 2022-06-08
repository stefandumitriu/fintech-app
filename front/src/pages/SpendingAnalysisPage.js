import axios from 'axios';
import React, {Component} from 'react';
import { View, StyleSheet, Text, StatusBar, ScrollView, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LineChart} from "react-native-chart-kit";
import { Picker } from '@react-native-picker/picker';

const baseUrl = 'http://3.70.21.159:8000';
export default class SpendingAnalysisPage extends Component {
    calledOnce = false;
    constructor(props) {
        super(props);
        this.state = {
            recentTransactions: null,
            isLoading: true,
            token: null,
            email: null,
            isLoadingCredentials: true,
            month: '01',
            totalSpent: 0,
            totalReceived: 0,
            currency: 'EUR',
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

    async getRecentTransactions() {
        try {
            const url = `${baseUrl}/transactions/?user=${this.state.email}`
            const response = await axios.get(url, {headers: {Authorization: this.state.token, "Content-Type": "application/json"}})
            this.setState({
                recentTransactions: response.data,
                isLoading: false
            });
        } catch (error) {
            console.error(error);
        }
    }

    componentDidMount() {
        Promise.resolve(this.getUser())
            .then(() => {
                this.getRecentTransactions();
            });
    }

    monthToString(month) {
        if (month === '01')
            return 'January';
        if (month === '02')
            return 'February';
        if (month === '03')
            return 'March';
        if (month === '04')
            return 'April';
        if (month === '05')
            return 'May';
        if (month === '06')
            return 'June';
        if (month === '07')
            return 'July';
        if (month === '08')
            return 'August';
        if (month === '09')
            return 'September';
        if (month === '10')
            return 'October';
        if (month === '11')
            return 'November';
        if (month === '12')
            return 'December';
            
    }

    setCurrency(currency) {
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

    computeGraphMonthly(month) {
        var totalReceived = 0;
        var totalSpent = 0;
        var data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < this.state.recentTransactions.length; i++) {
            if (this.state.recentTransactions[i].timestamp.substring(3, 5) === month &&
                this.state.recentTransactions[i].currency == this.state.currency) {
                var index = parseInt(this.state.recentTransactions[i].timestamp.substring(0, 2));
                if (this.state.recentTransactions[i].sender === this.state.email) {
                    data[index] += parseInt(this.state.recentTransactions[i].amount);
                    totalSpent += parseInt(this.state.recentTransactions[i].amount);
                } else {
                    totalReceived += parseInt(this.state.recentTransactions[i].amount)
                }
            }
        }
        return(
            <View style = {{top: "5%"}}>
                <Text style = {{fontSize: 20, alignSelf: 'center', fontWeight: 'bold'}}>Spending Analysis for {this.monthToString(month)}</Text>
                <LineChart
                    style={{top: "5%", borderRadius: 20}}
                    data={{
                    labels: ["1 ", "5 ", "10 ", "15 ", "20 ", "25 ", "30"],
                    datasets: [
                        {
                        data: data
                        }
                    ]
                    }}
                    segments={10}
                    width={Dimensions.get("window").width} // from react-native
                    height={320}
                    yAxisLabel="$"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: "#7de24e",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "4",
                            strokeWidth: "1",
                            stroke: "#ffa726"
                        }
                    }}
                />
                <Text style={{fontSize: 18, alignSelf: 'center', fontWeight: 'bold', top: "-4%"}}>Expenses</Text>
                <View style = {styles.picker}>
                    <Picker 
                        style={{top: "-3%", left: "2%"}} 
                        onValueChange={(itemValue) => this.setState({month: itemValue})}
                        selectedValue={this.state.month}
                    >
                        <Picker.Item label="January" value="01" />
                        <Picker.Item label="February" value="02" />
                        <Picker.Item label="March" value="03" />
                        <Picker.Item label="April" value="04" />
                        <Picker.Item label="May" value="05" />
                        <Picker.Item label="June" value="06" />
                        <Picker.Item label="July" value="07" />
                        <Picker.Item label="August" value="08" />
                        <Picker.Item label="September" value="09" />
                        <Picker.Item label="October" value="10" />
                        <Picker.Item label="November" value="11" />
                        <Picker.Item label="December" value="12" />
                    </Picker>
                    <Picker 
                        style={{top: "-15%", left: "2%"}} 
                        onValueChange={(itemValue) => this.setState({currency: itemValue})}
                        selectedValue={this.state.currency}
                    >
                        <Picker.Item label="USD" value="USD" />
                        <Picker.Item label="EUR" value="EUR" />
                        <Picker.Item label="RON" value="RON" />
                        <Picker.Item label="GBP" value="GBP" />
                    </Picker>
                </View>
                <View style={styles.overall}>
                    <Text style={{fontSize: 16, left: "5%", top: "10%"}}>
                        Total spent this month: {this.setCurrency(this.state.currency)} {totalSpent}
                    </Text>
                    <Text style={{fontSize: 16, left: "5%", top: "20%"}}>
                        Total received this month: {this.setCurrency(this.state.currency)} {totalReceived}
                    </Text>
                    <Text style={{fontSize: 16, left: "5%", top: "30%"}}>
                        Overall this month: {this.setCurrency(this.state.currency)} {totalReceived - totalSpent}
                    </Text>
                </View>
            </View>
        );
    }

    render() {
        if (this.state.isLoading == true || this.state.isLoadingCredentials == true) {
            return (
                <View>
                    <ActivityIndicator/>
                </View>
            )
        } else {
            return (
                
                <View style={styles.container}>
                    {this.computeGraphMonthly(this.state.month)}

                </View>
            );
        }
    }   
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0efed',
        flex: 2,
    },
    picker: {
        backgroundColor: 'white',
        width: 350,
        height: 90,
        position: 'absolute',
        borderRadius: 20,
        top: "105%",
        left: "8%"
    },
    overall: {
        backgroundColor: 'white',
        width: 350,
        height: 110,
        position: 'absolute',
        borderRadius: 20,
        top: "135%",
        left: "8%"
    },
  });