import axios from 'axios';
import React, {Component} from 'react';
import { View, StyleSheet, Text, StatusBar, ScrollView, FlatList, ActivityIndicator, Dimensions } from 'react-native';
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
                for (var i = 0; i < this.state.graphTransactionsLength; i++) {
                    var index = parseInt(this.state.graphTransactions[i].timestamp.substring(0, 2));
                    if (this.state.graphTransactions[i].sender === this.state.email)
                        this.data[index] += parseInt(this.state.graphTransactions[i].amount);
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
            this.getTransactionsByDate(`1-${month}-2022`, `30-${month}-2022`);
            this.calledOnce = true;
        }
        if (this.calledOnce == true) {
            return(
                <>
                    <Text>Spending Analysis for month {month}</Text>
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
            <ScrollView>
                {this.computeGraphMonthly('05')}
                {this.computeGraphMonthly('07')}
            </ScrollView>
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