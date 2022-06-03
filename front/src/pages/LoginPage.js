import React, {createRef} from 'react';
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
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Entypo as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = 'http://10.0.2.2:8000/login/'
const awsUrl = 'http://3.70.21.159:8000'

const LoginScreen = ({navigation}) => {
  const passwordInputRef = createRef();

  const LoginSchema = Yup.object().shape({
    phone_number: Yup.number()
      .integer('Must be an integer')
      .positive('Must be a positive number')
      .required('Required'),
    password: Yup.string()
      .min(3, 'Too Short!')
      .required('Required')
  });
  const storeUser = async (value) => {
    try {
      await AsyncStorage.setItem("loginInfo", JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };
  const formik = useFormik({
    validationSchema: LoginSchema,
    initialValues: { phone_number: '', password: '' },
    onSubmit: (values, actions) => axios({
      method: "POST",
      url: "http://3.70.21.159:8000/login/",
      data: {
        phone_number: values.phone_number, 
        password: values.password
      }
    })
      .then(response => {
        actions.setSubmitting(false);
        const value = {
          token: 'Token ' + response.data['token'],
          email: response.data['email'],
        };
        storeUser(value);
        navigation.replace('Menu');
      })
      .catch(error => {
        actions.setSubmitting(false);
        console.log(error);
      })
  });
  
  return (
    <View style={styles.mainBody}>
      <StatusBar
        backgroundColor="#11CB76"
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={styles.SectionStyle}>
              <View style={styles.IconStyle}>
                {formik.touched.phone_number && formik.errors.phone_number ? 
                  (<Icon name={'old-phone'} color='#ff292f' size={16} />) : 
                  (<Icon name={'old-phone'} color='#223e4b' size={16} />)}
              </View>
              <TextInput
                style={styles.inputStyle}
                onChangeText={formik.handleChange('phone_number')}
                onBlur={formik.handleBlur('phone_number')}
                errors={formik.errors.phone_number}
                touched={formik.touched.phone_number}
                placeholder="Enter Phone Number"
                placeholderTextColor="#8b9cb5"
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
          </View>
            <View style={styles.SectionStyle}>
              <View style={styles.IconStyle}>
              {formik.touched.password && formik.errors.password ? 
                  (<Icon name={'key'} color='#ff292f' size={16} />) : 
                  (<Icon name={'key'} color='#223e4b' size={16} />)}
              </View>
              <TextInput
                style={styles.inputStyle}
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
                errors={formik.errors.password}
                touched={formik.touched.password}
                placeholder="Enter Password"
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="done"
              />
            </View>
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={formik.handleSubmit}>
              <Text 
                style={styles.buttonTextStyle}>
                LOGIN
              </Text>
            </TouchableOpacity>
            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('SignUpPage')}>
              New User? Register
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0efed',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: -10,
    marginLeft: 35,
    marginRight: 35,
  },
  IconStyle: {
    padding: 10,
  },
  buttonStyle: {
    backgroundColor: '#11CB76',
    borderWidth: 0,
    color: '#ffffff',
    borderColor: '#11CB76',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#ffffff',
    paddingVertical: 8,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: '#000000',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
    
  },
  registerTextStyle: {
    color: '#000000',
    textAlign: 'center',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
});