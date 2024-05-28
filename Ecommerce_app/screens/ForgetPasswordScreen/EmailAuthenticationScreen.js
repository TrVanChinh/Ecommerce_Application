import {
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert,
    SafeAreaView,
  } from "react-native";
  import React from "react";
  import { Input } from "react-native-elements";
  import { useState } from "react";
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import  axios  from "axios";
  import { API_BASE_URL } from "../../Localhost";
  import CustomAlert from "../../components/CustomAlert"
  const EmailAuthenticationScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    AsyncStorage.setItem("emailOfForgotPassword", email)
    const handledVerify = async () => {
      const emailInfo = {
        email: email, 
      }
      axios.post(`${API_BASE_URL}/user/emailAuthentication`, emailInfo).then((response) => {
        if (response.data.status === "FAILED") {
          Alert.alert(response.data.message); 
          console.log(response.data.message);
        } else {
          // console.log( response.data.data.userId)
          const userId = response.data.data.userId
          AsyncStorage.setItem("userIdOfForgotPassword", userId)
          Alert.alert(
            '',
            `Mã xác minh đã được gửi đến địa chỉ email ${email}. Vui lòng xác minh.`,
            [
              { text: 'OK', onPress: () => navigation.navigate('VerifyOTPofForgotPassword') },
            ],
            { cancelable: false }
          );
        }
      }).catch((error) => {
          Alert.alert("Registration error")
          console.log(error)
        })
    }
  
    return (
      <SafeAreaView style={{ width: "100%", alignItems: "center", padding:30 }}>
        <View style={{ width: "90%", top: 30 }}>
          <Text style ={{ fontSize: 30, fontWeight:'bold', alignSelf:"center",padding:30}}>Nhập Email </Text>
          <KeyboardAvoidingView behavior="padding">
            <Input
              placeholder="Nhập Email"
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="tel"
            />
          </KeyboardAvoidingView>
          
          <TouchableOpacity
            style={{
              backgroundColor: email.length > 0 ? "#F1582C" : "lightgray",
              padding: 12,
              alignItems: "center",
            }}
            disabled={email.length === 0}
            onPress={() => handledVerify()}
          >
            <Text style={{ color: email.length > 0 ? "white" : "#857E7C" }}>
              Tiếp theo
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };
  
  export default EmailAuthenticationScreen;
  
  const styles = StyleSheet.create({});
  




