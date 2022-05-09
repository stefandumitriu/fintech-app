import React, {useState, createRef} from 'react';
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
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Entypo as Icon } from '@expo/vector-icons';

const LoginScreen = ({navigation}) => {
  const passwordInputRef = createRef();

  const LoginSchema = Yup.object().shape({
    phoneNumber: Yup.number()
      .integer('Must be an integer')
      .positive('Must be a positive number')
      .required('Required'),
    password: Yup.string()
      .min(6, 'Too Short!')
      .required('Required')
  });

  const formik = useFormik({
    validationSchema: LoginSchema,
    initialValues: { phoneNumber: '', password: '' },
    onSubmit: () => navigation.replace('Menu'),
  });
  
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
        <View>
          <KeyboardAvoidingView enabled>
            <View style={styles.SectionStyle}>
              <View style={styles.IconStyle}>
                {formik.touched.phoneNumber && formik.errors.phoneNumber ? 
                  (<Icon name={'old-phone'} color='#ff292f' size={16} />) : 
                  (<Icon name={'old-phone'} color='#223e4b' size={16} />)}
              </View>
              <TextInput
                style={styles.inputStyle}
                onChangeText={formik.handleChange('phoneNumber')}
                onBlur={formik.handleBlur('phoneNumber')}
                errors={formik.errors.phoneNumber}
                touched={formik.touched.phoneNumber}
                placeholder="Enter Phone Number"
                placeholderTextColor="#8b9cb5"
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current &&
                  passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
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
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  IconStyle: {
    padding: 10,
  },
  buttonStyle: {
    backgroundColor: '#7de24e',
    borderWidth: 0,
    color: '#ffffff',
    borderColor: '#7de24e',
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