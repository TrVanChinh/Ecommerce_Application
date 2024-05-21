import {
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
  ScrollView,
  View,
  Image,
  Alert,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Feather,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
  FontAwesome6,
  FontAwesome ,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import color from "../components/color";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "../UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import { API_BASE_URL } from "../Localhost";
import axios from "axios";

const ProfileScreen = ({ navigation, route }) => {
  const { updateUser, user } = useUser();
  const isFocused = useIsFocused();
  // const showItems = () => {
  //   console.log(user);
  // };
  useEffect(() => {
    if (isFocused) {
      getShopInfo();
    }
  }, [isFocused]);
  const getShopInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/shop/user/${user?._id}`);
      const data = response.data;
      console.log("Shop info:", data.data);

      updateUser(response.data.data);
      // setSeller(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = async () => {
    updateUser(null);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.upperView}>
          <View style={styles.buttonContainer}>
            {/* nut cai dat */}
            <TouchableOpacity style={styles.button}>
              <Feather name="settings" size={24} color="white" />
            </TouchableOpacity>
            {/* nut gio hang */}
            <TouchableOpacity style={styles.button}>
              <AntDesign name="shoppingcart" size={25} color="white" />
              <View
                style={{
                  position: "absolute",
                  top: 1,
                  right: -3,
                  backgroundColor: color.origin,
                  borderRadius: 10,
                  borderColor: "white",
                  borderWidth: 1,
                  width: 30,
                  height: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 12 }}>99+</Text>
              </View>
            </TouchableOpacity>
            {/* nut nhan tin */}
            <TouchableOpacity style={styles.button}>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={24}
                color="white"
              />

              <View
                style={{
                  position: "absolute",
                  top: 1,
                  right: -3,
                  backgroundColor: color.origin,
                  borderRadius: 10,
                  borderColor: "white",
                  borderWidth: 1,
                  width: 30,
                  height: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 12 }}>99+</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {/* Area avt, username */}
            {user ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    padding: 15,
                  }}
                >
                  <View
                    style={{
                      borderRadius: 100,
                      backgroundColor: "white",
                    }}
                  >
                    <Image
                      source={{
                        uri: user?.avatarUrl || null,
                      }}
                      style={styles.avt_image}
                    />
                  </View>
                  <View
                    style={{ marginLeft: 10, justifyContent: "space-between" }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      {user.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        backgroundColor: "#d3ddde",
                        paddingHorizontal: 3,
                        borderRadius: 10,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#424852",
                          fontSize: 12,
                          marginLeft: 10,
                        }}
                      >
                        Thành viên bạc
                      </Text>
                      <SimpleLineIcons
                        marginLeft={15}
                        padding={5}
                        name="arrow-right"
                        size={10}
                        color="#60698a"
                      />
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ color: "white", fontSize: 14 }}>
                        Người theo dõi
                      </Text>
                      <Text
                        style={{
                          marginLeft: 5,
                          color: "white",
                          fontWeight: "bold",
                          fontSize: 14,
                        }}
                      >
                        2
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* Area nut dang nhap, dang ki */}
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  {/* btn dang nhap */}
                  <TouchableOpacity
                    style={styles.btn_login}
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text style={{ color: "white" }}>Đăng nhập</Text>
                  </TouchableOpacity>
                  {/* btn dang ki */}
                  <TouchableOpacity
                    style={styles.btn_login}
                    onPress={() => navigation.navigate("Register")}
                  >
                    <Text style={{ color: "white" }}>Đăng kí</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            padding: 12,
            backgroundColor: "white",
          }}
        >
          <Pressable
            style={{ flex: 1, alignItems: "center" }}
            onPress={() => user ? navigation.navigate("PurchaseOrder") : navigation.navigate("Login")}
          >
            <Ionicons name="wallet-outline" size={24} color={color.origin} />
            <Text style={styles.text_order}>Chờ xác nhận</Text>
          </Pressable>
          <Pressable style={{ flex: 1, alignItems: "center" }}>
            <AntDesign name="inbox" size={24} color={color.origin} />
            <Text style={styles.text_order}>Chờ lấy hàng</Text>
          </Pressable>
          <Pressable style={{ flex: 1, alignItems: "center" }}>
            <MaterialCommunityIcons
              name="truck-delivery-outline"
              size={24}
              color={color.origin}
            />
            <Text style={styles.text_order}>Chờ giao hàng</Text>
          </Pressable>
          <Pressable style={{ flex: 1, alignItems: "center" }}>
            <MaterialIcons name="star-rate" size={24} color={color.origin} />
            <Text style={styles.text_order}>Đánh giá</Text>
          </Pressable>
        </View>

        <View style={styles.lowerView}>
          <TouchableOpacity
            style={styles.list_items}
            onPress={() =>
              !user
                ? Alert.alert("Thông báo", "Vui lòng đăng nhập trước")
                :user.sellerRequestStatus == "PENDING"
                ? Alert.alert("Thông báo", "Đang chờ duyệt")
                :user.sellerRequestStatus == "SUCCESS"
                ? navigation.navigate("MyShop")
                : navigation.navigate("RegisterSeller")
            }
          >
            <View style={styles.item}>
              <Entypo
                name="shop"
                size={25}
                marginLeft={10}
                color={color.origin}
              />
              <Text style={{ marginLeft: 10, fontSize: 16 }}>
                {!user
                  ? "Đăng ký bán hàng"
                  : user.sellerRequestStatus == "PENDING"
                  ? "Đang chờ duyệt"
                  : user.sellerRequestStatus == "SUCCESS"
                  ?"Quản lý cửa hàng"
                  : "Đăng ký bán hàng"}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.list_items}
            onPress={() =>
              user
                ? navigation.navigate("UserInfo")
                : Alert.alert("Thông báo", "Vui lòng đăng nhập trước", [
                    {
                      text: "OK",
                      onPress: () => {
                        navigation.navigate("Login");
                      },
                    },
                  ])
            }
          >
            <View style={styles.item}>
              <FontAwesome6
                name="circle-user"
                size={25}
                marginLeft={10}
                color={color.origin}
              />
              <Text style={{ marginLeft: 10, fontSize: 16 }}>
                Thông tin tài khoản
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.list_items}
            onPress={() =>
              user
                ? navigation.navigate("ExpenditureStatistics")
                : Alert.alert("Thông báo", "Vui lòng đăng nhập trước", [
                    {
                      text: "OK",
                      onPress: () => {
                        navigation.navigate("Login");
                      },
                    },
                  ])
            }
          >
            <View style={styles.item}>
              <FontAwesome
                name="bar-chart"
                size={24}
                marginLeft={10}
                color={color.origin}
              />
              <Text style={{ marginLeft: 10, fontSize: 16 }}>
                Thống kê chi tiêu
              </Text>
            </View>
          </TouchableOpacity>
          {/* if user is not null, show logout button */}
          {user ? (
            <TouchableOpacity style={styles.logoutbtn} onPress={handleLogout}>
              <Text style={{ color: "white", fontSize: 16 }}>Đăng xuất</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  upperView: {
    flex: 2,
    backgroundColor: color.origin,
  },
  lowerView: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  avt_image: {
    width: 70,
    height: 70,
    borderRadius: 100,
    padding: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 8,
  },
  item: {
    alignItems: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  btn_login: {
    width: 100,
    borderWidth: 1,
    borderColor: "white",
    alignItems: "center",
    paddingVertical: 10,
    marginVertical: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  list_items: {
    marginVertical: 1,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  text_order: {
    fontSize: 12,
    color: color.origin,
  },
  logoutbtn: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: "red",
  },
});
