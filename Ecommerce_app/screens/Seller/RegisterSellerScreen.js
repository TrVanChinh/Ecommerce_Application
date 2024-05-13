import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { SimpleLineIcons, Entypo } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import color from "../../components/color";
import { API_BASE_URL } from "../../Localhost";
import axios from "axios";
import { useUser } from "../../UserContext";

const RegisterSellerScreen = ({ navigation, route }) => {
  const [shopName, onChangeShopName] = useState("");
  const { updateUser, user } = useUser();
  const [address, setAddress] = useState("");
  const [shopDescript, setShopDescript] = useState("");
  //   const [phone, setPhoneNumber] = useState("");
  //   const { idUser: idUser } = route.params || {};
  const idUser = "6621083f1a79569d6ee33dfd";
  const [loading, setLoading] = useState(false);
  //   const [user, setUser] = useState(null);

  const showitems = () => {
    console.log("items: ", otpCode);
  };
  const [verificationCode, setVerificationCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [hashedOTP, setHashedOTP] = useState("");

  useEffect(() => {
    console.log("hashedOTP: ", hashedOTP);
  }, [hashedOTP]);

  useEffect(() => {
    let timer;
    if (isCountdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    if (countdown === 0) {
        setIsCountdownActive(false);
    }
    return () => clearTimeout(timer);
  }, [isCountdownActive, countdown]);


  const handleResendVerificationCode = () => {
    // Gửi lại mã xác nhận
    // Bắt đầu đếm ngược
    setIsCountdownActive(true);
    setCountdown(60);
    sendOTPVerificationEmailSeller();
  };

  const sendRequest = async () => {
    try {
      if (shopName === "") {
        alert("Chưa nhập tên cửa hàng");
      } else if (address === "") {
        alert("Chưa nhập địa chỉ");
      } else {
        setLoading(true);
        const res = await axios.post(`${API_BASE_URL}/user/SaleRegister`, {
          shopDescript: shopDescript,
          shopAddress: address,
          shopName: shopName,
          userid: user._id,
        });
        setLoading(false);
        if (res.data.status === "SUCCESS") {
          // Hiển thị thông báo nếu cập nhật thành công
          Alert.alert("Thông báo", "Đăng ký bán hàng thành công", [
            {
              text: "OK",
              onPress: () => {
                navigation.popToTop();
              },
            },
          ]);
        } else {
          console.error("Dữ liệu không tồn tại sau khi cập nhật.");
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      setLoading(false);
    }
  };

  const sendOTPVerificationEmailSeller = async () => {
    try {
      // setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/user/sendOTPVerificationEmailSeller`,
        {
            email: user.email,
        }
      );
      setHashedOTP(res.data.data.hashedOTP);
    //   console.log("otp code: ", res.data.data.otp);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      // setLoading(false);
    }
  };

  const handleOTPChange = (text) => {
    // Loại bỏ các ký tự không phải số
    const numericValue = text.replace(/[^0-9]/g, "");
    if (numericValue <= 10000) {
      setVerificationCode(numericValue);
    } else {
      Alert.alert("Cảnh báo", "Mã OTP chỉ chứa tối đa 4 ký tự.");
    }
  };

  const verifyOTPSeller = async () => {
    try {
      // setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/user/verifyOTPSeller`, {
        hashedOTP: hashedOTP,
        otp: verificationCode,
      });
      console.log("res: ", res.data);
      if (res.data.status === "VERIFIED") {
        sendRequest();
        console.log("Mã OTP chính xác");
      } else {
        Alert.alert("Thông báo","Mã OTP không chính xác");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      // setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 8 }}>
        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Tên cửa hàng</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={onChangeShopName}
            value={shopName}
          />
        </View>
        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>
              Địa chỉ lấy hàng
            </Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={setAddress}
            value={address}
          />
        </View>

        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>
              Mô tả cho cửa hàng
            </Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={setShopDescript}
            value={shopDescript}
            maxLength={200}
          />
        </View>

        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Xác thực</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.inputVerify}
              placeholder="Nhập mã OTP đã gửi qua email"
              value={verificationCode}
              onChangeText={handleOTPChange}
            />
            <TouchableOpacity
              style={[
                styles.button,
                isCountdownActive ? styles.disabledButton : null,
              ]}
              onPress={handleResendVerificationCode}
              disabled={isCountdownActive}
            >
              <Text style={styles.buttonText}>
                {isCountdownActive ? `Gửi lại sau ${countdown}s` : "Gửi mã OTP"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{}}>
        <Button title="Đăng kí" color={color.origin} onPress={verifyOTPSeller} />
      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

export default RegisterSellerScreen;

const styles = StyleSheet.create({
  list_items: {
    marginVertical: 1,
    width: "100%",
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  input: {
    marginLeft: 12,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputVerify: {
    width: "60%",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  button: {
    // width: "40%",
    height: 40,
    backgroundColor: "blue",
    borderRadius: 5,
    justifyContent: "center",
    marginLeft: 20,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "gray",
  },
});
