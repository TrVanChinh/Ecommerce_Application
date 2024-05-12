import { StyleSheet, Text, View, Pressable , Image} from "react-native";
import React from "react";

const OrdersItem = ({ item, onPress }) => {
  return (
    <Pressable
        style={{
          backgroundColor: "white", 
          marginBottom: 10,
          borderBottomColor: "#F0F0F0",
          borderWidth: 2,
          borderLeftWidth: 0,
          borderTopWidth: 0,
          borderRightWidth: 0,
        }}
      onPress={onPress}
    >
      <View
        style={{
          flexDirection:"row",
          flex:1,
          paddingBottom: 10,
        }}
      >
        <Text
            style={{ width: 150, fontSize: 16, marginTop: 10 }}
          >
            MÃ ĐƠN HÀNG:
        </Text>
        <Text
            style={{color:"#18CFCB" , width: 260, fontSize: 16, marginTop: 10}}
          >
            {item?._doc._id} 
        </Text>
      </View>
      
  {item && item.option && item.option.map((data, index) => (
    <View
     key = {index}
    >
      <Pressable
        style={{
          flexDirection: "row",
        }}
        // onPress={() =>  navigation.navigate('Detail', {product: item.product})}
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
      </Pressable>
    </View>
  ))}
    <Text
      style={{
        color: "red",
        fontSize: 15,
        alignSelf: "center", 
        fontWeight: "bold",
        padding: 6,
      }}
    >
      Tổng đơn hàng: {item._doc.totalByShop}đ
    </Text>
    </Pressable>

  );
};

export default OrdersItem;

const styles = StyleSheet.create({});
