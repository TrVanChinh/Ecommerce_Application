import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Feather,
  Entypo,
} from "@expo/vector-icons";
import slides from "../slide/slides";
import { useRoute } from "@react-navigation/native";
import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";
import { useUser } from "../UserContext";
import { API_BASE_URL } from "../Localhost";
import axios from "axios";
const DetailScreen = ({ navigation, route }) => {
  const { height, width } = Dimensions.get("window");
  const [selectIndex, setSelectIndex] = useState(0);
  const { product } = route.params;
  const [listImage, setListImage] = useState([]);
  const [shop, setShop] = useState([]);
  const [idOption, setIdOption] = useState();
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [buyButtonClicked, setBuyButtonClicked] = useState(false);
  const productId = product._id;
  const { user } = useUser();

  useEffect(() => {
    fetchDataShop();
  }, []);

  const fetchDataShop = () => {
    axios
      .get(`${API_BASE_URL}/detail/shop/${product.idShop}`)
      .then((response) => {
        setShop(response.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addToCart = async (userId, productId, optionProductId, quantity) => {
    const ProductInfo = {
      optionProductId: optionProductId,
      productId: productId,
      quantity: quantity,
      userId: userId,
    }
    axios.post(`${API_BASE_URL}/product/addCart`,ProductInfo).then((response) => {
      if (response.data.status === "FAILED") {
        alert(response.data.message); 
        console.log(response.data.message);
      } else {
       alert(response.data.message);
      }
    })
    .catch((error) => {
      alert("Login Error")
      console.log(error)
    })
  };

  const handleShop = (idShop) => {
    navigation.navigate("Shop", { idShop});
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ height: height / 2 }}>
            <FlatList
              pagingEnabled
              horizontal
              onScroll={(e) => {
                setSelectIndex(
                  (e.nativeEvent.contentOffset.x / width).toFixed(0)
                );
              }}
              data={product.image}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                return (
                  <Image
                    style={{
                      width: width,
                      height: height / 2,
                    }}
                    // source={item.image}
                    source={{ uri: item.url }}
                  />
                );
              }}
            />
            <View
              style={{
                width: width,
                height: 40,
                position: "absolute",
                bottom: 0,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {listImage.map((slide, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      backgroundColor:
                        selectIndex == index ? "#8e8e8e" : "#f2f2f2",
                      height: 5,
                      width: 30,
                    }}
                  ></View>
                );
              })}
            </View>
          </View>
          <View
            style={{
              position: "absolute",
              flexDirection: "row",
              alignItems: "center",
              padding: 20,
            }}
          >
            <Ionicons
              name="chevron-back-circle"
              size={30}
              color="#858585"
              style={{}}
            />
            <View style={{ flex: 1 }} />
            <Ionicons name="cart" size={30} color="#858585" right={0} />
          </View>
          <View style={{ paddingBottom: 10, paddingLeft: 5 }}>
            <Text style={{ fontSize: 20 }}>{product.name}</Text>
            <Text style={{ color: "red", fontSize: 20 }}>
              {product.option[0].price}đ
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              paddingBottom: 10,
              paddingLeft: 5,
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Entypo name="star" size={24} color="yellow" />
              <Text>4.9</Text>
            </View>
            <Text style={{ flex: 1 }}>Đã bán 1.2k</Text>
            <View style={{ flex: 1, flexDirection: "row", paddingStart: 40 }}>
              <TouchableOpacity
                style={{ alignItems: "center", paddingRight: 20 }}
              >
                <AntDesign name="hearto" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: "center" }}>
                <AntDesign name="sharealt" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingLeft: 5,
              height: height / 10,
              flexDirection: "row",
              alignItems: "center",
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "lightgray",
            }}
          >
            {shop ? (
              <>
                <Image
                  style={{ width: width / 5, height: height / 12 }}
                  source={{
                    uri: shop.avatarUrl,
                  }}
                />
                <Text style={{ fontWeight: "bold", paddingLeft: 10 }}>
                  {shop.shopName}
                </Text>
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                    paddingStart: 10,
                    marginStart: 70,
                    borderWidth: 1,
                    borderColor: "#F1582C",
                  }}
                  onPress={() => handleShop(shop._id)}
                >
                  <Text style={{ color: "#F1582C", fontSize: 16 }}>
                    Xem shop
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text>Loading...</Text>
            )}
          </View>
          <View style={{ paddingTop: 10, paddingLeft: 5 }}>
            <Text style={{ fontWeight: "bold" }}>Mô tả sản phẩm:</Text>
            <Text style={{ padding: 10 }}>{product.description}</Text>
          </View>
        </ScrollView>
        <View
          style={{
            height: height / 12,
            backgroundColor: "red",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#12B3AF",
              alignItems: "center",
              justifyContent: "center",
              borderRightColor: "black",
            }}
          >
            <AntDesign name="message1" size={24} color="white" />
            <Text style={{ color: "white", fontSize: 10 }}>Chat ngay</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#0CD44C",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              setModalVisible(!modalVisible);
              setBuyButtonClicked(false);
            }}
          >
            <MaterialCommunityIcons name="cart-plus" size={24} color="white" />
            <Text style={{ color: "white", fontSize: 10 }}>
              Thêm vào giỏ hàng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 2,
              backgroundColor: "red",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              setModalVisible(!modalVisible);
              setBuyButtonClicked(true);
            }}
          >
            <Text style={{ color: "white" }}>Mua sản phẩm</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent
          style={{ width: "100%", height: height / 1.6, alignItems: "center" }}
        >
          <View style={{ justifyContent: "space-between", width: "90%" }}>
            <Text>Lựa chọn:</Text>
            <FlatList
              style={{ height: height / 2.4 }}
              data={product.option}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View
                  style={{
                    marginTop: 10,
                    backgroundColor:
                      idOption === item._id ? "#f95122" : "white",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      setIdOption(item._id);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 0.5,
                      borderColor: "#D8D8D8",
                      padding: 5,
                    }}
                  >
                    <Image
                      style={{ width: 50, height: 50 }}
                      source={{ uri: item?.imageUrl }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: idOption === item._id ? "white" : "black",
                      }}
                    >
                      {" "}
                      {item.name}
                    </Text>
                  </Pressable>
                </View>
              )}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              <Text>Số lượng: </Text>
              {quantity > 1 ? (
                <Pressable
                  onPress={() => setQuantity(quantity - 1)}
                  style={{
                    backgroundColor: "#D8D8D8",
                    padding: 7,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <AntDesign name="minus" size={24} color="black" />
                </Pressable>
              ) : (
                <Pressable
                  style={{
                    backgroundColor: "#6E7280",
                    padding: 7,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <AntDesign name="minus" size={24} color="black" />
                </Pressable>
              )}

              <Pressable
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 18,
                  paddingVertical: 6,
                }}
              >
                <Text>{quantity}</Text>
              </Pressable>

              <Pressable
                onPress={() => setQuantity(quantity + 1)}
                style={{
                  backgroundColor: "#D8D8D8",
                  padding: 7,
                  borderTopLeftRadius: 6,
                  borderBottomLeftRadius: 6,
                }}
              >
                <Feather name="plus" size={24} color="black" />
              </Pressable>
            </View>
          </View>
          {buyButtonClicked ? (
            <Pressable
              style={{
                width: "100%",
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: idOption ? "red" : "gray",
              }}
              // onPress={() => {
              //   if (idOption) {
              //     user !== null ? addToCart(user.user.uid, productId, idOption , quantity) : navigation.navigate('Login'), setModalVisible(!modalVisible);
              //   }
              // }}
            >
              <Text style={{ color: "white" }}>Mua</Text>
            </Pressable>
          ) : (
            <Pressable
              style={{
                width: "100%",
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: idOption ? "red" : "gray",
              }}
              onPress={() => {
                if (idOption) {
                  user !== null
                    ? addToCart(user._id, productId, idOption, quantity)
                    : navigation.navigate("Login"),
                    setModalVisible(!modalVisible);
                }
              }}
            >
              <Text style={{ color: "white" }}>Thêm vào giỏ hàng</Text>
            </Pressable>
          )}
        </ModalContent>
      </BottomModal>
    </>
    // <View>
    //   <Text>Tess</Text>
    // </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({});
