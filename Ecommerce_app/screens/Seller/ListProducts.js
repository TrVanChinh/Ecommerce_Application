import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Feather,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
  Octicons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Image } from "react-native-elements";
import { useUser } from "../../UserContext";
import color from "../../components/color";
import { API_BASE_URL } from "../../Localhost";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
const ListProducts = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const [shopCategory, setShopCategory] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("Tất cả");
  const { updateUser, user } = useUser();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (user) {
      getProductList();
      // getShopCategory();
    }
    // });
  }, []);
  useEffect(() => {
    getProductList();
  }, [isFocused]);
  // useEffect(() => {
  //   if (selectedCategoryId === "") {
  //     setSelectedCategoryName("Tất cả");
  //   } else {
  //     const index = shopCategory.findIndex(
  //       (item) => item.id === selectedCategoryId
  //     );
  //     setSelectedCategoryName(shopCategory[index].name);
  //     getProductByCategory();
  //   }
  // }
  // , [selectedCategoryId]);

  getProductByCategory = async (id, name) => {
    setSelectedCategoryName(name);
    closeModal();
    setLoading(true);
    // setProducts(listproducts);
    setLoading(false);
  };

  const getShopCategory = async () => {
    let temp = [];
    setShopCategory(temp);
  };
  const getProductList = async () => {
    // Lấy user ID
    setSelectedCategoryName("Tất cả");
    closeModal();
    // setLoading(true);
    const listproducts = [];
    axios
      .get(`${API_BASE_URL}/seller/showShopProduct/${user._id}`)
      .then(function (response) {
        let data = response.data.data;
        data.forEach((item) => {          
          if (getMinMaxPrice(item.option).min==getMinMaxPrice(item.option).max){
            item.price= getMinMaxPrice(item.option).min
          }
          else
          {
            item.price =
            getMinMaxPrice(item.option).min +
            " - " +
            getMinMaxPrice(item.option).max;
          }
          listproducts.push(item);
        });
        setProducts(listproducts);
        // setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getMinMaxPrice = (optionItem) => {
    let min = optionItem[0].price;
    let max = optionItem[0].price;
    for (let i = 1; i < optionItem.length; i++) {
      if (optionItem[i].price < min) {
        min = optionItem[i].price;
      }
      if (optionItem[i].price > max) {
        max = optionItem[i].price;
      }
    }
    return { min: min, max: max };
  };
  const closeModal = () => {
    if (isModalVisible) {
      toggleModal();
    }
  };
  return (
    <View style={{ flex: 1 }}>
      {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ margin: 10 }}>Chọn danh mục</Text>
        <TouchableOpacity
          style={{
            paddingHorizontal: 5,
            backgroundColor: "white",

            margin: 5,
            alignItems: "center",
            borderColor: "gray",
            borderWidth: 1,
          }}
          onPress={() => {
            toggleModal();
          }}
        >
          <Text style={{ textAlign: "center", margin: 10 }}>
            -- {selectedCategoryName} --
          </Text>
        </TouchableOpacity>
      </View> */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 10,
              borderRadius: 10,
              width: "90%",
            }}
          >
            {/* button đóng */}
            <TouchableOpacity
              style={{
                marginTop: -10,
                marginRight: -10,
                alignSelf: "flex-end",
              }}
              onPress={closeModal}
            >
              <Ionicons name="close-circle" size={25} color="lightgray" />
            </TouchableOpacity>

            <View style={{ backgroundColor: "white" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                Chọn danh mục cần xem
              </Text>
              <TouchableOpacity
                style={{
                  borderColor: "lightgray",
                  borderWidth: 1,
                  marginVertical: 5,
                  paddingVertical: 5,
                  marginHorizontal: 50,
                }}
                onPress={() => {
                  getProductList();
                }}
              >
                <Text style={{ color: "black", textAlign: "center" }}>
                  Tất cả
                </Text>
              </TouchableOpacity>
              {shopCategory.map((item, key) => (
                <TouchableOpacity
                  key={key}
                  style={{
                    borderColor: "lightgray",
                    borderWidth: 1,
                    marginVertical: 5,
                    paddingVertical: 5,
                    marginHorizontal: 50,
                  }}
                  onPress={() => {
                    getProductByCategory(item.id, item.name);
                  }}
                >
                  <Text style={{ color: "black", textAlign: "center" }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={products}
        style={{ flex: 1, marginTop:20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item._id}
            style={styles.item_prd}
            onPress={() =>
              navigation.navigate("EditProduct", { product: item })
            }
          >
            <Image
              source={{
                uri: item.image[0].url,
              }}
              style={[styles.prd_image, { flex: 1 }]}
            />
            <View style={{ flex: 9, justifyContent: "space-between" }}>
              <Text style={[styles.name_prd]}>{item.name}</Text>
              <Text style={{ marginLeft: 10 }}>
                Đã bán: {item.sold >= 0 ? item.sold : 0}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <Text style={styles.prd_price}>{item.price} vnđ</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

export default ListProducts;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },

  item_prd: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "white",
    marginVertical: 5,
  },

  name_prd: {
    fontWeight: "bold",
    marginLeft: 10,
  },
  prd_image: {
    width: 70,
    height: 70,
    padding: 5,
    margin: 5,
  },
  prd_price: {
    fontWeight: "bold",
    marginBottom: 10,
    marginRight: 10,
    color: "red",
  },

  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
