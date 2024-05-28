import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  BackHandler,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Feather,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import color from "../../components/color";

const AdminHomeScreen = ({ navigation, route }) => {
  const { admin } = route.params;
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Thông báo", "Xác nhận thoát trang quản trị viên?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => navigation.popToTop() },
      ]);
      return true;
    };

    const handleBackPress = () => {
      const currentRoute = navigation.getState().routes[navigation.getState().index].name;
      if (currentRoute === "AdminHome") {
        return backAction();
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => backHandler.remove();
  }, []);

  
  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <View
        style={{
          backgroundColor: color.origin,
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingTop:30,
        }}
      >
        <MaterialIcons name="space-dashboard" size={50} color="white" />
        <Text style={{ fontSize: 25, textAlign: "center", color: "white" }}>
          Admin Home
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View>
          <TouchableOpacity
            style={styles.list_items}
            onPress={() => 
              navigation.navigate("AdminList")
            }
          >
            <View style={styles.item}>
              <MaterialIcons
                name="manage-accounts"
                size={27}
                marginLeft={10}
                color={color.origin}
              />
              <Text style={styles.menuText}>Danh sách quản trị viên</Text>
            </View>
            <View
              style={{
                alignItems: "flex-end",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SimpleLineIcons
                marginLeft={15}
                name="arrow-right"
                size={10}
                color="#60698a"
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.list_items}
            onPress={() => navigation.navigate("CategoryManager")}
          >
            <View style={styles.item}>
              <MaterialCommunityIcons
                name="format-list-text"
                size={27}
                marginLeft={10}
                color={color.origin}
              />
              <Text style={styles.menuText}>Quản lý danh mục</Text>
            </View>

            <View
              style={{
                alignItems: "flex-end",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SimpleLineIcons
                marginLeft={15}
                name="arrow-right"
                size={10}
                color="#60698a"
              />
            </View>
          </TouchableOpacity>
          {/* Duyệt seller */}
          <TouchableOpacity
            style={styles.list_items}
            onPress={() => navigation.navigate("SellerRegister")}
          >
            <View style={styles.item}>
              <Ionicons
                name="bag-check"
                size={27}
                marginLeft={10}
                color={color.origin}
              />
              <Text style={styles.menuText}>Duyệt yêu cầu bán hàng</Text>
            </View>

            <View
              style={{
                alignItems: "flex-end",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SimpleLineIcons
                marginLeft={15}
                name="arrow-right"
                size={10}
                color="#60698a"
              />
            </View>
          </TouchableOpacity>
          {/* Hiển thị thống kê danh sách seller và doanh thu của seller theo tháng */}
          <TouchableOpacity
            style={styles.list_items}
            onPress={() => navigation.navigate("RevenueSeller")}
          >
            <View style={styles.item}>
              <Ionicons
                name="bar-chart"
                size={27}
                marginLeft={10}
                color={color.origin}
              />
              <Text style={styles.menuText}>Thống kê</Text>
            </View>

            <View
              style={{
                alignItems: "flex-end",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SimpleLineIcons
                marginLeft={15}
                name="arrow-right"
                size={10}
                color="#60698a"
              />
            </View>
          </TouchableOpacity>
          {/* Quản lý đơn vị vận chuyển */}
          <TouchableOpacity
            style={styles.list_items}
            onPress={() => navigation.navigate("DeliverList")}
          >
            <View style={styles.item}>
              <MaterialCommunityIcons
                name="truck-delivery"
                size={27}
                marginLeft={10}
                color={color.origin}
              />
              <Text style={styles.menuText}>Đơn vị vận chuyển</Text>
            </View>

            <View
              style={{
                alignItems: "flex-end",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SimpleLineIcons
                marginLeft={15}
                name="arrow-right"
                size={10}
                color="#60698a"
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={{
            margin: 10,
          borderWidth: 1,
          borderColor: "#e80707",
          padding: 10,
          alignItems: "center",
          backgroundColor: "white",
        }}
        onPress={() =>
          Alert.alert("Thông báo", "Xác nhận đăng xuất?", [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel",
            },
            { text: "YES", onPress: () => navigation.popToTop() },
          ])
        }
      >
        <Text style={{ color: "#e80707" }}>Đăng xuất</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AdminHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8e8e8",
  },
  scrollView: {
    flexGrow: 1,
    margin: 10,
  },
  list_items: {
    marginBottom: 5,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  item: {
    alignItems: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: { marginLeft: 10, fontSize: 18 },
});
