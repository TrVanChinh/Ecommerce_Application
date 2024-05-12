import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Dimensions,
  Alert,
  SafeAreaView,
} from "react-native";
import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useContext,
  useCallback,
} from "react";
import { Feather, AntDesign, Entypo } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "../UserContext";
import { API_BASE_URL } from "../Localhost";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderScreen = ({ navigation, route }) => {
  const { user, product, address, shippingUnit } = useUser();
  const idUser = user._id;
  const [transportationCost, setTransportationCost] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const { height, width } = Dimensions.get("window");
  const [listProducts, setListProducts] = useState([]);

  console.log(shippingUnit)

  const handleDataProduct = async () => {
    const retrievedValue = await AsyncStorage.getItem('productsAreOrdered');
    const productOrder = JSON.parse(retrievedValue);
    const groupedProducts = {};
    //Nhóm từng sản phẩm theo id của shop
    productOrder.forEach((productOrderItem) => {
      const idShop = productOrderItem.product.idShop;
      if (!groupedProducts[idShop]) {
        groupedProducts[idShop] = {
          products: [],
          totalByShop: 0,
          idShop: idShop,
        };
      }
      groupedProducts[idShop].products.push(productOrderItem);
      // console.log(groupedProducts[idShop].products)
    });
    const updatedListProducts = Object.values(groupedProducts).map((group) => {
      const { products, idShop } = group;
      let total = 0;

      //Tính tổng giá trị của sản phẩm trong nhóm
      products.forEach((item) => {
        total += item.quantity * item.option.price;
      });

      // Thêm trường totalByShop vào mỗi phần tử trong nhóm sản phẩm
      // const updatedProducts = products.map((item) => ({ ...item }));
      // updatedProducts.forEach((item) => delete item.totalByShop);

      return {
        products: products,
        totalByShop: total,
        idShop: idShop,
      };
    });
    setListProducts(updatedListProducts);

    // updatedListProducts.forEach((group) => {
    //   group.products.forEach((item) => {
    //     console.log(item.product.id);
    //   });
    // });

    //Tính tổng hóa đơn
    let total = 0;
    if (shippingUnit) {
      // console.log("updatedListProducts", updatedListProducts);
      updatedListProducts.forEach((group) => {
        // console.log("group", group.products)
        total += group.totalByShop + shippingUnit.price;
      });
    } else {
      updatedListProducts.forEach((group) => {
        ;
        total += group.totalByShop;
      });
    }

    setTotalBill(total);
  };

  //Tính tổng tiền chưa có phí vận chuyển
  // const calculateTotal = () => {
  //   let total = 0;
  //   product.forEach(item => {
  //       total += item.quantity * item.data.price;
  //   });
  //   setTotalBill(total + transportationCost)
  // };
  useFocusEffect(
    React.useCallback(() => {
      console.log("Trang Order đã được tập trung");
      if (shippingUnit) {
        console.log("Ship bow", shippingUnit.price);
        setTransportationCost(shippingUnit.price);
      } else {
        setTransportationCost(0);
      }
      handleDataProduct();
    }, [product, shippingUnit])
  );

const SaveOrder = async (shippingCost) => {
  if (!address) {
    alert("Vui lòng chọn địa chỉ nhận hàng!")
  } else if (!shippingUnit) {
    alert("Vui lòng chọn đơn vị vận chuyển!")
  } else {
    try {
      const CartInfo = [];
      for (const group of listProducts) {
        const orderInfo = {
          totalByShop: group.totalByShop + shippingCost,
          idUser: idUser, 
          address: address,
          idShop: group.idShop,
          idShippingUnit: shippingUnit._id,
          nameShippingUnit: shippingUnit.name,
          shippingCost: shippingUnit.price,
          option: []
        };

        for (const product of group.products) {
          console.log(product)
          const optionInfo = {
            // name: product.product.name - product.option.name,
            idOption: product.option._id,
            idProduct: product.product._id,
            quantity: product.quantity,
            price: product.option.price,
          };

          orderInfo.option.push(optionInfo)
          CartInfo.push({
            cartId: product._id, 
            userId: idUser
          })
        }
        axios.post(`${API_BASE_URL}/user/order`,orderInfo).then((response) => {
            if (response.data.status === "FAILED") {
              alert(response.data.message); 
              console.log(response.data.message);
            } else {
              console.log(response.data.message);
            }
          })
          .catch((error) => {
            alert("error order")
            console.log(error) 
          })
        // console.log(CartInfo)
      }
      await processCartRemovals(CartInfo); // Gọi hàm xử lý xóa giỏ hàng với thời gian chờ giữa các lần xóa
      Alert.alert(
        '',
        `Đặt hàng thành công.`,
        [
          { text: 'OK', onPress: () => navigation.navigate("Main")  },
        ],
        { cancelable: false } 
      )
    } catch (error) {
      console.error('Lỗi khi Đặt hàng', error);
    }
  }
};

const processCartRemovals = async (CartInfo) => {
  for (const cart of CartInfo) {
    await removeFromCart(cart.cartId, cart.userId); // Gửi yêu cầu xóa
    await delay(500); // Đợi 1 giây trước khi gửi yêu cầu xóa tiếp theo
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const removeFromCart = async (cartId, userId) => {
  try {
    const productInfo = {
      cartId: cartId,
      userId: userId,
    }
    await axios.post(`${API_BASE_URL}/cart/removeFromCart`,productInfo);
  } catch (error) {
    throw new Error("Xảy ra lỗi khi xóa sản phẩm từ giỏ hàng");
  }
};

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <View >
          {address ? (
            <Pressable
              style={{
                borderWidth: 1,
                borderColor: "#D0D0D0",
                padding: 10,
                flexDirection: "column",
                gap: 5,
                // marginVertical: 10,
              }}
              onPress={() => navigation.navigate("Address")}
            >
              <View style={{ flexDirection: "row" }}>
                <Entypo name="location-pin" size={24} color="red" />
                <View>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Địa chỉ đặt hàng
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {address.name} | {address.phoneNumber}
                  </Text>
                  <Text style={{ fontSize: 15, color: "#181818" }}>
                    {address.street}
                  </Text>

                  <Text style={{ fontSize: 15, color: "#181818" }}>
                    {address.Ward}, {address.District}, {address.Provinces}
                  </Text>
                </View>
              </View>
            </Pressable>
          ) : (
            <Pressable
              style={{
                borderWidth: 1,
                borderColor: "#D0D0D0",
                padding: 10,
                flexDirection: "column",
                gap: 5,
                marginVertical: 10,
              }}
              onPress={() => navigation.navigate("Address")}
            >
              <View style={{ flexDirection: "row" }}>
                <Entypo name="location-pin" size={24} color="red" />
                <View>
                  <Text style={{ fontSize: 15, color: "#181818" }}>
                    Chọn địa chỉ nhận hàng
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
            

          {shippingUnit ? (
            <Pressable
              style={{
                borderWidth: 1,
                borderColor: "#D0D0D0",
                padding: 10,
                gap: 5,
                marginVertical: 5,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("ShippingUnit")}
            >
              <View style={{ width: width * 0.7 }}>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {shippingUnit.name}
                </Text>
                <Text style={{ fontSize: 15, color: "#181818" }}>
                  Thời gian vận chuyển: {shippingUnit.deliveryTime} ngày
                </Text>
              </View>
              <View>
                <Text style={{ color: "red" }}>
                  Giá: {shippingUnit.price}đ
                </Text>
              </View>
            </Pressable>
          ) : (
            <Pressable
              style={{
                flexDirection: "row",
                padding: 10,
                alignItems: "center",
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: "#D0D0D0",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
              onPress={() => navigation.navigate("ShippingUnit")}
            >
              <Text>Chọn đơn vị vận chuyển:</Text>
              <AntDesign name="right" size={24} color="#D0D0D0" />
            </Pressable>
          )}

          <View
            style={{
              flexDirection: "row",
              padding: 10,
              alignItems: "center",
              borderTopWidth: 1,
              borderColor: "#D0D0D0",
              justifyContent: "space-between",
            }}
          >
            <Text>Phương thức thanh toán:</Text>
            <Pressable
              style={{
                flexDirection: "row",
              }}
            >
              <Text>Thanh toán khi nhân hàng</Text>
              <AntDesign name="right" size={24} color="#D0D0D0" />
            </Pressable>
          </View>
        </View>
        {listProducts?.map((group, index) => (
          <View style={{ borderTopWidth: 2, borderColor: "green" }} key={index}>
            <View style={{ marginHorizontal: 10 }}>
              {group.products?.map((item, index) => (
                // setTotalByShop(item.totalByShop),
                <View
                  key={item._id}
                  style={{
                    backgroundColor: "white",
                    marginVertical: 10,
                    borderBottomColor: "#F0F0F0",
                    borderWidth: 2,
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                    borderRightWidth: 0,
                  }}
                >
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
                        style={{
                          width: 100,
                          height: 120,
                          resizeMode: "contain",
                        }}
                        source={{ uri: item?.option.imageUrl }}
                      />
                    </View>

                    <View>
                      <Text
                        numberOfLines={3}
                        style={{
                          width: width / 1.6,
                          fontSize: 16,
                          marginTop: 10,
                        }}
                      >
                        {item?.product.name} | {item?.option.name}
                      </Text>
                      <Text
                        style={{
                          color: "red",
                          fontSize: 15,
                          fontWeight: "bold",
                          marginTop: 6,
                        }}
                      >
                        {item?.option.price} đ
                      </Text>
                      <Text>X{item.quantity}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* <View
              style={{
                flexDirection: "row",
                padding: 10,
                alignItems: "center",
                borderTopWidth: 1,
                borderColor: "#D0D0D0",
              }}
            >
              <Text>Tin nhắn:</Text>
              <TextInput
                onChangeText={(text) => {
                  setMessage(text);
                }}
                style={{
                  height: 35,
                  flex: 1,
                  paddingStart: 20,
                }}
                autoCorrect={false}
                placeholder="Lưu ý cho người bán..."
              />
            </View> */}

            <View
              style={{
                flexDirection: "row",
                padding: 10,
                alignItems: "center",
                borderTopWidth: 1,
                borderColor: "#D0D0D0",
                justifyContent: "space-between",
              }}
            >
              <Text>Voucher vận chuyển:</Text>
              <Pressable
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    color: "green",
                    borderColor: "green",
                    borderWidth: 1,
                    padding: 2,
                  }}
                >
                  Miễn phí vận chuyển
                </Text>
                <AntDesign name="right" size={24} color="#D0D0D0" />
              </Pressable>
            </View>

            <View
              style={{
                flexDirection: "row",
                padding: 10,
                alignItems: "center",
                borderTopWidth: 1,
                borderColor: "#D0D0D0",
                justifyContent: "space-between",
              }}
            >
              <Text>Voucher của Shop:</Text>
              <Pressable
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    color: "red",
                    borderColor: "red",
                    borderWidth: 1,
                    padding: 2,
                  }}
                >
                  Giảm giá sản phẩm
                </Text>
                <AntDesign name="right" size={24} color="#D0D0D0" />
              </Pressable>
            </View>

            <View
              style={{
                flexDirection: "row",
                padding: 10,
                alignItems: "center",
                borderTopWidth: 1,
                borderColor: "#D0D0D0",
                justifyContent: "space-between",
              }}
            >
              <View style={{ padding: 10 }}>
                <Text>Tổng tiền hàng:</Text>
                <Text>Giảm giá tiền hàng:</Text>
                <Text>Tổng tiền phí vận chuyển:</Text>
                <Text>Giảm giá phí vận chuyển:</Text>
                <Text style={{ fontSize: 18, color: "red" }}>
                  Tổng thanh toán:
                </Text>
              </View>
              <View style={{ padding: 10 }}>
                <Text style={{ textAlign: "right" }}>
                  {group.totalByShop} đ
                </Text>
                <Text style={{ textAlign: "right" }}>0 đ</Text>
                <Text style={{ textAlign: "right" }}>
                  {transportationCost} đ
                </Text>
                <Text style={{ textAlign: "right" }}>- 0 đ</Text>
                <Text
                  style={{ fontSize: 18, color: "red", textAlign: "right" }}
                >
                  {group.totalByShop + transportationCost} đ
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View
        style={{
          height: height / 12,
          flexDirection: "row",
          padding: 5,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            paddingLeft: 30,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "300" }}>Tổng cộng :</Text>
          <Text
            style={{
              fontSize: 17,
              paddingLeft: 10,
              color: "red",
              fontWeight: "300",
            }}
          >
            {totalBill} đ
          </Text>
        </View>
        <Pressable
          onPress={() => SaveOrder(transportationCost)}
          style={{
            backgroundColor: "red",
            padding: 10,
            marginLeft: 10,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            width: 100,
          }}
        >
          <Text style={{ color: "white" }}>Đặt hàng</Text>
        </Pressable>
      </View>
    </>
    );
};

export default OrderScreen;

const styles = StyleSheet.create({});
