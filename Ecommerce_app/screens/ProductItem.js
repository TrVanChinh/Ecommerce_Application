import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import React from 'react'

const ProductItem = ({item}) => {
    return (
        <TouchableOpacity
          onPress={() => {
            alert(`press ${item.price}`);
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View>
            <Image
              style={{
                width: 200,
                height: 200,
                resizeMode: "cover",
                borderRadius: 25,
                margin: 10,
              }}
              source={{
                uri: item.url,
              }}
            />
            <View
              style={{
                width: 50,
                position: "absolute",
                marginTop: 20,
                alignItems: "flex-end",
                backgroundColor: "red",
              }}
            >
              <Text style={{ color: "yellow" }}>{item.sale}</Text>
            </View>
          </View>
          <View style={{ width: 200, paddingBottom: 10 }}>
            <Text
              style={{ fontSize: 16, color: "black" }}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                color: "red",
              }}
            >
              {item.price}
            </Text>
          </View>
        </TouchableOpacity>
      );
}

export default ProductItem

const styles = StyleSheet.create({})