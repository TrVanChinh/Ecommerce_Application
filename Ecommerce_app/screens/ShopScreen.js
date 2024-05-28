import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput,
    Image,
    Dimensions,
    FlatList,
  } from "react-native";
  import { CheckBox, Icon } from "react-native-elements";
  import React, {
    useEffect,
    useState,
    useLayoutEffect,
    useContext,
    useCallback,
  } from "react";
  import { useFocusEffect } from "@react-navigation/native";
  import { Feather, AntDesign, SimpleLineIcons } from "@expo/vector-icons";
  import { useUser } from "../UserContext";
  import { API_BASE_URL } from "../Localhost";
  import axios from "axios";
  import ProductItem from "./ProductItem";

  const ShopScreen = ({ navigation, route }) => {
    const { idShop } = route.params;
    // console.log("shop",idShop)
    const { height, width } = Dimensions.get("window");
    const [menu, setMenu] = useState(true);
    const [products, setProducts] = useState([]);
    const [shop, setShop] = useState([]);
    const [categoryShop, setCategoryShop] = useState([]);

    useEffect(() => {
      fetchData(idShop);
      setCategoryShop(shop.categoryShop)
    }, [idShop]);
  
    const fetchData = async (idShop) => {
      axios
      .get(`${API_BASE_URL}/detail/shop/${idShop}`)
      .then((response) => {
        if (response.data.status === "FAILED") {
            alert(response.data.message); 
            console.log(response.data.message);
          } else {
            setShop(response.data.user);
            setProducts(response.data.products);
          }
      })
      .catch((error) => {
        console.log(error);
      });
    };
  
    const handleItem = (product) => {
      navigation.navigate("Detail", { product });
    };
  
    return (
      <View>
        <View
          style={{
            height: height * 0.12,
            width: width,
            backgroundColor: "#F1582C",
            justifyContent: "space-between",
            flexDirection: "row",
            padding: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{ width: 60, height: 60, borderRadius: 26 }}
              source={{
                uri: shop.avatarUrl,
              }}
            />
            <Text
              style={{
                fontWeight: "bold",
                color: "white",
                fontSize: 18,
                paddingLeft: 10,
              }}
            >
              {shop.shopName}
            </Text>
          </View>
          <Pressable
            style={{
              paddingHorizontal: 16,
              borderRadius: 5,
              backgroundColor: "white",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#F1582C", fontSize: 14 }}>Theo dõi</Text>
          </Pressable>
        </View>
        <View
          style={{
            height: height * 0.06,
            width: width,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable
            style={{
              ...styles.buttonArrange,
              borderColor: menu ? "#F1582C" : "white",
            }}
            onPress={() => setMenu(true)}
          >
            <Text>Sản phẩm</Text>
          </Pressable>
  
          <Pressable
            style={{
              ...styles.buttonArrange,
              borderColor: !menu ? "#F1582C" : "white",
            }}
            onPress={() => setMenu(false)}
          >
            <Text>Danh mục</Text>
          </Pressable>
        </View>
        {/* <View
          style={{
            height: height * 0.88,
            width: width,
            backgroundColor: "green",
          }}
        >
          <Text>List</Text>
        </View> */}
        {menu ? (
          <View style={{ height: height * 0.75 }}>
            <FlatList
              numColumns={2}
              data={products}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => 
              <ProductItem item={item} onPress={() => handleItem(item)}/>}
            />
          </View>
        ) : (
          <View style={{ height: height * 0.88 }}>
            <ScrollView>
              {categoryShop?.map((item, index) => (
                <View key={index}>
                  <Pressable style={styles.list_items}>
                    <View
                      style={{
                        alignItems: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 10,
                      }}
                    >
                      <Text>{item.name}</Text>
                    </View>
                    <View
                      style={{
                        alignItems: "flex-end",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text></Text>
                      <SimpleLineIcons
                        marginLeft={15}
                        name="arrow-right"
                        size={10}
                        color="#60698a"
                      />
                    </View>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };
  
  export default ShopScreen;
  
  const styles = StyleSheet.create({
    buttonArrange: {
      flexDirection: "row",
      flex: 1,
      borderColor: "white",
      borderBottomWidth: 2,
      alignItems: "center",
      justifyContent: "center",
      height: 40,
    },
    list_items: {
      marginVertical: 1,
      width: "100%",
      alignItems: "center",
      flexDirection: "row",
      padding: 10,
      justifyContent: "space-between",
      backgroundColor: "white",
    },
  });
  