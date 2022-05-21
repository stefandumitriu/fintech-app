import axios from 'axios';
import React, {Component} from 'react';
import { View, StyleSheet, Text, StatusBar, Button, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LineChart} from "react-native-chart-kit";

const baseUrl = 'http://10.0.2.2:8000';
export default class SpendingAnalysisPage extends Component {
    calledOnce = false;
    data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    constructor(props) {
        super(props);
        this.state = {
            recentTransactions: null,
            isLoading: true,
            token: null,
            email: null,
            isLoadingCredentials: true,
            graphTransactions: [],
            graphTransactionsLength: 0,
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
                recentTransactions: response.data
            });
        } catch (error) {
            console.error(error);
        }
    }

    getTransactionsByDate(fromDate = '01-01-1970', toDate = '31-12-2076') {
        const url = `${baseUrl}/transactions/?user=${this.state.email}&from=${fromDate}&to=${toDate}`
        const response = axios.get(url, {headers: {Authorization: this.state.token, "Content-Type": "application/json"}})
            .then((response) => this.setState({
                graphTransactions: response.data,
                graphTransactionsLength: response.data.length
            })).then(() => {
                console.log(this.state.graphTransactions);
                console.log(this.state.graphTransactionsLength);
                for (var i = 0; i < this.state.graphTransactionsLength; i++) {
                    var index = parseInt(this.state.graphTransactions[i].timestamp.substring(0, 2));
                    console.log(index);
                    this.data[index] = this.state.graphTransactions[i].amount;
                }
            }).
            catch((error) => console.log(error))
    }

    componentDidMount() {
        Promise.resolve(this.getUser())
            .then(() => {
                this.getRecentTransactions();
            });
    }

    computeGraphMonthly(month) {
        if (this.calledOnce == false && this.state.isLoadingCredentials == false) {
            this.getTransactionsByDate('19-05-2022', '22-05-2022');
            this.calledOnce = true;
        }
        if (this.calledOnce == true) {
            return(
                <>
                    <Text>Bezier Line Chart</Text>
                    <LineChart
                        data={{
                        labels: ["1 ", "5 ", "10 ", "15 ", "20 ", "25 ", "30"],
                        datasets: [
                            {
                            data: this.data
                            }
                        ]
                        }}
                        segments={10}
                        width={Dimensions.get("window").width} // from react-native
                        height={420}
                        yAxisLabel="$"
                        yAxisSuffix="k"
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                            backgroundColor: "#e26a00",
                            backgroundGradientFrom: "#fb8c00",
                            backgroundGradientTo: "#ffa726",
                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "1",
                                stroke: "#ffa726"
                            }
                        }}
                    />
                </>
            );
        }
    }

    render() {
        return (
            <View>
                {this.computeGraphMonthly()}
            </View>
        );
    }
}