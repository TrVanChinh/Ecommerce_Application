import { TouchableOpacity, View, Image, Text, Dimensions, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

const ProductItem = ({ item, onPress  }) => {
  const { height, width } = Dimensions.get("window");

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"white",
        borderColor: "gray",
        margin: 5,
        borderRadius: 10,
      }}
    >
      <View>
        <Image
          style={{
            width: width*0.4,
            height: width*0.4,
            resizeMode: "cover",
            borderRadius: 25,
            margin: 10,
          }}
          source={{
            uri: item.image[0].url,
          }}
        />
      </View>
      <View style={{ width: 200, paddingBottom: 10 }}>
        <Text style={{ fontSize: 16, color: "black", textAlign: "center", }} numberOfLines={1}>
          {item.name}
        </Text>
        {/* {priceMin !== priceMax ? (
          <Text style={{ textAlign: "center", fontSize: 20, color: "red" }}>
            {priceMin}đ - {priceMax}đ
          </Text>
        ) : (
          <Text style={{ textAlign: "center", fontSize: 20, color: "red" }}>
            {priceMax}đ
          </Text>
        )} */}
        <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              color: "red",
            }}
          >
            {item.option[0].price} đ
          </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProductItem;

const styles = StyleSheet.create({});
