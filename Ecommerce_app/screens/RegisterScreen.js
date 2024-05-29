import {
  StyleSheet, 
  Text,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Alert,
} from "react-native";
import React from "react";
import { useState, useRef } from "react";
import { Feather, AntDesign, SimpleLineIcons , FontAwesome5} from "@expo/vector-icons";
import { Input, Icon } from "react-native-elements";
import  axios  from "axios";
import { API_BASE_URL } from "../Localhost";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [ConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const clearInput = () => {
      setEmail("");
    };
    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
      setConfirmPasswordVisible(!ConfirmPasswordVisible);
    };
  
    const handleRegister = () => {
      if(password.length < 8) {
        Alert.alert("Mật khẩu phải có ít nhất 8 ký tự")
      }
      else if ( password != confirmPassword) {
        Alert.alert("Mật khẩu nhập lại không trùng khớp")
      } else {
        const userInfo = {
          name: name,
          email: email,
          password: password,
        }
        AsyncStorage.setItem("email",email)
        axios.post(`${API_BASE_URL}/user/signup`, userInfo).then((response) => {
          if (response.data.status === "FAILED") {
            Alert.alert(response.data.message); 
            console.log(response.data.message);
          } else {
            const userId = response.data.data.userId
            AsyncStorage.setItem("userId",userId)
            navigation.navigate('Verify')
          }
        }).catch((error) => {
            Alert.alert("Registration error")
            console.log(error)
          })
      }
      
    }

  const handleNavigator = () => {
    navigation.navigate("Login")
  }
  return (
    <SafeAreaView style={{ width: "100%", alignItems: "center" , paddingTop:30}}>
      <View >
        <Image
          style={{ width: 60, height: 80, top: 20 }}
          source={require("../assets/shopLogo.png")}
        /> 
      </View>
      <ScrollView  style={{ width: "90%", top: 50, }}>
        <Text style={{  paddingBottom: 40, fontSize:30, fontWeight:'bold' , alignSelf:'center' }}>Đăng ký tài khoản</Text>
        <KeyboardAvoidingView behavior="padding" >
          <Input
            placeholder="Tên" 
            onChangeText={setName}
            value={name}
            leftIcon={<FontAwesome5 name="user" size={24} color="#857E7C" />}
          />
          <Input
            placeholder="example@gmail.com"
            onChangeText={setEmail}
            keyboardType="email-address"
            value={email}
            // autoComplete="tel"
            leftIcon={<Feather name="mail" size={24} color="#857E7C" />}
            rightIcon={
              email ? (
                <AntDesign
                  name="close"
                  size={20}
                  color="#857E7C"
                  onPress={clearInput}
                />
              ) : null
            }
          />
          <Input
              secureTextEntry={!isPasswordVisible}
              placeholder="Mật khẩu"
              onChangeText={(text) => setPassword(text)}
              value={password}
              leftIcon={<SimpleLineIcons name="lock" size={24} color="#857E7C" />}
              rightIcon={
                  <Feather 
                    name="eye-off" 
                    size={20} 
                    color="#857E7C" 
                    onPress={togglePasswordVisibility}
                  />
              }
            />
            <Input
              secureTextEntry={!ConfirmPasswordVisible}
              placeholder="Xác nhận mật khẩu"
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
              leftIcon={<SimpleLineIcons name="lock" size={24} color="#857E7C" />}
              rightIcon={
                  <Feather 
                    name="eye-off" 
                    size={20} 
                    color="#857E7C" 
                    onPress={toggleConfirmPasswordVisibility}
                  />
              }
            />
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={{
            backgroundColor: email.length > 0 & name.length > 0 & password.length > 0 & confirmPassword.length > 0? "#F1582C" : "lightgray",
            padding: 12,
            alignItems: "center",
          }}
          disabled={email.length === 0}
          onPress={handleRegister}
        >
          <Text style={{ color:  email.length > 0 & name.length > 0 & password.length > 0 & confirmPassword.length > 0 ? "white" : "#857E7C" }}>
            Đăng ký
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: 'center', marginVertical: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD" }}></View>
          <Text style={{ color:"#857E7C"}}>Hoặc</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD"}}></View>
        </View>
        <View style={{flexDirection:'row', justifyContent:'center', alignItems:"center", paddingTop:20}}>
          <Text>Bạn chưa đã có tài khoản?</Text>
          <TouchableOpacity onPress={() => handleNavigator()}>
            <Text style={{ color:'blue'}}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});



