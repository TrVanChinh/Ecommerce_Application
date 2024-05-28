import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  Pressable,
} from "react-native";
import React from "react";
import { useState, useEffect, useLayoutEffect } from "react";
import { Feather, SimpleLineIcons, AntDesign } from "@expo/vector-icons";
import SlideShow from "../slide/OnBoading";
import { useUser } from '../UserContext';
import { API_BASE_URL } from "../Localhost";
import  axios  from "axios";
import ProductItem from "./ProductItem";
import color from "../components/color";
const HomeScreen = ({navigation}) => {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([
        {
          name: "Khung Giờ Săn Sale",
          url: "https://cf.shopee.vn/file/e4a404283b3824c211c1549aedd28d5f",
        },
        {
          name: "Miễn Phí Ship - Có Shopee",
          url: "https://cf.shopee.vn/file/vn-50009109-c7a2e1ae720f9704f92f72c9ef1a494a",
        },
        {
          name: "Voucher Giảm Đến 500.000Đ",
          url: "https://cf.shopee.vn/file/vn-50009109-f6c34d719c3e4d33857371458e7a7059",
        },
        {
          name: "Shopee Siêu Rẻ",
          url: "https://cf.shopee.vn/file/vn-50009109-caaa7ee86cf5c7cd44c831cc33a9115c",
        },
        {
          name: "Mã Giảm Giá",
          url: "https://cf.shopee.vn/file/vn-50009109-8a387d78a7ad954ec489d3ef9abd60b4",
        },
        {
          name: "Hàng Hiệu Outlet Giảm 50%",
          url: "https://cf.shopee.vn/file/vn-50009109-852300c407c5e79bf5dc1854aa0cfeef",
        },
        {
          name: "Nạp Thẻ, Dịch Vụ & Vé Maroon 5",
          url: "https://cf.shopee.vn/file/9df57ba80ca225e67c08a8a0d8cc7b85",
        },
        {
          name: "Xả Kho 12.000 Xu",
          url: "https://cf.shopee.vn/file/vn-50009109-fbc98cb6dcc514259ff797e1b63c5937",
        },
        {
          name: "Hàng Quốc Tế",
          url: "https://cf.shopee.vn/file/a08ab28962514a626195ef0415411585",
        },
        {
          name: "Bắt Trend - Giá Sốc",
          url: "https://cf.shopee.vn/file/vn-50009109-1975fb1af4ae3c22878d04f6f440b6f9",
        },
      ]);
    
  const [product, setProduct] = useState([
    {
      sold: "234",
      price: "221.000đ",
      sale: "-22%",
      introduce: "Áo Nỉ Lót Lông Có Mũ Thời Trang THE GOOD/ Basic Hoodie",
      url: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llei62d3h3go41",
      name: "Áo hoodie nam nữ áo nỉ hoodie basic form rộng",
    },
    {
      sold: "224",
      price: "222.000đ",
      sale: "-37%",
      introduce: "Thắt Lưng Nam PISA Giấu Đuôi Dây Khóa Tự Động Da Bò Thật",
      url: "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lgtepr0mzfoyca",
      name: "Dây nịt thắt lưng nam da bò thật 2 lớp không có khóa đi kèm bền đẹp AMIRCUX",
    },
    {
      sold: "112",
      price: "398.800đ",
      sale: "-25%",
      introduce: "áo khoác gió vansity phối màu đen trắng",
      url: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llv06xeia21ra9",
      name: "Áo khoác bomber nhung tăm cổ bẻ kiểu trơn 1 lớp dày dặn chuẩn form siêu xinh sành điệu cao cấp BẢO ĐĂNG",
    },
    {
      sold: "445",
      price: "34.000đ",
      sale: "-33%",
      introduce: "Sơn Bạc Mạ Crom Sơn Xịt Mạ Chrome Sáng Bóng 350ml",
      url: "https://down-vn.img.susercontent.com/file/sg-11134201-23030-gh8iuwuxc5nv0d",
      name: "SƠN MẠ CROM CAO CẤP Chai 350ML",
    },
    {
      sold: "788",
      price: "1.733.000đ",
      sale: "-55%",
      introduce: "Freedom Mô Hình Nhân Vật gundam eg hg mg z nt unicorn",
      url: "https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lna6ztr124yjb0",
      name: "Mô Hình Ráp Sẵn Metal Build Takeda Shingen Limited Edition Màu đen phiên bản hội chợ WFC2023 của Moshow toys",
    },
    {
      sold: "755",
      price: "242.250đ",
      sale: "-45%",
      introduce:
        "1 Hồ Cá Sinh Thái Để Bàn Trang Trí Rượu hảo hạng của Hãng Marimo Eco",
      url: "https://down-vn.img.susercontent.com/file/d0a017b9eccfbd24cb829da32eb4ceea",
      name: "Bể Cá Nguyên Bộ SOBO - Tích Hợp sẵn Lọc và Đèn bên trong Hồ Cá",
    },
  ]);
  const { height, width } = Dimensions.get("window");

  useEffect(() => {
    fetchDataProduct()
  }, [user]);

  const fetchDataProduct = () => {
    axios.get(`${API_BASE_URL}/products`).then((response) => {
      // console.log(response.data.data);
      setProducts(response.data.data)
    })
    .catch((error) => {
      console.log(error)
    })
  }



 // Navigate to the details screen 
  const handleItemPress = (product) => {
    navigation.navigate("Detail", { product });
  };
  
// Navigate to the search screen 
  const handleSearch = () => {
    navigation.navigate("Search");
  };

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? 30 : 0,
        flex: 1,
        // backgroundColor: "white",
      }}
    >
      <ScrollView>
        <SlideShow style={{flex:2}}/>

        <View
          style={{
            position: "absolute",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 5,
          }}
        >
          <Pressable
            style={{
              height: 40,
              width: "70%",
              marginHorizontal: 10,
              flexDirection: "row",
              borderRadius: 30,
              alignItems: "center",
              backgroundColor: "white",
              padding: 10,
            }}
            onPress={() => handleSearch()}
          >
            <TouchableOpacity
              onPress={() => 
                handleSearch()
              }
            >
              <Feather name="search" size={20} color="#857E7C" />
            </TouchableOpacity>
            <TextInput
              placeholder="Tìm kiếm"
              onChangeText={(text) => {
                setSearch(text);
              }}
              style={{
                height: 35,
                flex: 1,
                marginEnd: 8,
                opacity: 0.5,
                paddingStart: 10,
              }}
              autoCorrect={false}
            />
            <AntDesign name="camerao" size={22} color="#857E7C" />
          </Pressable>
          <Pressable
            onPress={() => {
              user ? navigation.navigate("Cart") : navigation.navigate("Login");
            }}
          >
            <AntDesign
              name="shoppingcart"
              size={24}
              color="white"
              padding={10}
            />
          </Pressable>
          <AntDesign name="message1" size={24} color="white" padding={10} />
        </View>

        <View style={{ flex:2 ,backgroundColor: "white"}}>
          <FlatList
            horizontal
            style={{ flex: 1 }}
            keyExtractor={(item) => item.name}
            data={services}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    alert(`press ${item.name}`);
                  }}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      resizeMode: "cover",
                      borderRadius: 25,
                      margin: 10,
                    }}
                    source={{
                      uri: item.url,
                    }}
                  />
                  <View style={{ width: 60, paddingBottom: 10 }}>
                    <Text style={{ textAlign: "center", fontSize: 10 }}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View>
          <Text style={{ color: "red", fontWeight: "bold", padding: 20 ,backgroundColor: "white"}}>
            FLASH SALE
          </Text>
        </View>
        
        <View style={{flex: 3}}> 
          <FlatList
              horizontal
              style={{ flex: 1, padding:10 }}
              keyExtractor={(item) => item._id}
              data={products}
              renderItem={({ item }) => 
              <ProductItem item={item} onPress={() => handleItemPress(item)}/>}
            />
        </View>
         
        <View>
          <Text style={{ color: "red", fontWeight: "bold", padding: 20 ,backgroundColor: "white",}}>
            GỢI Ý HÔM NAY
          </Text>
        </View>
        <View style={{ flex: 3 }}>
          <FlatList
            horizontal
            style={{ flex: 1, padding:10  }}
            keyExtractor={(item) => item.url}
            data={product}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    alert(`press ${item.price}`);
                  }}
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
                        uri: item.url,
                      }}
                    />
                    {/* <View
                      style={{
                        width: 50,
                        position: "absolute",
                        marginTop: 20,
                        alignItems: "flex-end",
                        backgroundColor: "red",
                      }}
                    >
                      <Text style={{ color: "yellow" }}>{item.sale}</Text>
                    </View> */}
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
            }}
          />
          {/* <FlatList
            horizontal
            style={{ flex: 1 }}
            keyExtractor={(item) => item.url}
            data={product}
            renderItem={({ item }) => <ProductItem item={item} />}
          /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})


//   return (
//     
//   );
// };

