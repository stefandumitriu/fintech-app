import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  StatusBar,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

import { Entypo as Icon } from '@expo/vector-icons';

const StocksPortofolioPage = ({navigation}) => {
  return (
    <View style={styles.mainBody}>
      <StatusBar
        backgroundColor="#7de24e"
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
      </ScrollView>
    </View>
  );
};
export default StocksPortofolioPage;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0efed',
    alignContent: 'center',
  },
});
