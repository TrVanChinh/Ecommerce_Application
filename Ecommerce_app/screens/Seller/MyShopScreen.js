import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  SimpleLineIcons,
  AntDesign,
  Entypo,
  Octicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import color from "../../components/color";
const MyShopScreen = ({ navigation }) => {
  // const 
  return (
    <View>
      {/* Thêm sp */}
      <TouchableOpacity
        style={styles.list_items}
        onPress={() => navigation.navigate("AddProduct")}
      >
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <AntDesign
            name="pluscircleo"
            size={25}
            marginLeft={10}
            color={color.origin}
          />
          <Text style={styles.txtMenuTag}> Thêm sản phẩm mới</Text>
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
      {/* DS san pham */}
      <TouchableOpacity
        style={styles.list_items}
        onPress={() => navigation.navigate("ListProducts")}
      >
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <AntDesign
            name="inbox"
            size={25}
            marginLeft={10}
            color={color.origin}
          />
          <Text style={styles.txtMenuTag}> Quản lý sản phẩm</Text>
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
      {/* Quản lý danh mục shop*/}
      {/* <TouchableOpacity style={styles.list_items} onPress={()=> navigation.navigate("ShopCategory")}>
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Entypo
            name="list"
            size={25}
            marginLeft={10}
            color={color.origin}
          />
          <Text style={styles.txtMenuTag}>Quản lý danh mục cửa hàng </Text>
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
      </TouchableOpacity> */}
      
      {/* Quản lý đơn hàng */}
      <TouchableOpacity style={styles.list_items} onPress={() => navigation.navigate("ShopOrders")}>
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesome5
            name="boxes"
            size={25}
            marginLeft={10}
            color={color.origin}
          />
          <Text style={styles.txtMenuTag}>Quản lý đơn hàng</Text>
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
      {/* Thống kê */}
      <TouchableOpacity style={styles.list_items} onPress={() => navigation.navigate("Statistic")}>
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <AntDesign
            name="barschart"
            size={25}
            marginLeft={10}
            color={color.origin}
          />
          <Text style={styles.txtMenuTag}>Thống kê</Text>
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
      {/* Thông tin cửa hàng */}
      <TouchableOpacity
        style={styles.list_items}
        onPress={() =>
          navigation.navigate("ShopInfo")
        }
      >
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="store-edit-outline"
            size={25}
            marginLeft={10}
            color={color.origin}
          />
          <Text style={styles.txtMenuTag}>Thông tin cửa hàng </Text>
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
  );
};
export default MyShopScreen;

const styles = StyleSheet.create({
  list_items: {
    marginVertical: 1,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  todo_list: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "top",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  todo_item: {
    alignItems: "center",
    paddingHorizontal: 5,
    width: "20%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e6e3e3",
  },
  todoItemText: {
    textAlign: "center",
  },
  numberTodoItem: {
    fontSize: 30,
    color: color.origin,
    fontWeight: "bold",
  },

  txtMenuTag: {
    fontSize: 16,
    marginLeft: 10,
    color: color.text,
  },
});
