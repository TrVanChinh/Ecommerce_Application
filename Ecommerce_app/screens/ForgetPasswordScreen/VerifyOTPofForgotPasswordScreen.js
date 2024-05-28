import {
  StyleSheet,
  Text,
  View,
  TextInput,
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

const VerifyOTPofForgotPasswordScreen = ({ navigation}) => {
  const [code, setCode] = useState("");
  const handledVerify = async () => {
    const userId = await AsyncStorage.getItem("userIdOfForgotPassword")
    const verifyInfo = {
      userId: userId,
      otp: code, 
    }
    axios.post(`${API_BASE_URL}/user/verifyOTPofForgotPassword`, verifyInfo).then((response) => {
      if (response.data.status === "FAILED") {
        Alert.alert(response.data.message); 
        console.log(response.data.message);
      } else {
        navigation.navigate('SetupPassword');
      }
    }).catch((error) => {
        Alert.alert("Registration error")
        console.log(error)
      })
  }

  const handledResendOTP = async () => { 
    const userId = await AsyncStorage.getItem("userIdOfForgotPassword")
    const email = await AsyncStorage.getItem("emailOfForgotPassword")
    const reSendOTPInfo = {
      userId: userId,
      email: email,
    }
    axios.post(`${API_BASE_URL}/user/resendVerificationCode`, reSendOTPInfo).then((response) => {
      console.log(response.data);

    }).catch((error) => {
        Alert.alert("Registration error")
        console.log(error)
      })
  }
  return (
    <SafeAreaView style={{ width: "100%", alignItems: "center", padding:30 }}>
      <View style={{ width: "90%", top: 30 }}>
        <Text style ={{ fontSize: 30, fontWeight:'bold', alignSelf:"center",padding:30}}>Xác thực mã OTP</Text>
        <KeyboardAvoidingView behavior="padding">
          <Input
            placeholder="Nhập OTP"
            onChangeText={setCode}
            keyboardType="phone-pad"
            autoComplete="tel"
          />
        </KeyboardAvoidingView>
        <View style={{flexDirection:'row', justifyContent:'center', alignItems:"center", paddingBottom:30}}>
          <Text style={{fontSize:16}}>Bạn chưa nhận được mã?</Text>
          <TouchableOpacity
            onPress={() => handledResendOTP()}
          >
            <Text style={{ color:'blue', fontSize:16}}> Gửi lại OTP</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: code.length > 0 ? "#F1582C" : "lightgray",
            padding: 12,
            alignItems: "center",
          }}
          disabled={code.length === 0}
          onPress={() => handledVerify()}
        >
          <Text style={{ color: code.length > 0 ? "white" : "#857E7C" }}>
            Tiếp theo
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VerifyOTPofForgotPasswordScreen;

const styles = StyleSheet.create({});
