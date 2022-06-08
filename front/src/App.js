import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SplashScreen from './pages/SplashScreen';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import PrincipalScreen from './pages/PrincipalScreen';
import TransactionPage from './pages/TransactionPage';
import StocksPortofolioPage from './pages/StocksPortofolioPage';
import StocksDetailsPage from './pages/StocksDetailsPage';
import StocksSearchPage from './pages/StocksSearchPage';
import WalletPage from './pages/WalletPage';
import TransferPage from './pages/TransferPage';
import TransferToFriendPage from './pages/TransferToFriendPage';
import SpendingAnalysisPage from './pages/SpendingAnalysisPage';
import TransferNFCSenderPage from './pages/TransferNFCSenderPage';
import TransferNFCReceiverPage from './pages/TransferNFCReceiverPage';
import TransferNFCMenu from './pages/TransferNFCMenu';
import ExchangePage from './pages/ExchangePage';

const Stack = createStackNavigator();

const Auth = () => {
  return (
    <Stack.Navigator initialRouteName="LoginPage">
      <Stack.Screen
        name="LoginPage"
        component={LoginPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUpPage"
        component={SignUpPage}
        options={{
          title: 'Sign Up',
          headerStyle: {
            backgroundColor: '#11CB76',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const Stocks = () => {
  return (
    <Stack.Navigator initialRouteName="StocksPortofolioPage">
      <Stack.Screen
        name="StocksPortofolioPage"
        component={StocksPortofolioPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StocksDetailsPage"
        component={StocksDetailsPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StocksSearchPage"
        component={StocksSearchPage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const Transfer = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TransferPage"
        component={TransferPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TransferToFriendPage"
        component={TransferToFriendPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TransferNFCMenu"
        component={TransferNFCMenu}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TransferNFCSenderPage"
        component={TransferNFCSenderPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TransferNFCReceiverPage"
        component={TransferNFCReceiverPage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

const Menu = () => {
  return (
    <Stack.Navigator initialRouteName="PrincipalScreen">
      <Stack.Screen
        name="PrincipalScreen"
        component={PrincipalScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TransactionPage"
        component={TransactionPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WalletPage"
        component={WalletPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Transfer"
        component={Transfer}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name="SpendingAnalysisPage"
        component={SpendingAnalysisPage}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name="ExchangePage"
        component={ExchangePage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Menu"
          component={Menu}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stocks"
          component={Stocks}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;
