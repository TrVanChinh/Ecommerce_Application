import {
  StyleSheet,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Alert,
} from "react-native";
import React, { useEffect, version } from "react";
import { useState, useRef } from "react";
import { Input, Icon } from "react-native-elements";
import { useUser } from "../UserContext";
import { API_BASE_URL } from "../Localhost";
import axios from "axios";

const UpdatePasswordScreen = ({ navigation }) => {
  const { user } = useUser();
  const idUser = user._id;
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const updatePassword = async () => {
    if (newPassword.length < 8) {
      alert("Mật khẩu có ít nhất 8 kí tự");
    } else if (newPassword === confirm) {
      const userInfo = { 
        userId: idUser,
        password: password,
        newPassword: newPassword,
      }
      try {
        axios.put(`${API_BASE_URL}/user/updatePassword`, userInfo)
        .then((response) => {
          if (response.data.status === "FAILED") {
            alert(response.data.message);
            console.log(response.data.message);
          } else {
            Alert.alert(
              "",
              `Cập nhật mật khẩu thành công.`,
              [{ text: "OK", onPress: () => navigation.navigate("Main") }],
              { cancelable: false }
            );
          }
        }) 
      } catch (error) {
        
      }
    } else {
      alert("Xác thực mật khẩu chưa chính xác");
    }
  };

  return (
    <SafeAreaView style={{ width: "100%", alignItems: "center" }}>
      <View style={{ width: "90%", top: 30 }}>
        <KeyboardAvoidingView behavior="padding">
          <Input
            placeholder="Nhập mật khẩu"
            onChangeText={setPassword}
            value={password}
            style={{ fontSize: 16 }}
          />
          <Input
            placeholder="Nhập mật khẩu mới"
            onChangeText={setNewPassword}
            value={newPassword}
            style={{ fontSize: 16 }}
          />
          <Input
            placeholder="Nhập lại mật khẩu"
            onChangeText={setConfirm}
            value={confirm}
            style={{ fontSize: 16 }}
          />
        </KeyboardAvoidingView>

        <TouchableOpacity
          style={{
            backgroundColor:
              confirm.length && password.length > 0 ? "#F1582C" : "lightgray",
            padding: 12,
            alignItems: "center",
          }}
          disabled={confirm.length === 0 && password.length === 0}
          onPress={updatePassword}
        >
          <Text
            style={{
              color:
                confirm.length && password.length > 0 ? "white" : "#857E7C",
            }}
          >
            Cập nhật
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UpdatePasswordScreen;

const styles = StyleSheet.create({});
