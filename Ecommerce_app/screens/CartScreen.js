import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { CheckBox, Icon } from 'react-native-elements';
import React, { useEffect, useState, useLayoutEffect, useContext, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { Feather,AntDesign } from "@expo/vector-icons";
import { useUser } from "../UserContext";
import { API_BASE_URL } from "../Localhost";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({navigation}) => {
  const { user, updateAddress, updateShippingUnit } = useUser();
  const[cart,setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [selectAll, setSelectAll] = useState(false);
  const { height, width } = Dimensions.get("window");
  const [reloadCart, setReloadCart] = useState(false);

  const userId = user._id


  const GetCart = async () => {
    axios
    .get(`${API_BASE_URL}/Cart/${userId}`)
    .then((response) => {
      if (response.data.status === "FAILED") {
        alert(response.data.message); 
        console.log(response.data.message);
      } else {
        setCart(response.data.data);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    if (reloadCart) {
      GetCart();
      setReloadCart(false);
    }
  }, [reloadCart]);
  
  useFocusEffect(
    React.useCallback(() => {
      console.log('Trang Cart đã được tập trung');
      GetCart()
    }, [])
  );
  
  const increaseQuantity = async (userId, cartId) => {
    const productInfo = {
      cartId: cartId,
      userId: userId,
    }
    axios.post(`${API_BASE_URL}/cart/increaseQuantity`,productInfo).then((response) => {
      if (response.data.status === "FAILED") {
        alert(response.data.message); 
        console.log(response.data.message);
      } else {
        setReloadCart(true);
        console.log(response.data.message)

      }
    })
    .catch((error) => {
      alert("Login Error")
      console.log(error)
    })
  };

  const decrementQuantity = async (userId, cartId) => {
    const productInfo = {
      cartId: cartId,
      userId: userId,
    }
    axios.post(`${API_BASE_URL}/cart/decrementQuantity`,productInfo).then((response) => {
      if (response.data.status === "FAILED") {
        alert(response.data.message); 
        console.log(response.data.message);
      } else {
        setReloadCart(true);
        console.log(response.data.message)

      }
    })
    .catch((error) => {
      alert("Login Error")
      console.log(error)
    })
  };
  

  const removeFromCart = async (userId, cartId) => {
    const productInfo = {
      cartId: cartId,
      userId: userId,
    }
    axios.post(`${API_BASE_URL}/cart/removeFromCart`,productInfo).then((response) => {
      if (response.data.status === "FAILED") {
        alert(response.data.message); 
        console.log(response.data.message);
      } else {
        setReloadCart(true);
        console.log(response.data.message)

      }
    })
    .catch((error) => {
      alert("Login Error")
      console.log(error)
    })
  };

useEffect(() => {
    const calculateTotal = () => {
      if (cart != null) { 
      let total = 0;
      cart.forEach(item => {
        if (item.checked) {
          total += item.quantity * item.option.price;
        }
      });
      setTotal(total);
    };
  }
  calculateTotal();
}, [cart]);

const handleCheckboxChange = (itemId) => {
  setCart((prevData) =>
      prevData?.map((item) =>
        item._id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
};

const handleSelectAll = () => {
  const newSelectAll = !selectAll;
  setSelectAll(newSelectAll);
  setCart((prevData) =>
    prevData?.map((item) => ({ ...item, checked: newSelectAll }))
  );
};

const handleItemCart = () => {
  let products = [];
  let exceededQuantity = false; // Biến để kiểm tra xem có sản phẩm vượt quá số lượng không
  cart.forEach(item => {
    if (item.checked) {
      if (item.option.quantity < item.quantity) {
        exceededQuantity = true; // Đánh dấu có sản phẩm vượt quá số lượng
        return; // Dừng vòng lặp ngay khi có sản phẩm vượt quá số lượng
      }
      products.push(item);
    } 
  })

  if (exceededQuantity) {
    alert("Có sản phẩm vượt quá số lượng cho phép");
    return;
  }

  console.log(cart)
  const valueToStore = JSON.stringify(products);
  AsyncStorage.setItem("productsAreOrdered", valueToStore)
  // updateProduct(products)
  updateAddress(null)
  updateShippingUnit(null)
  if(products.length === 0) {
    alert("Vui lòng chọn sản phẩm bạn muốn mua")
  } else {
    navigation.navigate('Order');
  }  
};

 
  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}> 
        <View style={{ marginHorizontal: 10 }}>
        
        {cart?.map((item, index) =>
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
              <View style={{
                  flexDirection: "row",
                }}>
              <CheckBox
                checked={item.checked}
                checkedIcon="check-square"
                checkedColor="black"
                onPress={() => handleCheckboxChange(item._id)}
              />
              <Pressable
                style={{
                  flexDirection: "row",
                }}
                onPress={() =>  navigation.navigate('Detail', {product: item.product})}
              >
                <View style={{
                  paddingRight: 10,
                }}>
                  <Image
                    style={{ width: 100, height: 120, resizeMode: "contain",  }}
                    source={{uri: item?.option.imageUrl}}
                  />
                </View>
   
                <View>
                  <Text numberOfLines={3} style={{ width: 200, fontSize:16, marginTop: 10 }}>
                  {item?.product.name} - {item?.option.name}
                  </Text>
                  <Text
                    style={{ color:'red',fontSize: 15, fontWeight: "bold", marginTop: 6 }}
                  >
                    {item?.option.price} đ 
                  </Text>
                
                </View>
              </Pressable>
              </View>
              <Pressable
                style={{
                  marginTop: 15,
                  marginBottom: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: "center",
                  gap: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 7,
                  }}
                >
                  {item.quantity > 1 ? (
                    <Pressable
                      style={{
                        backgroundColor: "#D8D8D8",
                        padding: 7,
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                      }}
                      onPress={() => decrementQuantity(userId, item._id)}
                    >
                      <AntDesign name="minus" size={20} color="black" />
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
                      <AntDesign name="minus" size={20} color="black" />
                    </Pressable>
                  )}
  
                  <Pressable
                    style={{
                      backgroundColor: "white",
                      paddingHorizontal: 18,
                      paddingVertical: 6,
                    }}
                  >
                    <Text>{item.quantity}</Text>
                  </Pressable>
  
                  <Pressable
                    style={{
                      backgroundColor: "#D8D8D8",
                      padding: 7,
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }}
                    onPress={() => increaseQuantity(userId, item._id)}
                  >
                    <Feather name="plus" size={20} color="black" />
                  </Pressable>
                </View>
                <Pressable
                  style={{
                    backgroundColor: "white",
                    paddingHorizontal: 8,
                    paddingVertical: 10,
                    borderRadius: 5,
                    borderColor: "#C0C0C0",
                    borderWidth: 0.6,
                  }}
                  onPress={() => removeFromCart(userId, item._id)}
                >
                  <Text>Xóa</Text>
                </Pressable>
              </Pressable>
            </View>
        )}
        </View>
        
      </ScrollView>
      <View style={{ height:height/12, flexDirection:'row', padding: 5,}}> 
          <CheckBox 
            title="Chọn tất cả" 
            checkedIcon="check-square"
            checkedColor="black"
            checked={selectAll} 
            onPress={handleSelectAll}
            />
          <View style={{ padding: 5, alignItems: "center" , width:120
            }}>
            <Text style={{ fontSize: 15, fontWeight: "300" }}>Tổng cộng :</Text>
            <Text style={{ fontSize: 15, color:'red', fontWeight: "300" }}>{total}đ</Text>
          </View>
        <Pressable
          // onPress={() => navigation.navigate("Confirm")}
          style={{
            backgroundColor: "red",
            padding: 10,
            marginLeft:10,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            width: 90,
          }}
          onPress={() => handleItemCart()}
        >
          <Text style={{ color:'white'}}>Mua</Text>
        </Pressable>
      </View> 
    </> 
 
)
};

export default CartScreen;

const styles = StyleSheet.create({});
