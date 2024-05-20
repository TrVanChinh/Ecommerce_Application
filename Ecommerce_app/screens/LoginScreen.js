import {
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Switch,
} from "react-native";
import React from "react";
import { useState } from "react";
import { Feather, SimpleLineIcons, AntDesign } from "@expo/vector-icons";
import { Input, Icon } from "react-native-elements";
import { useUser } from "../UserContext";
import { API_BASE_URL } from "../Localhost";
import axios from "axios";

const LoginScreen = ({ navigation }) => {
  const { updateUser, user } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const handleLogin = () => {
    const userInfo = {
      email: email,
      password: password,
    };
    if (isEnabled) {
      axios
      .post(`${API_BASE_URL}/admin/signin`, userInfo)
      .then((response) => {
        if (response.data.status === "FAILED") {
          alert(response.data.message);
          console.log(response.data.message);
        } else {
          console.log("Login admin successful");
          setEmail("");
          setPassword("");
          let admin = {};
          response.data.data.forEach(element => {
            if (element.email === email) {
              admin = element;
              // console.log(element);
            }            
          });
          navigation.navigate("AdminHome", { admin: admin });
        }
      })
      .catch((error) => {
        alert("Login Error");
        console.log(error);
      });
    } else {
    axios
      .post(`${API_BASE_URL}/user/signin`, userInfo)
      .then((response) => {
        if (response.data.status === "FAILED") {
          alert(response.data.message);
          console.log(response.data.message);
        } else {
          console.log("Login successful");
          updateUser(response.data.data[0]);
          navigation.navigate("Main");
        }
      })
      .catch((error) => {
        alert("Login Error");
        console.log(error);
      });
    }
  };
  const clearInput = () => {
    setEmail("");
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <SafeAreaView
      style={{ width: "100%", paddingTop: 50, alignItems: "center" }}
    >
      <View>
        <Image
          style={{ width: 60, height: 80, top: 20 }}
          source={require("../assets/shopLogo.png")}
        />
      </View>
      <View style={{ width: "90%", top: 50 }}>
        <Text
          style={{
            paddingBottom: 40,
            fontSize: 30,
            fontWeight: "bold",
            alignSelf: "center",
          }}
        >
          Đăng Nhập
        </Text>
        <KeyboardAvoidingView behavior="padding">
          <Input
            placeholder="example@gmail.com"
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
            value={email}
            leftIcon={<Feather name="mail" size={24} color="#857E7C" />}
            rightIcon={
              email ? (
                <AntDesign
                  name="close"
                  size={24}
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
                size={24}
                color="#857E7C"
                onPress={togglePasswordVisibility}
              />
            }
          />
        </KeyboardAvoidingView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#857E7C", fontSize: 15 }}>
            Đăng nhập với tư cách quản trị viên
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#F1582C" }}
            thumbColor={isEnabled ? "#fff" : "#fff"}
            // ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor:
              (email.length > 0) & (password.length > 0)
                ? "#F1582C"
                : "lightgray",
            padding: 12,
            alignItems: "center",
          }}
          disabled={email.length === 0}
          onPress={handleLogin}
        >
          <Text style={{ color: email.length > 0 ? "white" : "#857E7C" }}>
            Đăng nhập
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ paddingTop: 20 }}
          onPress={() => navigation.navigate("EmailAuthentication")}
        >
          <Text style={{ color: "blue" }}>Quên mật khẩu?</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <View
            style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD" }}
          ></View>
          <Text style={{ color: "#857E7C" }}>Hoặc</Text>
          <View
            style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD" }}
          ></View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 20,
          }}
        >
          <Text>Bạn chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: "blue" }}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
