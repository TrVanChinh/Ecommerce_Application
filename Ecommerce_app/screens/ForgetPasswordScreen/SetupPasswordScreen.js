import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert,
    SafeAreaView,
  } from "react-native";
  import React from "react";
  import { useState } from "react";
  import { Feather, SimpleLineIcons , AntDesign } from "@expo/vector-icons";
  import { Input, Icon } from "react-native-elements";
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import  axios  from "axios";
  import { API_BASE_URL } from "../../Localhost";

const SetupPasswordScreen = ({navigation}) => {
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleSetUpPassword = async () => {
      const userId = await AsyncStorage.getItem("userIdOfForgotPassword")
      const userInfo = {
        userId: userId,
        password: password,
      }
      axios.post(`${API_BASE_URL}/user/setupPassword`,userInfo).then((response) => {
        if (response.data.status === "FAILED") {
          alert(response.data.message); 
          console.log(response.data.message);
        } else {
          //console.log(response.data.data)
          Alert.alert(
            '',
            `Thiết lập mật khẩu thành công.`,
            [
              { text: 'OK', onPress: () => navigation.navigate("Login") },
            ],
            { cancelable: false }
          );
        }
      })
      .catch((error) => {
        alert("Login Error")
        console.log(error)
      })
    }

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };
  return (
    <SafeAreaView style={{ width: "100%", paddingTop:50, alignItems: "center" }}>
      <View style={{ width: "90%", top: 50 }}>
      <Text style={{  paddingBottom: 40, fontSize:30, fontWeight:'bold' , alignSelf:'center' }}>Thiếp Lập Mật Khẩu</Text>
        <KeyboardAvoidingView behavior="padding">
          <Input
            secureTextEntry={!isPasswordVisible}
            placeholder="Mật khẩu"
            onChangeText={(text) => setPassword(text)}
            value={password}
            leftIcon={<SimpleLineIcons name="lock" size={20} color="#857E7C" />}
            rightIcon={
                <Feather 
                  name="eye-off" 
                  size={20} 
                  color="#857E7C" 
                  onPress={togglePasswordVisibility}
                />
            }
          />
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={{
            backgroundColor: password.length> 0 ? "#F1582C" : "lightgray",
            padding: 12,
            alignItems: "center",
          }}
          disabled={password.length === 0}
          onPress={handleSetUpPassword}
        >
          <Text style={{ color: password.length > 0 ? "white" : "#857E7C" }}>
            Tiếp tục
          </Text>
        </TouchableOpacity>
          
      </View>
    </SafeAreaView>
  )
}

export default SetupPasswordScreen

const styles = StyleSheet.create({})