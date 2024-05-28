import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  SafeAreaView,
  Dimensions,
  ScrollView,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";

import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import color from "../components/color";
import Modal from "react-native-modals";
import { useUser } from "../UserContext";
import { API_BASE_URL } from "../Localhost";
import axios from "axios";
import ProductItem from "./ProductItem";

const SearchScreen = ({ navigation, route }) => {
  const { height, width } = Dimensions.get("window");
  const [searchText, setSearchText] = useState("");
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [arrange, setArrange] = useState(false);
  const [searchStatus, setSearchStatus] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalCategoryVisible, setModalCategoryVisible] = useState(false);
  const [maximumPrice, setMaximumPrice] = useState();
  const [minimumPrice, setMinimumPrice] = useState();
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [year, setYear] = useState([]);
  const [itemYear, setItemYear] = useState();

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = () => {
    axios
      .get(`${API_BASE_URL}/showCategory`)
      .then((response) => {
        // console.log(response.data.data);
        setCategory(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getProductByCategory = (idCategory) => {
    setItemYear(null);
    setMinimumPrice(null);
    setMaximumPrice(null);
    axios
      .get(`${API_BASE_URL}/product/category/${idCategory}`)
      .then((response) => {
        // console.log(response.data.data);
        setProduct(response.data.data);
        getUniqueYears(response.data.data);
        setSearchStatus(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchDataProduct = () => {
    axios
      .get(`${API_BASE_URL}/products`)
      .then((response) => {
        console.log("hdhd",response.data.data);
        setProduct(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchData = () => {
    setItemYear(null);
    setMinimumPrice(null);
    setMaximumPrice(null);
    try {
      axios
        .get(`${API_BASE_URL}/product/searchProduct`, {
          params: { searchText },
        })
        .then((response) => {
          if (response.data.status === "FAILED") {
            alert(response.data.message);
            console.log(response.data.message);
          } else {
            if (response.data.data.length !== 0) {
              setSearchStatus(true);
              setProduct(response.data.data);
              getUniqueYears(response.data.data);
            } else {
              console.log("heheh")
              setSearchStatus(false);
              fetchDataProduct();
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Navigate to the details screen
  const handleItemPress = (product) => {
    navigation.navigate("Detail", { product });
  };

  // // Sắp xếp sản phẩm từ thấp đến cao
  const sortProductsByLowToHigh = (products) => {
    setArrange(!arrange);
    return products.sort((a, b) => {
      const priceA = parseInt(a.option[0].price, 10);
      const priceB = parseInt(b.option[0].price, 10);
      return priceA - priceB;
    });
  };

  // // Sắp xếp sản phẩm từ cao đến thấp
  const sortProductsByHighToLow = (products) => {
    setArrange(!arrange);
    return products.sort((a, b) => {
      const priceA = parseInt(a.option[0].price, 10);
      const priceB = parseInt(b.option[0].price, 10);
      return priceB - priceA;
    });
  };

  // Sắp xếp mảng theo điều kiện bán chạy nhất (sold)
  const sortProductsBySold = (products) => {
    const sortProductsBySold = products.sort((a, b) => {
      const soldA = parseInt(a.sold);
      const soldB = parseInt(b.sold);
      return soldB - soldA;
    });
    // In ra mảng đã sắp xếp
    setProduct(sortProductsBySold);
    setUpdateTrigger((prevState) => !prevState);
  };

  // Sắp xếp mảng theo điều kiện atCreate từ mới nhất đến cũ nhất
  const sortByCreatedAt = (products) => {
    const sortbyCreateAtproduct = products.sort((a, b) => {
      const aTimestamp = new Date(a.createAt).getTime();
      const bTimestamp = new Date(b.createAt).getTime();
      // So sánh theo timestamp
      return bTimestamp - aTimestamp;
    });
    // In ra mảng đã sắp xếp
    setProduct(sortbyCreateAtproduct);
    setUpdateTrigger((prevState) => !prevState);
  };

  const getYearFromAtCreate = (atCreate) => {
    const atCreateTimestamp = new Date(atCreate);
    return atCreateTimestamp.getFullYear();
  };

  const getUniqueYears = (product) => {
    const uniqueYears = [];

    product.forEach((product) => {
      const atCreate = product.createAt;
      const year = getYearFromAtCreate(atCreate);

      // Kiểm tra xem năm đã tồn tại trong mảng chưa
      if (!uniqueYears.includes(year)) {
        uniqueYears.push(year);
      }
    });

    setYear(uniqueYears);
    setItemYear(uniqueYears);
    console.log("nam", uniqueYears);
  };
  //lọc
  const filterProduct = (products, minPrice, maxPrice) => {
    if (searchStatus === true) {
      const filteredProducts = products.filter((product) => {
        const price = product.option[0].price;
        const atCreate = product.createAt;
        const year = getYearFromAtCreate(atCreate);
        console.log("min", minPrice, "max", maxPrice, "year", itemYear);
        
        if ( itemYear!=null && minPrice!=null && maxPrice!=null) {
          return year === itemYear && price >= minPrice && price <= maxPrice;
        } else if (itemYear!=null && maxPrice!=null ) {
            return year === itemYear && price <= maxPrice;
        } else if (itemYear!=null && minPrice!=null) {
            return year === itemYear && price >= minPrice;
        } else if (maxPrice!=null && minPrice!=null) {
            return price >= minPrice && price <= maxPrice ;
        } else if (itemYear!=null) {
            return year === itemYear;
        } else if (maxPrice!=null) {
            return price <= maxPrice;
        } else if (minPrice!=null) {
            return price >= minPrice;
        }
      
      });
      setItemYear(null);
      setMinimumPrice(null);
      setMaximumPrice(null);
      setProduct(filteredProducts);
      setModalVisible(!isModalVisible);
    }
  };

  //Điều hướng sang màn hình chi tiết và gửi ID của sản phẩm

  const toggleModal = () => {
    setItemYear(null);
    setMinimumPrice(null);
    setMaximumPrice(null);
    setModalVisible(!isModalVisible);
  };

  const toggleModalCategory = () => { 
    setModalCategoryVisible(!isModalCategoryVisible);
  };
  return (
    <>
      <View style={{ flex: 1, paddingTop: 30 }}>
        <View
          style={{
            height: 60,
            marginHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable onPress={toggleModalCategory}>
            <Ionicons name="menu-outline" size={24} color="#857E7C" />
          </Pressable>

          <View
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
          >
            <Pressable
              onPress={() => {
                if (searchText == "") {
                  alert("Xin mời bạn nhập sản phẩm");
                } else {
                  fetchData();
                }
              }}
            >
              <Feather name="search" size={20} color="#857E7C" />
            </Pressable>
            <TextInput
              onChangeText={(text) => {
                setSearchText(text);
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
          </View>

          <Pressable onPress={toggleModal}>
            <Feather name="filter" size={24} color="#857E7C" />
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <Pressable
            style={styles.buttonArrange}
            onPress={() => sortByCreatedAt(product)}
          >
            <Text style={{ color: "black" }}>Mới nhất</Text>
          </Pressable>
          <Pressable
            style={styles.buttonArrange}
            onPress={() => sortProductsBySold(product)}
          >
            <Text style={{ color: "black" }}>Bán chạy</Text>
          </Pressable>
          {arrange ? (
            <Pressable
              style={styles.buttonArrange}
              onPress={() => sortProductsByLowToHigh(product)}
            >
              <Text style={{ color: "black", paddingRight: 2 }}>Giá</Text>
              <AntDesign name="caretdown" size={24} color="black" />
            </Pressable>
          ) : (
            <Pressable
              style={styles.buttonArrange}
              onPress={() => sortProductsByHighToLow(product)}
            >
              <Text style={{ color: "black", paddingRight: 2 }}>Giá</Text>
              <AntDesign name="caretup" size={24} color="black" />
            </Pressable>
          )}
        </View>
        {searchStatus ? ( 
          <View style={{ flex: 1 }}>
            <FlatList
              numColumns={2}
              data={product}
              renderItem={({ item }) => (
                <ProductItem
                  item={item}
                  onPress={() => handleItemPress(item)}
                />
              )}
            />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View
              style={{
                width: width,
                height: height / 7,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color:  "black"  }}>
                Không tìm thấy sản phẩm nào
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 20,
              }}
            >
              <View
                style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD" }}
              ></View>
              <Text style={{ color: "black" }}>Có thể bạn cũng thích</Text>
              <View
                style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD" }}
              ></View>
            </View>
            <FlatList
              numColumns={2}
              data={product}
              renderItem={({ item }) => {
                return (
                  <ProductItem
                    item={item}
                    onPress={() => handleItemPress(item)}
                  />
                );
              }}
            />
          </View>
        )}
      </View>
      <Modal
        visible={isModalVisible}
        animationDuration={300}
        swipeDirection="right"
        swipeThreshold={100}
        modalStyle={{
          width: width * 0.8,
          height: height / 2,
          backgroundColor: "white",
          marginTop: 30,
        }}
        onTouchOutside={toggleModal}
        onSwipeOut={toggleModal}
      >
        <View style={{ flex: 1 , padding: 10}}>
          <Text
            style={styles.titleOfCategory}
          >
            Bộ lọc tìm kiếm
          </Text>
          <View style={{ height: "80%", padding: 10 }}>
            <View>
              <Text>Khoảng giá (đ)</Text>
              <View
                style={{
                  flexDirection: "row",
                  paddingVertical: 10,
                  alignItems: "center",
                }}
              >
                <TextInput
                  onChangeText={(text) => {
                    setMinimumPrice(text);
                  }}
                  style={{
                    height: 35,
                    flex: 1,
                    marginHorizontal: 10,
                    borderRadius: 5,
                    paddingStart: 30,
                    borderWidth: 0.5,
                  }}
                  autoCorrect={false}
                  value={minimumPrice}
                  placeholder="TỐI THIỂU"
                  keyboardType="numeric"
                />
                <Text>-</Text>
                <TextInput
                  onChangeText={(text) => {
                    setMaximumPrice(text);
                  }}
                  style={{
                    height: 35,
                    flex: 1,
                    marginHorizontal: 10,
                    borderRadius: 5,
                    paddingStart: 30,
                    borderWidth: 0.5,
                  }}
                  autoCorrect={false}
                  value={maximumPrice}
                  placeholder="TỐI ĐA"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View>
              <Text>Năm</Text>
              <FlatList
                style={{
                  height: height * 0.4,
                  width: width * 0.6,
                  alignSelf: "center",
                }}
                data={year}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setItemYear(item);
                    }}
                    style={{
                      flexDirection: "row",
                      marginTop: 10,
                      width: "100%",
                      alignItems: "center",
                      borderWidth: 0.5,
                      borderColor: "#D8D8D8",
                      padding: 5,
                      backgroundColor: itemYear === item ? "#f95122" : "white",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        alignSelf: "center",
                        color: itemYear === item ? "white" : "black",
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
            <Text>Nội dung</Text>
          </View>
          <View
            style={{ padding: 5, flexDirection: "row", alignSelf: "center" }}
          >
            <TouchableOpacity
              style={{
                width: 100,
                alignItems: "center",
                borderWidth: 0.5,
                padding: 10,
              }}
              onPress={() => {
                setItemYear(null);
                setMinimumPrice(null);
                setMaximumPrice(null);
              }}
            >
              <Text>Thiết lập lại</Text>
            </TouchableOpacity>
            <View style={{ width: 10 }}></View>
            <TouchableOpacity
              style={{
                width: 100,
                alignItems: "center",
                borderWidth: 0.5,
                padding: 10,
              }}
              onPress={() => filterProduct(product, minimumPrice, maximumPrice)}
            >
              <Text>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isModalCategoryVisible}
        animationIn="slideInLeft"
        animationOut="slideOutRight"
        swipeThreshold={100}
        swipeDirection="left"
        modalStyle={{
          width: width * 0.8, 
          height: height *0.4,
          backgroundColor: "white",
          position: "absolute", // Sử dụng absolute để có thể điều chỉnh vị trí
          bottom: 20, // Điều chỉnh vị trí từ phía trên
          right: -150,
        }}
        onTouchOutside={toggleModalCategory}
        onSwipeOut={toggleModalCategory}
      >
        <View style={{ flex: 1, padding:10   }}>
          <Text style = {styles.titleOfCategory}>Danh mục</Text>
          <FlatList
            style={{ flex: 1}}
            keyExtractor={(item) => item._id}
            data={category}
            renderItem={({ item }) => {
              return (
                <Pressable 
                  style= {{ flexDirection:"row", paddingVertical:10, justifyContent:'space-between'}}
                  onPress={() => {
                    getProductByCategory(item._id);
                    toggleModalCategory();
                  }}
                >
                  <Text>{item.name}</Text>
                  <AntDesign name="right" size={20} color="black" />
                </Pressable>
              )
            }}
          />
        </View>
      </Modal>
    </>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  buttonArrange: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    margin: 2,
    justifyContent: "center",
    height: 40,
  },

  titleOfCategory: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
  }
});
