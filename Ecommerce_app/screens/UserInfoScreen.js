import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button } from "react-native-elements";
import color from "../components/color";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome5, SimpleLineIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { API_BASE_URL } from "../Localhost";
import axios from "axios";
import { useUser } from "../UserContext";
import * as FileSystem from "expo-file-system";

const UserInfoScreen = ({ navigation }) => {
  const { updateUser, user } = useUser();
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setDateOfBirth(formatDate(user.dateOfBirth));
      setAvatar(user.avatarUrl);
    }
  }, [user]);

  useEffect(() => {

  }, [avatar]);
  const updateUserInfo = async () => {
    if (editingStatus) {
      const userInfo = {
        name: name,
        id: user._id,
        dateOfBirth: dateOfBirth,
      };
      axios
        .put(`${API_BASE_URL}/user/updateUser`, userInfo)
        .then((response) => {
          if (response.data.status === "FAILED") {
            alert(response.data.message);
            console.log(response.data.message);
          } else {
            updateUser(response.data.data);
            Alert.alert(
              "",
              `Cập nhật thành công.`,
              [{ text: "OK", onPress: () => navigation.navigate("Main") }],
              { cancelable: false }
            );
          }
        }) 
        .catch((error) => {
          alert("Login Error");
          console.log(error);
        });
    } else {
      alert("Hãy chọn nút chỉnh sửa");
    }
  };

  const changeAvatar = async () => {
    if (!loading) {
        // Chọn hình ảnh
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            base64: true,
            quality: 1,
        });

        if (!result.canceled) {
            setLoading(true);

            const formData = new FormData();
            const imageUri = result.assets[0].uri;

            formData.append("image", {
                uri: imageUri,
                type: "image/jpeg",
                name: `image.jpg`,
            });

            formData.append("userId", user._id); // Thêm userId vào formData

            try {
                // Gửi yêu cầu POST để tải lên hình ảnh
                const response = await axios.put(
                    `${API_BASE_URL}/upload/avatar`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                // Log kết quả và trả về URL của hình ảnh đã tải lên
                if (response.data.status === "SUCCESS") {
                    console.log("Image uploaded successfully:", response.data.data);
                    setAvatar(response.data.data);
                    Alert.alert("Thông báo", "Cập nhật ảnh đại diện thành công");
                } else {
                    console.log("Image upload failed:", response.data.message);
                    Alert.alert("Lỗi", "Không thể cập nhật ảnh đại diện");
                }
            } catch (error) {
                console.log("Error uploading image:", error);
                Alert.alert("Lỗi", "Không thể cập nhật ảnh đại diện");
            } finally {
                setLoading(false);
            }
        }
    }
};


  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Tháng tính từ 0-11, nên cần +1
    const year = date.getUTCFullYear();

    // Định dạng ngày tháng năm theo kiểu DD/MM/YYYY
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
   // Chuyển đổi đối tượng Date thành chuỗi định dạng DD/MM/YYYY
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = currentDate.getFullYear();
    const formattedDate = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
    setDateOfBirth(formattedDate);
  };

  const showMode = () => {
    setShow(true);
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 8 }}>
        {avatar === "" ? (
          <></>
        ) : (
          <>
            <View
              style={{
                marginVertical: 10,
                alignSelf: "center",
              }}
            >
              {/* Image Container */}
              <View style={styles.imageContainer}>
                {loading && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={color.origin} />
                  </View>
                )}
                <Image
                  source={{ uri: avatar }}
                  style={{
                    width: 100,
                    height: 100,
                    borderWidth: 5,
                    borderColor: "white",
                    borderRadius: 100,
                  }}
                />
              </View>

              {/* Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: color.origin,
                  padding: 5,
                  alignSelf: "center",
                  marginTop: -24,
                  marginLeft: 60,
                  borderRadius: 100,
                }}
                onPress={changeAvatar}
              >
                <FontAwesome5 name="exchange-alt" size={12} color="white" />
              </TouchableOpacity>
            </View>
          </>
        )}
        <Pressable
          style={{
            padding: 10,
            flexDirection: "row",
            justifyContent: "flex-end",
            padding: 10,
          }}
          onPress={() => setEditingStatus(!editingStatus)}
        >
          {editingStatus ? (
            <FontAwesome5 name="pen-square" size={24} color="#858585" />
          ) : (
            <FontAwesome5 name="pen-square" size={24} color="black" />
          )}
        </Pressable>
        {editingStatus ? (
          <View>
            <View style={styles.list_items}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ marginLeft: 10, fontSize: 16 }}>
                  Tên tài khoản
                </Text>
                <Text style={{ color: "red" }}>*</Text>
              </View>
              <TextInput
                style={styles.input}
                onChangeText={setName}
                value={name}
              />
            </View>

            <View style={styles.list_items}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ marginLeft: 10, fontSize: 16 }}>Email</Text>
                <Text style={{ color: "red" }}>*</Text>
              </View>
              <Text style={styles.input}>{email}</Text>
            </View>

            <View style={styles.list_items}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ marginLeft: 10, fontSize: 16 }}>
                    Ngày sinh
                  </Text>
                  <Text style={{ color: "red" }}>*</Text>
                </View>
                
                <View style={{ flexDirection: "row", justifyContent:'space-between' }}>
                    <Text style={styles.input}>{dateOfBirth}</Text>
                  <Pressable onPress={showMode}>
                    <FontAwesome5 name="calendar-alt" size={24} color="black" />
                  </Pressable>
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode="date"
                      is24Hour={true}
                      display="default" 
                      onChange={onChange}
                    />
                  )}
                </View>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.list_items}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ marginLeft: 10, fontSize: 16 }}>
                  Tên tài khoản
                </Text>
                <Text style={{ color: "red" }}>*</Text>
              </View>
              <Text style={styles.input}>{name}</Text>
            </View>

            <View style={styles.list_items}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ marginLeft: 10, fontSize: 16 }}>Email</Text>
                <Text style={{ color: "red" }}>*</Text>
              </View>
              <Text style={styles.input}>{email}</Text>
            </View>

            <View style={styles.list_items}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ marginLeft: 10, fontSize: 16 }}>Ngày sinh</Text>
                <Text style={{ color: "red" }}>*</Text>
              </View>
              <Text style={styles.input}>{dateOfBirth}</Text>
            </View>
          </View>
        )}

        <Pressable
          style={styles.list_items}
          onPress={() => navigation.navigate("UpdatePassword")}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ marginLeft: 10, fontSize: 16 }}>
              Cập nhật mật khẩu
            </Text>
            <SimpleLineIcons
              marginLeft={15}
              name="arrow-right"
              size={10}
              color="#60698a"
            />
          </View>
        </Pressable>
      </View>

      <View style={{}}>
        <Button title="Lưu" color={color.origin} onPress={updateUserInfo} />
      </View>
    </View>
  );
};

export default UserInfoScreen;

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
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure the loading indicator is above the image
  },
  imageContainer: {
    position: "relative",
  },
});
