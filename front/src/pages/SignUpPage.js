import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Entypo as Icon } from '@expo/vector-icons';

const SignUpPage = ({navigation}) => {
  const last_nameInputRef = createRef();
  const emailInputRef = createRef();
  const passwordInputRef = createRef();
  const ageInputRef = createRef();
  const addressInputRef = createRef();
  const phone_numberInputRef = createRef();

  const SignUpSchema = Yup.object().shape({
    first_name: Yup.string().required('Required'),
    last_name: Yup.string().required('Required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    password: Yup.string()
      .min(6, 'Too Short!')
      .required('Required'),
    age: Yup.number()
      .positive('Must be a positive number')
      .integer('Must be an integer')
      .required('Required'),
    address: Yup.string()
      .required('Required'),
    phone_number: Yup.number()
      .integer('Must be an integer')
      .positive('Must be a positive number')
      .required('Required'),
  });

  const formik = useFormik({
    validationSchema: SignUpSchema,
    initialValues: { first_name: '', last_name: '', email: '', password: '', age: '', address: '', phone_number: '' },
    onSubmit: (values, actions) => axios({
      method: "POST",
      url: "http://3.70.21.159:8000/users/",
      data: values
    })
      .then(response => {
        actions.setSubmitting(false);
        actions.resetForm();
        navigation.navigate('LoginPage');
      })
      .catch(error => {
        actions.setSubmitting(false);
        console.log(error);
      })
  });

  return (
    <View style={{flex: 1, backgroundColor: '#f0efed'}}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <KeyboardAvoidingView enabled>
          <View style={styles.NameSectionStyle}>
            <View style={styles.IconStyle}>
              {formik.touched.name && formik.errors.name ? 
                (<Icon name={'users'} color='#ff292f' size={16} />) : 
                (<Icon name={'users'} color='#223e4b' size={16} />)}
            </View>
            <TextInput
              style={styles.inputStyle}
              onChangeText={formik.handleChange('first_name')}
              onBlur={formik.handleBlur('first_name')}
              errors={formik.errors.first_name}
              touched={formik.touched.first_name}
              underlineColorAndroid="#f000"
              placeholder="Enter First Name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                last_nameInputRef.current && last_nameInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.last_nameSectionStyle}>
            <View style={styles.IconStyle}>
              {formik.touched.last_name && formik.errors.last_name ? 
                (<Icon name={'user'} color='#ff292f' size={16} />) : 
                (<Icon name={'user'} color='#223e4b' size={16} />)}
            </View>
            <TextInput
              style={styles.inputStyle}
              onChangeText={formik.handleChange('last_name')}
              onBlur={formik.handleBlur('last_name')}
              errors={formik.errors.last_name}
              touched={formik.touched.last_name}
              underlineColorAndroid="#f000"
              placeholder="Enter Last name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize='sentences'
              ref={last_nameInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                emailInputRef.current && emailInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <View style={styles.IconStyle}>
              {formik.touched.email && formik.errors.email ? 
                (<Icon name={'mail'} color='#ff292f' size={16} />) : 
                (<Icon name={'mail'} color='#223e4b' size={16} />)}
            </View>
            <TextInput
              style={styles.inputStyle}
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
              errors={formik.errors.email}
              touched={formik.touched.email}
              underlineColorAndroid="#f000"
              placeholder="Enter Email"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current && passwordInputRef.current.focus()
              }
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
              underlineColorAndroid="#f000"
              placeholder="Enter Password"
              placeholderTextColor="#8b9cb5"
              ref={passwordInputRef}
              returnKeyType="next"
              secureTextEntry={true}
              onSubmitEditing={() =>
                ageInputRef.current && ageInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <View style={styles.IconStyle}>
              {formik.touched.age && formik.errors.age ? 
                (<Icon name={'calendar'} color='#ff292f' size={16} />) : 
                (<Icon name={'calendar'} color='#223e4b' size={16} />)}
            </View>
            <TextInput
              style={styles.inputStyle}
              onChangeText={formik.handleChange('age')}
              onBlur={formik.handleBlur('age')}
              errors={formik.errors.age}
              touched={formik.touched.age}
              underlineColorAndroid="#f000"
              placeholder="Enter Age"
              placeholderTextColor="#8b9cb5"
              keyboardType="numeric"
              ref={ageInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                addressInputRef.current && addressInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <View style={styles.IconStyle}>
              {formik.touched.address && formik.errors.address ? 
                (<Icon name={'address'} color='#ff292f' size={16} />) : 
                (<Icon name={'address'} color='#223e4b' size={16} />)}
            </View>
            <TextInput
              style={styles.inputStyle}
              onChangeText={formik.handleChange('address')}
              onBlur={formik.handleBlur('address')}
              errors={formik.errors.address}
              touched={formik.touched.address}
              underlineColorAndroid="#f000"
              placeholder="Enter Address"
              placeholderTextColor="#8b9cb5"
              autoCapitalize='words'
              ref={addressInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                phone_numberInputRef.current && phone_numberInputRef.current.focus()}
              blurOnSubmit={false}
            />
          </View>
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
              underlineColorAndroid="#f000"
              placeholder="Enter Phone Number"
              placeholderTextColor="#8b9cb5"
              keyboardType="numeric"
              ref={phone_numberInputRef}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={formik.handleSubmit}>
            <Text style={styles.buttonTextStyle}>REGISTER</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default SignUpPage;

const styles = StyleSheet.create({
  NameSectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  last_nameSectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
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
    borderColor: '#7de24e',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
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
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
});
