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
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Entypo as Icon } from '@expo/vector-icons';

const SignUpPage = ({navigation}) => {
  const surnameInputRef = createRef();
  const emailInputRef = createRef();
  const passwordInputRef = createRef();
  const ageInputRef = createRef();
  const addressInputRef = createRef();
  const phoneNumberInputRef = createRef();

  const SignUpSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    surname: Yup.string().required('Required'),
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
    phoneNumber: Yup.number()
      .integer('Must be an integer')
      .positive('Must be a positive number')
      .required('Required'),
  });

  const formik = useFormik({
    validationSchema: SignUpSchema,
    initialValues: { name: '', surname: '', email: '', password: '', age: '', address: '', phoneNumber: '' },
    onSubmit: () => navigation.navigate('LoginPage'),
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
              onChangeText={formik.handleChange('name')}
              onBlur={formik.handleBlur('name')}
              errors={formik.errors.name}
              touched={formik.touched.name}
              underlineColorAndroid="#f000"
              placeholder="Enter Name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                surnameInputRef.current && surnameInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SurnameSectionStyle}>
            <View style={styles.IconStyle}>
              {formik.touched.surname && formik.errors.surname ? 
                (<Icon name={'user'} color='#ff292f' size={16} />) : 
                (<Icon name={'user'} color='#223e4b' size={16} />)}
            </View>
            <TextInput
              style={styles.inputStyle}
              onChangeText={formik.handleChange('surname')}
              onBlur={formik.handleBlur('surnmae')}
              errors={formik.errors.surname}
              touched={formik.touched.surname}
              underlineColorAndroid="#f000"
              placeholder="Enter Surname"
              placeholderTextColor="#8b9cb5"
              autoCapitalize='sentences'
              ref={surnameInputRef}
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
                phoneNumberInputRef.current && phoneNumberInputRef.current.focus()}
              blurOnSubmit={false}
            />
          </View>
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
              underlineColorAndroid="#f000"
              placeholder="Enter Phone Number"
              placeholderTextColor="#8b9cb5"
              keyboardType="numeric"
              ref={phoneNumberInputRef}
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
  SurnameSectionStyle: {
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
