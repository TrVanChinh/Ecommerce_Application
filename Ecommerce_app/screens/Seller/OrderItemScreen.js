import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Image } from "react-native-elements";
import { API_BASE_URL } from "../../Localhost";
import axios from "axios";
import { useUser } from "../../UserContext";

const OrderItemScreen = ({ navigation, route }) => {
  const { order: order } = route.params;
  // const [order, setOrder] = useState({});
  // const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const deliveredOrder = async () => {
    try {
      const res = await axios.put(`${API_BASE_URL}/order/changeStatusOrder`, {
        orderId: order.id,
        status: "delivered",
      });
      if (res.status === 200) {
        Alert.alert("Thông báo", "Đã giao hàng thành công");
        navigation.navigate("ShopOrders");
      }
    } catch (error) {
      console.error("Error delivered order:", error);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    order.option.map((item) => {
      total += item.price * item.quantity;
    });
    // return total;\
    return formatPrice(total);
  };

  const formatPrice = (price) => {
    // Sử dụng Intl.NumberFormat để định dạng số thành chuỗi với dấu ngăn cách hàng nghìn
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.listItem}>
        <Text style={styles.textTitle}>
          Trạng thái đơn hàng:{" "}
          {order.status == "processing"
            ? "Đã đặt hàng"
            : order.status == "paid"
            ? "Đã thanh toán"
            : order.status == "delivered"
            ? "Đã giao hàng"
            : order.status == "completed"
            ? "Đã hoàn thành"
            : "Đã hủy"}
        </Text>
        <Text style={styles.textItem}>Mã đơn hàng: {order.id}</Text>
        <Text style={styles.textItem}>Người đặt hàng: {order.buyerName}</Text>
        <Text style={styles.textItem}>
          Ngày đặt hàng: {order.createAt.substring(0, 10)}
        </Text>
      </View>

      <View style={styles.listItem}>
        <Text style={styles.textTitle}>Thông tin giao hàng</Text>
        <Text style={styles.textItem}>
          Người nhận hàng: {order.address[0].name}
        </Text>
        <Text style={styles.textItem}>
          Số điện thoại: {order.address[0].mobileNo}
        </Text>
        <Text style={styles.textItem}>
          Địa chỉ nhận hàng:{" "}
          {order.address[0].street +
            ", " +
            order.address[0].Ward +
            ", " +
            order.address[0].District +
            ", " +
            order.address[0].city}
        </Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.textTitle}>Thông tin sản phẩm</Text>
        {order.option.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.orderItems,
              { borderTopWidth: 1, borderColor: "lightgray" },
            ]}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: 50, height: 50 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.prdName}>{item.productName}</Text>
              <Text style={styles.prdOption}>Loại: {item.optionName}</Text>
              <Text style={styles.prdQty}>Số lượng: {item.quantity}</Text>
              <Text style={styles.prdPrice}>
                Giá: {formatPrice(item.price)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        <Text
          style={[
            styles.prdPrice,
            { fontWeight: "bold", fontSize: 16, marginTop: 5 },
          ]}
        >
          Tổng tiền sản phẩm:
          {calculateTotal()}
        </Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.textTitle}>Thông tin vận chuyển {}</Text>
        <Text style={styles.textItem}>
          Đơn vị vận chuyển: {order.nameShippingUnit}
        </Text>
        <Text style={styles.textItem}>
          Phí vận chuyển: {formatPrice(order.shippingCost)}
        </Text>
      </View>
      <View
        style={{
          // flexDirection: "row",
          alignItems: "center",
          // position: "absolute",
          backgroundColor: "white",
          padding: 10,
          bottom: 0,
          justifyContent: "space-between",
          width: "100%",
          // alignSelf: "flex-end",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            alignSelf: "center",
            color: "red",
            fontSize: 20,
            flex: 2,
          }}
        >
          Thành tiền: {formatPrice(order.totalByShop)}
        </Text>
      </View>
      {order.status === "paid" || order.status === "processing" ? (
        <TouchableOpacity
          style={styles.btnStatus}
          onPress={() => deliveredOrder()}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {order.status === "paid" || order.status === "processing"
              ? "Đã giao hàng"
              : "Đã giao hàng"}
          </Text>
        </TouchableOpacity>
      ) : null}
      {/* {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )} */}
    </ScrollView>
  );
};

export default OrderItemScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  listItem: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 5,
  },
  textItem: {
    // fontWeight: "bold",
    marginLeft: 25,
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 5,
    marginLeft: 10,
  },
  orderItems: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    // padding: 20,
    // marginVertical: 8,
    backgroundColor: "white",
  },
  prdName: {
    marginLeft: 10,
    fontWeight: "bold",
  },
  prdOption: {
    marginLeft: 10,
  },
  prdPrice: {
    // width: "20%",
    color: "red",
    alignSelf: "flex-end",
  },
  prdQty: {
    marginLeft: 10,
  },
  btnStatus: {
    backgroundColor: "red",
    padding: 10,
    alignItems: "center",
    margin: 50,
  },
});
