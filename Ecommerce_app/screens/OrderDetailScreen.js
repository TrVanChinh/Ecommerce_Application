import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import React from "react";

const OrderDetailScreen = ({ route }) => {
  const { order } = route.params;
  const { height, width } = Dimensions.get("window");

  return (
    <View
      style={{
        backgroundColor: "white",
        marginBottom: 10,
        paddingHorizontal: 10,
        justifyContent:'center'
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text style={{ width: 120, fontSize: 16, fontWeight:'bold', marginTop: 10 }}>MÃ ĐƠN HÀNG:</Text>
        <Text
          style={{ color: "#18CFCB", width: 260, fontSize: 18, marginTop: 10 }}
        >
          {order?._doc._id}
        </Text>
      </View>
      {order &&
        order.option &&
        order.option.map((data, index) => (
          <View key={index}>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  paddingRight: 10,
                }}
              >
                <Image
                  style={{ width: 100, height: 120, resizeMode: "contain" }}
                  source={{ uri: data?.imageUrl }}
                />
              </View>

              <View>
                <Text
                  numberOfLines={3}
                  style={{ width: 250, fontSize: 16, marginTop: 10 }}
                >
                  Sản phẩm: {data?.nameProduct}
                </Text>
                <Text
                  numberOfLines={3}
                  style={{ width: 250, fontSize: 16, marginTop: 10 }}
                >
                  Loại: {data?.nameOption}
                </Text>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", marginTop: 6 }}
                >
                  Giá: {data?.price}đ
                </Text>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", marginTop: 6 }}
                >
                  Số lượng: {data?.quantity}
                </Text>
              </View>
            </View>
          </View>
        ))}
      <View>
        <View
          style={{
            padding: 10,
            flexDirection: "column",
          }}
        >
          <View style={{ flexDirection: "row" ,paddingTop:10}}>
            <View>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                Thông tin người mua:
              </Text>
              <Text style={{ fontSize: 15 }}>
                Tên người nhận: {order._doc.address[0].name} 
              </Text>
              <Text style={{ fontSize: 15}}>
                sđt: {order._doc.address[0].mobileNo}
              </Text>
              <Text style={{ fontSize: 15, color: "#181818" }}>
                địa chỉ: {order._doc.address[0].street}, {order._doc.address[0].Ward} 
              </Text>
              <Text style={{ fontSize: 15, color: "#181818" }}>
                {order._doc.address[0].District}, {order._doc.address[0].Provinces} {order._doc.address[0].city}
              </Text>
              <Text style={{ fontSize: 15 }}>
                Thời gian: {order._doc.createAt} 
              </Text>
            </View>
          </View>
        </View>

        <View style={{ padding: 10}}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Đơn vị vận chuyển: 
          </Text>
          <Text style={{ fontSize: 15 }}>
            {order._doc.nameShippingUnit}
          </Text>
          <Text style={{ color: "red" }}>Giá: {order._doc.shippingCost}đ</Text>

        </View>
        <Text
          style={{
            color: "red",
            fontSize: 15,
            alignSelf: "center",
            fontWeight: "bold",
            padding: 6,
          }}
        >
          Tổng đơn hàng: {order._doc.totalByShop}đ
        </Text>
      </View>
    </View>
    // <View>
    //   <Text>Tee</Text>
    // </View>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({});
