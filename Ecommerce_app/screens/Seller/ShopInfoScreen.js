import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import { Button } from "react-native-elements";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import color from "../../components/color";
import { useUser } from "../../UserContext";
import { API_BASE_URL } from "../../Localhost";
import axios from "axios";

const ShopInfoScreen = ({ navigation, route }) => {
  const { updateUser, user } = useUser();
  const [avatar, setAvatar] = useState(user.avatarUrl);
  const [seller, setSeller] = useState(null);
  const [shopName, setShopName] = useState(user.shopName);
  const [address, setAddress] = useState(user.shopAddress);
  const [shopDescript, setShopDescript] = useState(user.shopDescript);
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // console.log("User:", user);
  }, []);

  useEffect(() => {}, [seller]);
  // Update state inside the useEffect when data is fetched

  useEffect(() => {
    // Log giá trị mới của loaiHangImg sau mỗi lần cập nhật
    console.log(avatar);
  }, [avatar]);

  const getShopInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/shop/user/${user._id}`);
      const data = response.data;
      console.log("Shop info:", data.data);

      updateUser(response.data.data);
      // setSeller(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const updateShopInfo = async () => {
    try {
      if (shopName === "" || address === "" || shopDescript === "") {
        Alert.alert("Thông báo", "Không được để trống");
      } else {
        Alert.alert("Thông báo", "Cập nhật thành công");
        setIsUpdating(true);
        const response = await axios.put(`${API_BASE_URL}/seller/updateShop`, {
          id: user._id,
          avatarUrl: avatar,
          shopName: shopName,
          shopAddress: address,
          shopDescript: shopDescript,
        });
        // console.log("Result", response);
        getShopInfo();
        setIsUpdating(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const changeAvatar = async () => {
    if (loading === false) {
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
        const imageData = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        formData.append(`images`, {
          uri: imageUri,
          type: "image/jpeg",
          name: `image.jpg`,
          data: result.assets[0].base64,
        });

        // Gửi yêu cầu POST để tải lên tất cả các hình ảnh
        const response = await axios.post(
          `${API_BASE_URL}/upload/productImage`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Log kết quả và trả về URL của tất cả các hình ảnh đã tải lên
        console.log("Images uploaded successfully:", response.data.imageUrls[0]);
        const response2 = await axios.put(`${API_BASE_URL}/seller/updateShop`, {
          id: user._id,
          avatarUrl:  response.data.imageUrls[0],
          shopName: shopName,
          shopAddress: address,
          shopDescript: shopDescript,
        });
        // console.log("Result", response);
        setAvatar(response.data.imageUrls[0]);
        getShopInfo();
        setLoading(false);
        Alert.alert("Thông báo", "Cập nhật ảnh đại diện thành công");
      }
    }
  };

  const showItems = async () => {
    console.log(avatar);
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
                  backgroundColor: "white",
                  padding: 5,
                  alignSelf: "center",
                  marginTop: -24,
                  marginLeft: 60,
                  borderWidth: 1,
                  borderColor: "gray",
                  borderRadius: 100,
                  shadowColor: "black",
                  shadowOffset: {
                    width: 5,
                    height: 5,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 7.49,
                  elevation: 3,
                }}
                onPress={changeAvatar}
              >
                <FontAwesome5 name="exchange-alt" size={15} color="gray" />
              </TouchableOpacity>
            </View>
          </>
        )}
        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Tên cửa hàng</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={setShopName}
            value={shopName}
          />
        </View>

        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Mô tả cửa hàng</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={setShopDescript}
            value={shopDescript}
          />
        </View>
        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Địa chỉ</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={setAddress}
            value={address}
          />
        </View>

        {/* <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Số điện thoại</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <Text style={styles.input}>{phoneNumber}</Text>
        </View> */}
      </View>

      <View style={{}}>
        <Button title="Lưu" color={color.origin} onPress={updateShopInfo} />
      </View>
      {isUpdating && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.origin} />
        </View>
      )}
    </View>
  );
};

export default ShopInfoScreen;

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
